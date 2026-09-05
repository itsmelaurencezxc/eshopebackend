import { Request, Response } from "express";
import ProductBrowseAction from "../../action/user/ProductBrowseAction";
import AppResponse from "../../utils/AppResponse";

class ProductBrowseController {
  async browse(req: Request, res: Response) {
    try {
      const query = typeof req.query.q === "string" ? req.query.q : undefined;
      const category =
        typeof req.query.category === "string" ? req.query.category : undefined;

      const products = await ProductBrowseAction.search(query, category);
      return AppResponse.sendSuccess({
        res,
        data: products,
        code: 200,
      });
    } catch (error) {
      return AppResponse.sendErrors({
        res,
        message: "Internal server error",
        data: null,
        code: 500,
      });
    }
  }

  async detail(req: Request, res: Response) {
    try {
      const product = await ProductBrowseAction.findBySlug(req.params.slug);

      if (!product) {
        return AppResponse.sendErrors({
          res,
          message: "Product not found",
          data: null,
          code: 404,
        });
      }

      return AppResponse.sendSuccess({
        res,
        data: product,
        code: 200,
      });
    } catch (error) {
      return AppResponse.sendErrors({
        res,
        message: "Internal server error",
        data: null,
        code: 500,
      });
    }
  }
}

export default ProductBrowseController;
