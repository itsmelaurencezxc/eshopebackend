import express from "express";
import apiKeyAuth from "../../middleware/apiKey";
import TestController from "../../controller/default/testControllers";

const testRouter = express.Router();
const testController = new TestController();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Basic server health check
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is up
 */
testRouter.get("/", testController.index);
export default testRouter;
