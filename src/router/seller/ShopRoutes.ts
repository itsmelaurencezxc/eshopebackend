import express from "express";
import ShopController from "../../controller/seller/ShopController";
import authenticate from "../../middleware/auth";

const shopRoutes = express.Router();
const shopController = new ShopController();

/**
 * @swagger
 * tags:
 *   name: Seller
 *   description: Shop management for seller accounts
 */

/**
 * @swagger
 * /shop:
 *   post:
 *     summary: Create a shop for the logged-in account (turns a buyer into a seller)
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shop created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid token
 *       409:
 *         description: Account already has a shop
 */
shopRoutes.post("/", authenticate, shopController.create);

/**
 * @swagger
 * /shop/me:
 *   get:
 *     summary: Get the logged-in account's own shop
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shop found
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Account doesn't have a shop yet
 */
shopRoutes.get("/me", authenticate, shopController.me);

export default shopRoutes;
