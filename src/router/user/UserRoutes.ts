import express from "express";
import UserRegistrationController from "../../controller/user/UserRegistrationController";
import UserAuthController from "../../controller/user/UserAuthController";

const userRoutes = express.Router();
const userRegistrationController = new UserRegistrationController();
const userAuthController = new UserAuthController();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Buyer account registration and authentication
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new buyer account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userEmail, userPassword, confirmPassword, userContact]
 *             properties:
 *               userEmail:
 *                 type: string
 *                 format: email
 *               userPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               confirmPassword:
 *                 type: string
 *                 description: Must match userPassword
 *               userContact:
 *                 type: string
 *                 example: "+639171234567"
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation error (bad email, short password, mismatched confirmPassword, invalid contact format)
 *       409:
 *         description: Email already in use
 */
userRoutes.post("/register", userRegistrationController.create);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in and receive a JWT
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userEmail, userPassword]
 *             properties:
 *               userEmail:
 *                 type: string
 *                 format: email
 *               userPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Logged in successfully, returns a JWT token
 *       400:
 *         description: Validation error
 *       403:
 *         description: Invalid login credentials
 *       404:
 *         description: User not found
 */
userRoutes.post("/login", userAuthController.Login);

export default userRoutes;
