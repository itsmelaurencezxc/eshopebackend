import prisma from "../../utils/client";

class ProductBrowseAction {
  // Public catalog search — matches "shoes" against name/description
  // regardless of brand, since brand isn't its own field; `category`
  // narrows it further when the buyer picks a category filter.
  static async search(query?: string, category?: string) {
    try {
      return await prisma.product.findMany({
        where: {
          deletedAt: null,
          ...(query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                ],
              }
            : {}),
          ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
        },
        include: {
          shop: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  static async findBySlug(slug: string) {
    try {
      return await prisma.product.findFirst({
        where: { slug, deletedAt: null },
        include: {
          shop: { select: { id: true, name: true } },
        },
      });
    } catch (error) {
      console.error("Error finding product by slug:", error);
      throw error;
    }
  }
}

export default ProductBrowseAction;
