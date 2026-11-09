import { Router } from "express";
export const createViewingRouter = (controller) => { const router = Router(); router.get("/", controller.list); return router; };
