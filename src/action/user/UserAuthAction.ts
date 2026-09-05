import { User } from "@prisma/client";
import prisma from "../../utils/client";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/token";
import { z } from "zod";

class userAuthAction {
  static async execute(data: Pick<User, "userEmail" | "userPassword">) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          userEmail: data.userEmail,
        },
      });

      if (!user) {
        // console.log("User not found");
        throw new Error("User Not Found");
      }

      const validPassword = bcrypt.compareSync(
        data.userPassword,
        user.userPassword
      );

      if (!validPassword) {
        console.log("Invalid login credentials: password mismatch");
        throw new Error("Invalid login credentials");
      }

      return generateToken({
        id: user.id,
        userEmail: user.userEmail,
        role: user.role,
      });
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  static validate(data: Pick<User, "userEmail" | "userPassword">) {
    const schema = z.object({
      userEmail: z.string(),
      userPassword: z.string(),
    });

    return schema.safeParse(data);
  }
}

export default userAuthAction;
