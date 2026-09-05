import { Response } from "express";
import prisma from "../../utils/client";
import bcrypt from "bcrypt";
import { z } from "zod";

type UserRegistrationProps = {
  userEmail: string;
  userPassword: string;
  userContact: string;
};

class UserRegistrationAction {
  static async execute(data: UserRegistrationProps, res: Response) {
    try {
      const password = bcrypt.hashSync(data.userPassword, 10);
      const registerUser = await prisma.user.create({
        data: {
          userContact: data.userContact,
          userEmail: data.userEmail,
          userPassword: password,
        },
      });
      return registerUser;
    } catch (error) {
      console.error("Error in user registration:", error);
      throw error;
    }
  }

  static validate(data: UserRegistrationProps & { confirmPassword: string }) {
    const UserRegistrationSchema = z
      .object({
        userEmail: z.string().email(),
        userPassword: z.string().min(8),
        confirmPassword: z.string(),
        userContact: z
          .string()
          .regex(/^\+?\d{10,12}$/, "Invalid user contact number format"),
      })
      .refine((val) => val.userPassword === val.confirmPassword, {
        message: "Confirm password must match the password field",
        path: ["confirmPassword"],
      });

    return UserRegistrationSchema.safeParse(data);
  }

  static async checkEmail(email: UserRegistrationProps["userEmail"]) {
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          userEmail: email,
        },
      });
      return existingUser;
    } catch (error) {
      console.error("Error checking email:", error);
      throw error;
    }
  }
}

export default UserRegistrationAction;
