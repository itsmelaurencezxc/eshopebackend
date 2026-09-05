import { Request, Response } from "express";
import ShopOrderAction from "../../action/seller/ShopOrderAction";
import ShopAction from "../../action/seller/ShopAction";
import AppResponse from "../../utils/AppResponse";

class ShopOrderController {
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

      const orders = await ShopOrderAction.findByShop(shop.id);
      return AppResponse.sendSuccess({
        res,
        data: orders,
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

export default ShopOrderController;
