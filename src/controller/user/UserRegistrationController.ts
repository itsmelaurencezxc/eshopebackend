import { Request, Response } from "express";
import UserRegistrationAction from "../../action/user/UserRegistration";
import AppResponse from "../../utils/AppResponse";

class UserRegistrationController {
  async create(req: Request, res: Response) {
    const result = UserRegistrationAction.validate(req.body);

    if (!result.success) {
      return AppResponse.sendErrors({
        res,
        code: 400,
        data: null,
        message: result.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    const value = result.data;

    try {
      const invalidEmail = await UserRegistrationAction.checkEmail(
        value.userEmail
      );
      if (invalidEmail) {
        return AppResponse.sendErrors({
          res,
          message: "Email is already in use",
          data: null,
          code: 409,
        });
      }

      const registerResult = await UserRegistrationAction.execute(value, res);
      return AppResponse.sendSuccess({
        res,
        data: registerResult,
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
}

export default UserRegistrationController;
