import prisma from "../../utils/client";
import { z } from "zod";

type CreateShopProps = {
  name: string;
  description?: string;
};

class ShopAction {
  static validate(data: CreateShopProps) {
    const schema = z.object({
      name: z.string().min(2, "Shop name must be at least 2 characters"),
      description: z.string().optional(),
    });

    return schema.safeParse(data);
  }

  static async findByOwner(ownerId: string) {
    try {
      return await prisma.shop.findFirst({
        where: {
          ownerId,
          deletedAt: null,
        },
      });
    } catch (error) {
      console.error("Error finding shop by owner:", error);
      throw error;
    }
  }

  static async create(data: CreateShopProps, ownerId: string) {
    try {
      return await prisma.shop.create({
        data: {
          name: data.name,
          description: data.description,
          ownerId,
        },
      });
    } catch (error) {
      console.error("Error creating shop:", error);
      throw error;
    }
  }
}

export default ShopAction;
