import { Request, Response } from "express";
import CartAction from "../../action/user/CartAction";
import AppResponse from "../../utils/AppResponse";

class CartController {
  async getCart(req: Request, res: Response) {
    try {
      const cart = await CartAction.findOrCreateByUser(req.user!.id);
      return AppResponse.sendSuccess({
        res,
        data: cart,
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

  async addItem(req: Request, res: Response) {
    const result = CartAction.validateAddItem(req.body);

    if (!result.success) {
      return AppResponse.sendErrors({
        res,
        code: 400,
        data: null,
        message: result.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    try {
      const item = await CartAction.addItem(
        req.user!.id,
        result.data.productId,
        result.data.quantity
      );
      return AppResponse.sendSuccess({
        res,
        data: item,
        code: 201,
      });
    } catch (error: any) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return AppResponse.sendErrors({
          res,
          message: "Product not found",
          data: null,
          code: 404,
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

  async updateItem(req: Request, res: Response) {
    const result = CartAction.validateUpdateItem(req.body);

    if (!result.success) {
      return AppResponse.sendErrors({
        res,
        code: 400,
        data: null,
        message: result.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    try {
      const item = await CartAction.updateItemQuantity(
        req.user!.id,
        req.params.productId,
        result.data.quantity
      );
      return AppResponse.sendSuccess({
        res,
        data: item,
        message:
          result.data.quantity === 0 ? "Item removed from cart" : undefined,
        code: 200,
      });
    } catch (error: any) {
      if (error.message === "ITEM_NOT_FOUND") {
        return AppResponse.sendErrors({
          res,
          message: "Item not found in your cart",
          data: null,
          code: 404,
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

  async removeItem(req: Request, res: Response) {
    try {
      await CartAction.removeItem(req.user!.id, req.params.productId);
      return AppResponse.sendSuccess({
        res,
        data: null,
        message: "Item removed from cart",
        code: 200,
      });
    } catch (error: any) {
      if (error.message === "ITEM_NOT_FOUND") {
        return AppResponse.sendErrors({
          res,
          message: "Item not found in your cart",
          data: null,
          code: 404,
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

export default CartController;
