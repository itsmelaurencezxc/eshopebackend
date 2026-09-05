import { Response, Request } from "express";
import userAuthAction from "../../action/user/UserAuthAction";
import AppResponse from "../../utils/AppResponse";

class UserAuthController {
  async Login(req: Request, res: Response) {
    try {
      const data = userAuthAction.validate(req.body);
      if (data.error) {
        return AppResponse.sendErrors({
          res,
          message: data.error.message,
          data: null,
          code: 400,
        });
      }

      const token = await userAuthAction.execute(data.data);
      return AppResponse.sendSuccess({
        res: res,
        data: { token: token },
        message: "User successfully logged in",
        code: 200,
      });
    } catch (error: any) {
      if (error.message == "User Not Found") {
        return AppResponse.sendErrors({
          res: res,
          data: null,
          message: "User Not found",
          code: 404,
        });
      } else if (error.message == "Invalid login credentials") {
        return AppResponse.sendErrors({
          res: res,
          data: null,
          message: "Invalid login credentials",
          code: 403,
        });
      }
      return AppResponse.sendErrors({
        res: res,
        data: null,
        message: "Internal Server Error",
        code: 500,
      });
    }
  }
}

export default UserAuthController;
