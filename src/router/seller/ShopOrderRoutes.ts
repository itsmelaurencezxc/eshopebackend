import express from "express";
import ShopOrderController from "../../controller/seller/ShopOrderController";
import authenticate from "../../middleware/auth";

const shopOrderRoutes = express.Router();
const shopOrderController = new ShopOrderController();

/**
 * @swagger
 * tags:
 *   name: Seller Orders
 *   description: Orders containing the logged-in seller's own products
 */

/**
 * @swagger
 * /shop/orders:
 *   get:
 *     summary: List orders that contain at least one of your shop's products
 *     description: >
 *       If a buyer's order contains products from more than one shop, you
 *       only see the items that belong to your own shop — never the
 *       buyer's other purchases from a different seller.
 *     tags: [Seller Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders (only your shop's items included)
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: You don't have a shop yet
 */
shopOrderRoutes.get("/", authenticate, shopOrderController.list);

export default shopOrderRoutes;
