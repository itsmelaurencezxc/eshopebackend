import express from "express";
import testRouter from "./Test";
import userRoutes from "./user/UserRoutes";
import productBrowseRoutes from "./user/ProductBrowseRoutes";
import cartRoutes from "./user/CartRoutes";
import shopRoutes from "./seller/ShopRoutes";
import shopProductRoutes from "./seller/ProductRoutes";
import adminRoutes from "./admin/AdminRoutes";

const routes = express.Router();
routes.use("/", testRouter);

routes.use("/user", userRoutes);
routes.use("/products", productBrowseRoutes);
routes.use("/cart", cartRoutes);
routes.use("/shop", shopRoutes);
routes.use("/shop/products", shopProductRoutes);
routes.use("/admin", adminRoutes);
export default routes;
