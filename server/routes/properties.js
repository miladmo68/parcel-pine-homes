import { Router } from "express";

export const createPropertyRouter = (controller) => {
  const router = Router();
  router.get("/", controller.list);
  router.get("/:id", controller.detail);
  router.post("/:id/viewings", (request, _response, next) => {
    request.body.propertyId = request.params.id;
    next();
  }, controller.createViewing);
  return router;
};
