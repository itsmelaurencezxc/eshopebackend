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

  async updateStatus(req: Request, res: Response) {
    const result = ShopOrderAction.validateStatusUpdate(req.body);

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

      const order = await ShopOrderAction.updateStatus(
        req.params.orderId,
        shop.id,
        result.data.status
      );
      return AppResponse.sendSuccess({
        res,
        data: order,
        code: 200,
      });
    } catch (error: any) {
      if (error.message === "NOT_YOUR_ORDER") {
        return AppResponse.sendErrors({
          res,
          message: "Order not found in your shop",
          data: null,
          code: 404,
        });
      }
      if (typeof error.message === "string" && error.message.startsWith("INVALID_TRANSITION:")) {
        return AppResponse.sendErrors({
          res,
          message: error.message.split(":")[1]?.trim() || "Invalid status transition",
          data: null,
          code: 409,
        });
      }
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
