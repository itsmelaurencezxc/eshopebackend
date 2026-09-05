import { Request, Response } from "express";
import OrderAction from "../../action/user/OrderAction";
import AppResponse from "../../utils/AppResponse";

class OrderController {
  async checkout(req: Request, res: Response) {
    const result = OrderAction.validateCheckout(req.body);

    if (!result.success) {
      return AppResponse.sendErrors({
        res,
        code: 400,
        data: null,
        message: result.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    try {
      const order = await OrderAction.checkout(req.user!.id, result.data);
      return AppResponse.sendSuccess({
        res,
        data: order,
        code: 201,
      });
    } catch (error: any) {
      if (error.message === "EMPTY_CART") {
        return AppResponse.sendErrors({
          res,
          message: "Your cart is empty",
          data: null,
          code: 400,
        });
      }
      if (typeof error.message === "string") {
        if (error.message.startsWith("OUT_OF_STOCK:")) {
          return AppResponse.sendErrors({
            res,
            message: `Not enough stock for "${error.message.split(":")[1]}"`,
            data: null,
            code: 409,
          });
        }
        if (error.message.startsWith("PRODUCT_UNAVAILABLE:")) {
          return AppResponse.sendErrors({
            res,
            message: `"${error.message.split(":")[1]}" is no longer available`,
            data: null,
            code: 409,
          });
        }
      }
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
      const orders = await OrderAction.findByUser(req.user!.id);
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

  async detail(req: Request, res: Response) {
    try {
      const order = await OrderAction.findByIdForUser(
        req.params.id,
        req.user!.id
      );

      if (!order) {
        return AppResponse.sendErrors({
          res,
          message: "Order not found",
          data: null,
          code: 404,
        });
      }

      return AppResponse.sendSuccess({
        res,
        data: order,
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

export default OrderController;
