import express from "express";
import ProductBrowseController from "../../controller/user/ProductBrowseController";

const productBrowseRoutes = express.Router();
const productBrowseController = new ProductBrowseController();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Public product catalog — no account needed (guests can browse too)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Search/browse the public product catalog
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Free-text search, matched against product name and description (case-insensitive, any brand)
 *         example: shoes
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Exact category filter
 *         example: Shoes
 *     responses:
 *       200:
 *         description: List of matching products
 */
productBrowseRoutes.get("/", productBrowseController.browse);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Get one product's detail page by its slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
productBrowseRoutes.get("/:slug", productBrowseController.detail);

export default productBrowseRoutes;
