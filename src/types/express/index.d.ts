import { UserRole } from "@prisma/client";

export type AuthUser = {
  id: string;
  userEmail: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
