import express from "express";
import testRouter from "./Test";
import userRoutes from "./user/UserRoutes";
import shopRoutes from "./seller/ShopRoutes";
import adminRoutes from "./admin/AdminRoutes";

const routes = express.Router();
routes.use("/", testRouter);

routes.use("/user", userRoutes);
routes.use("/shop", shopRoutes);
routes.use("/admin", adminRoutes);
export default routes;
