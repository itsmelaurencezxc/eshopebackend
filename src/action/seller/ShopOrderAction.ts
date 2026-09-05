import prisma from "../../utils/client";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";

// Seller can only push the order one step forward at a time.
// CANCELLED is a buyer-only action (see OrderAction.cancel), not reachable here.
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "PAID",
  PAID: "SHIPPED",
  SHIPPED: "DELIVERED",
};

// One buyer Order can contain products from more than one shop, so a
// seller should only ever see the items that belong to their own shop —
// never the buyer's other purchases from a different seller in the same
// order. We query OrderItem (scoped to this shop's products) instead of
// Order, then group the results back into one row per order.
class ShopOrderAction {
  static async findByShop(shopId: string) {
    try {
      const items = await prisma.orderItem.findMany({
        where: { product: { shopId } },
        include: {
          product: { select: { id: true, name: true } },
          order: {
            include: {
              user: { select: { userEmail: true, userContact: true } },
            },
          },
        },
        orderBy: { order: { createdAt: "desc" } },
      });

      const grouped = new Map<string, any>();

      for (const item of items) {
        if (!grouped.has(item.orderId)) {
          grouped.set(item.orderId, {
            orderId: item.orderId,
            createdAt: item.order.createdAt,
            status: item.order.status,
            paymentMethod: item.order.paymentMethod,
            shippingAddress: item.order.shippingAddress,
            buyer: item.order.user,
            items: [],
          });
        }

        grouped.get(item.orderId).items.push({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
        });
      }

      return Array.from(grouped.values());
    } catch (error) {
      console.error("Error listing shop orders:", error);
      throw error;
    }
  }

  static validateStatusUpdate(data: unknown) {
    const schema = z.object({
      status: z.enum(["PAID", "SHIPPED", "DELIVERED"]),
    });

    return schema.safeParse(data);
  }

  static async updateStatus(
    orderId: string,
    shopId: string,
    status: OrderStatus
  ) {
    try {
      const belongsToShop = await prisma.orderItem.findFirst({
        where: { orderId, product: { shopId } },
      });
      if (!belongsToShop) {
        throw new Error("NOT_YOUR_ORDER");
      }

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) {
        throw new Error("NOT_YOUR_ORDER");
      }

      if (NEXT_STATUS[order.status] !== status) {
        throw new Error(
          `INVALID_TRANSITION:${order.status} -> ${status} is not allowed`
        );
      }

      return await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }
}

export default ShopOrderAction;
