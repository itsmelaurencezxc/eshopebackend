import prisma from "../../utils/client";
import { z } from "zod";

class CartAction {
  static validateAddItem(data: unknown) {
    const schema = z.object({
      productId: z.string().uuid("Invalid product id"),
      quantity: z.number().int().positive().default(1),
    });

    return schema.safeParse(data);
  }

  static validateUpdateItem(data: unknown) {
    const schema = z.object({
      quantity: z.number().int().min(0, "Quantity must be 0 or more"),
    });

    return schema.safeParse(data);
  }

  // Every account has exactly one cart. Create it lazily on first use
  // instead of at registration, so we don't leave empty carts lying around.
  static async findOrCreateByUser(userId: string) {
    try {
      const existing = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (existing) return existing;

      return await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    } catch (error) {
      console.error("Error getting/creating cart:", error);
      throw error;
    }
  }

  static async addItem(userId: string, productId: string, quantity: number) {
    try {
      const product = await prisma.product.findFirst({
        where: { id: productId, deletedAt: null },
      });
      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const cart = await this.findOrCreateByUser(userId);

      return await prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        update: { quantity: { increment: quantity } },
        create: { cartId: cart.id, productId, quantity },
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  }

  static async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ) {
    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        throw new Error("ITEM_NOT_FOUND");
      }

      if (quantity === 0) {
        return await this.removeItem(userId, productId);
      }

      try {
        return await prisma.cartItem.update({
          where: { cartId_productId: { cartId: cart.id, productId } },
          data: { quantity },
        });
      } catch (error) {
        throw new Error("ITEM_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  }

  static async removeItem(userId: string, productId: string) {
    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        throw new Error("ITEM_NOT_FOUND");
      }

      try {
        return await prisma.cartItem.delete({
          where: { cartId_productId: { cartId: cart.id, productId } },
        });
      } catch (error) {
        throw new Error("ITEM_NOT_FOUND");
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error;
    }
  }
}

export default CartAction;
