import prisma from "../../utils/client";
import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

const SHIPPING_FEE = 50;

class OrderAction {
  static validateCheckout(data: unknown) {
    const schema = z.object({
      shippingAddress: z.string().min(5, "Shipping address is too short"),
      paymentMethod: z.nativeEnum(PaymentMethod),
    });

    return schema.safeParse(data);
  }

  // Turns the buyer's cart into an Order: snapshots each item's current
  // price (so a later price change never rewrites past orders), decrements
  // stock, then empties the cart — all in one transaction so a failure
  // partway through (e.g. an item goes out of stock) leaves nothing half-done.
  static async checkout(
    userId: string,
    data: { shippingAddress: string; paymentMethod: PaymentMethod }
  ) {
    try {
      return await prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
          where: { userId },
          include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
          throw new Error("EMPTY_CART");
        }

        for (const item of cart.items) {
          if (item.product.deletedAt) {
            throw new Error(`PRODUCT_UNAVAILABLE:${item.product.name}`);
          }
          if (item.product.stock < item.quantity) {
            throw new Error(`OUT_OF_STOCK:${item.product.name}`);
          }
        }

        const subtotal = cart.items.reduce(
          (sum, item) => sum + Number(item.product.price) * item.quantity,
          0
        );
        const total = subtotal + SHIPPING_FEE;

        const order = await tx.order.create({
          data: {
            userId,
            shippingAddress: data.shippingAddress,
            paymentMethod: data.paymentMethod,
            subtotal,
            shippingFee: SHIPPING_FEE,
            total,
            items: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
          include: { items: true },
        });

        for (const item of cart.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return order;
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
    }
  }

  static async findByUser(userId: string) {
    try {
      return await prisma.order.findMany({
        where: { userId },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error listing orders:", error);
      throw error;
    }
  }

  static async findByIdForUser(id: string, userId: string) {
    try {
      return await prisma.order.findFirst({
        where: { id, userId },
        include: { items: { include: { product: true } } },
      });
    } catch (error) {
      console.error("Error finding order:", error);
      throw error;
    }
  }
}

export default OrderAction;
