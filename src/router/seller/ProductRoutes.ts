import express from "express";
import ProductController from "../../controller/seller/ProductController";
import authenticate from "../../middleware/auth";

const productRoutes = express.Router();
const productController = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Seller Products
 *   description: Manage products inside the logged-in seller's own shop
 */

/**
 * @swagger
 * /shop/products:
 *   post:
 *     summary: Add a product to your shop
 *     tags: [Seller Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 example: Shoes
 *               price:
 *                 type: number
 *                 example: 999.00
 *               compareAtPrice:
 *                 type: number
 *                 description: Original price shown as "strikethrough" for a sale
 *               stock:
 *                 type: integer
 *                 default: 0
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: You don't have a shop yet
 */
productRoutes.post("/", authenticate, productController.create);

/**
 * @swagger
 * /shop/products:
 *   get:
 *     summary: List all products in your own shop
 *     tags: [Seller Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: You don't have a shop yet
 */
productRoutes.get("/", authenticate, productController.list);

/**
 * @swagger
 * /shop/products/{id}:
 *   patch:
 *     summary: Update a product in your shop
 *     tags: [Seller Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               compareAtPrice:
 *                 type: number
 *               stock:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Shop or product not found
 */
productRoutes.patch("/:id", authenticate, productController.update);

/**
 * @swagger
 * /shop/products/{id}:
 *   delete:
 *     summary: Soft-delete a product from your shop
 *     tags: [Seller Products]
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
 *         description: Product deleted
 *       401:
 *         description: Missing or invalid token
 *       404:
 *         description: Shop or product not found
 */
productRoutes.delete("/:id", authenticate, productController.remove);

export default productRoutes;
