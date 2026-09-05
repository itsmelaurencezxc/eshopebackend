import express from "express";
import OrderController from "../../controller/user/OrderController";
import authenticate from "../../middleware/auth";

const orderRoutes = express.Router();
const orderController = new OrderController();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Checkout and order history for logged-in accounts
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Check out — turns your current cart into an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shippingAddress, paymentMethod]
 *             properties:
 *               shippingAddress:
 *                 type: string
 *                 example: "123 Mabini St., Quezon City"
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, GCASH, CARD]
 *     responses:
 *       201:
 *         description: Order placed, cart is now empty
 *       400:
 *         description: Validation error, or your cart is empty
 *       401:
 *         description: Missing or invalid token
 *       409:
 *         description: A product in your cart is out of stock or no longer available
 */
orderRoutes.post("/", authenticate, orderController.checkout);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List your own order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of your orders
 *       401:
 *         description: Missing or invalid token
 */
orderRoutes.get("/", authenticate, orderController.list);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get one of your own orders by id
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Order not found
 */
orderRoutes.get("/:id", authenticate, orderController.detail);

export default orderRoutes;
