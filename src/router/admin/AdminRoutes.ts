import express from "express";

const adminRoutes = express.Router();

// Admin-only endpoints go here later (dashboard, user management, etc.)
// Every route added here should be guarded by `authenticate` + a role check
// (req.user!.role === "ADMIN"), since admin accounts are never created via
// public signup.

export default adminRoutes;
