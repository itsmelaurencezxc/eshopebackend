import { Request, Response } from "express";
import ProductAction from "../../action/seller/ProductAction";
import ShopAction from "../../action/seller/ShopAction";
import AppResponse from "../../utils/AppResponse";

class ProductController {
  async create(req: Request, res: Response) {
    const result = ProductAction.validateCreate(req.body);

    if (!result.success) {
      return AppResponse.sendErrors({
        res,
        code: 400,
        data: null,
        message: result.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    try {
      const shop = await ShopAction.findByOwner(req.user!.id);
      if (!shop) {
        return AppResponse.sendErrors({
          res,
          message: "You need to create a shop before adding products",
          data: null,
          code: 404,
        });
      }

      const product = await ProductAction.create(result.data, shop.id);
      return AppResponse.sendSuccess({
        res,
        data: product,
        code: 201,
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

  async list(req: Request, res: Response) {
    try {
      const shop = await ShopAction.findByOwner(req.user!.id);
      if (!shop) {
        return AppResponse.sendErrors({
          res,
          message: "You don't have a shop yet",
          data: null,
          code: 404,
        });
      }

      const products = await ProductAction.findByShop(shop.id);
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

  async update(req: Request, res: Response) {
    const result = ProductAction.validateUpdate(req.body);

    if (!result.success) {
      return AppResponse.sendErrors({
        res,
        code: 400,
        data: null,
        message: result.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    try {
      const shop = await ShopAction.findByOwner(req.user!.id);
      if (!shop) {
        return AppResponse.sendErrors({
          res,
          message: "You don't have a shop yet",
          data: null,
          code: 404,
        });
      }

      const existingProduct = await ProductAction.findByIdForShop(
        req.params.id,
        shop.id
      );
      if (!existingProduct) {
        return AppResponse.sendErrors({
          res,
          message: "Product not found in your shop",
          data: null,
          code: 404,
        });
      }

      const product = await ProductAction.update(req.params.id, result.data);
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

  async remove(req: Request, res: Response) {
    try {
      const shop = await ShopAction.findByOwner(req.user!.id);
      if (!shop) {
        return AppResponse.sendErrors({
          res,
          message: "You don't have a shop yet",
          data: null,
          code: 404,
        });
      }

      const existingProduct = await ProductAction.findByIdForShop(
        req.params.id,
        shop.id
      );
      if (!existingProduct) {
        return AppResponse.sendErrors({
          res,
          message: "Product not found in your shop",
          data: null,
          code: 404,
        });
      }

      await ProductAction.softDelete(req.params.id);
      return AppResponse.sendSuccess({
        res,
        data: null,
        message: "Product deleted",
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

export default ProductController;
