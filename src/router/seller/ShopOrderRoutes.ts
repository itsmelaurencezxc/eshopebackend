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

/**
 * @swagger
 * /shop/orders/{orderId}/status:
 *   patch:
 *     summary: Move an order forward one step (PENDING -> PAID -> SHIPPED -> DELIVERED)
 *     description: >
 *       Only one step at a time — e.g. you can't jump straight from PENDING
 *       to DELIVERED. Cancelling is a buyer-only action.
 *     tags: [Seller Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PAID, SHIPPED, DELIVERED]
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Order not found in your shop
 *       409:
 *         description: That status transition isn't allowed from the order's current status
 */
shopOrderRoutes.patch(
  "/:orderId/status",
  authenticate,
  shopOrderController.updateStatus
);

export default shopOrderRoutes;
