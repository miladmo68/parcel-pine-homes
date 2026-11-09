import express from "express";
import { createPropertyController } from "./controllers/propertyController.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { MongoPropertyRepository } from "./repositories/mongoPropertyRepository.js";
import { StaticJsonPropertyRepository } from "./repositories/staticJsonPropertyRepository.js";
import { createPropertyRouter } from "./routes/properties.js";
import { PropertyService } from "./services/propertyService.js";
import { StaticJsonViewingRepository } from "./repositories/staticJsonViewingRepository.js";
import { MongoViewingRepository } from "./repositories/mongoViewingRepository.js";
import { createViewingController } from "./controllers/viewingController.js";
import { createViewingRouter } from "./routes/viewings.js";

export function createApp({ adapter = process.env.DATA_ADAPTER || "static" } = {}) {
  const repository = adapter === "mongo" ? new MongoPropertyRepository() : new StaticJsonPropertyRepository();
  const viewingRepository = adapter === "mongo" ? new MongoViewingRepository() : new StaticJsonViewingRepository();
  const service = new PropertyService(repository, viewingRepository);
  const app = express();
  app.use(express.json({ limit: "32kb" }));
  app.get("/api/health", (_request, response) => response.json({ status: "ok", adapter }));
  app.use("/api/properties", createPropertyRouter(createPropertyController(service)));
  app.use("/api/viewings", createViewingRouter(createViewingController(service)));
  app.use((_request, response) => response.status(404).json({ code: "NOT_FOUND", message: "Route not found" }));
  app.use(errorHandler);
  return app;
}
