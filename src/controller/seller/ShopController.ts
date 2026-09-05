import { Request, Response } from "express";
import ShopAction from "../../action/seller/ShopAction";
import AppResponse from "../../utils/AppResponse";

class ShopController {
  async create(req: Request, res: Response) {
    const result = ShopAction.validate(req.body);

    if (!result.success) {
      return AppResponse.sendErrors({
        res,
        code: 400,
        data: null,
        message: result.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    try {
      const ownerId = req.user!.id;

      const existingShop = await ShopAction.findByOwner(ownerId);
      if (existingShop) {
        return AppResponse.sendErrors({
          res,
          message: "You already have a shop",
          data: null,
          code: 409,
        });
      }

      const shop = await ShopAction.create(result.data, ownerId);
      return AppResponse.sendSuccess({
        res,
        data: shop,
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

  async me(req: Request, res: Response) {
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

      return AppResponse.sendSuccess({
        res,
        data: shop,
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

export default ShopController;
