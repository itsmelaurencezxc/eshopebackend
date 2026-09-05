import prisma from "../../utils/client";
import { z } from "zod";

type CreateProductProps = {
  name: string;
  description?: string;
  category?: string;
  price: number;
  compareAtPrice?: number;
  stock?: number;
  images?: string[];
};

type UpdateProductProps = Partial<CreateProductProps>;

class ProductAction {
  static validateCreate(data: unknown) {
    const schema = z.object({
      name: z.string().min(2, "Product name must be at least 2 characters"),
      description: z.string().optional(),
      category: z.string().optional(),
      price: z.number().positive("Price must be greater than 0"),
      compareAtPrice: z.number().positive().optional(),
      stock: z.number().int().min(0).optional(),
      images: z.array(z.string().url("Each image must be a valid URL")).optional(),
    });

    return schema.safeParse(data);
  }

  static validateUpdate(data: unknown) {
    const schema = z.object({
      name: z.string().min(2, "Product name must be at least 2 characters").optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      price: z.number().positive("Price must be greater than 0").optional(),
      compareAtPrice: z.number().positive().optional(),
      stock: z.number().int().min(0).optional(),
      images: z.array(z.string().url("Each image must be a valid URL")).optional(),
    });

    return schema.safeParse(data);
  }

  // Turns "Nike Running Shoes" into "nike-running-shoes", and appends
  // -2, -3, etc. if that slug is already taken (slug is @unique in the DB).
  static async generateUniqueSlug(name: string) {
    const base = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let slug = base;
    let suffix = 2;

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix}`;
      suffix++;
    }

    return slug;
  }

  static async create(data: CreateProductProps, shopId: string) {
    try {
      const slug = await this.generateUniqueSlug(data.name);

      return await prisma.product.create({
        data: {
          shopId,
          name: data.name,
          slug,
          description: data.description,
          category: data.category,
          price: data.price,
          compareAtPrice: data.compareAtPrice,
          stock: data.stock ?? 0,
          images: data.images ?? [],
        },
      });
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  static async findByShop(shopId: string) {
    try {
      return await prisma.product.findMany({
        where: { shopId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error listing shop products:", error);
      throw error;
    }
  }

  // Scoped lookup: only returns the product if it belongs to this shop,
  // so a seller can never touch another shop's product by guessing an id.
  static async findByIdForShop(id: string, shopId: string) {
    try {
      return await prisma.product.findFirst({
        where: { id, shopId, deletedAt: null },
      });
    } catch (error) {
      console.error("Error finding product for shop:", error);
      throw error;
    }
  }

  static async update(id: string, data: UpdateProductProps) {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          price: data.price,
          compareAtPrice: data.compareAtPrice,
          stock: data.stock,
          images: data.images,
        },
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async softDelete(id: string) {
    try {
      return await prisma.product.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

export default ProductAction;
