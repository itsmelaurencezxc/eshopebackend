import express from "express";
import CartController from "../../controller/user/CartController";
import authenticate from "../../middleware/auth";

const cartRoutes = express.Router();
const cartController = new CartController();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart for logged-in accounts (account required — no guest cart)
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get your own cart (auto-created if you don't have one yet)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Your cart with its items
 *       401:
 *         description: Missing or invalid token
 */
cartRoutes.get("/", authenticate, cartController.getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add a product to your cart (increments quantity if it's already in there)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Product not found
 */
cartRoutes.post("/items", authenticate, cartController.addItem);

/**
 * @swagger
 * /cart/items/{productId}:
 *   patch:
 *     summary: Change how many of a product you have in your cart (0 removes it)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Item updated (or removed, if quantity was 0)
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Item not found in your cart
 */
cartRoutes.patch("/items/:productId", authenticate, cartController.updateItem);

/**
 * @swagger
 * /cart/items/{productId}:
 *   delete:
 *     summary: Remove a product from your cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Item not found in your cart
 */
cartRoutes.delete("/items/:productId", authenticate, cartController.removeItem);

export default cartRoutes;
