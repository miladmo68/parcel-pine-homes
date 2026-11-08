import { propertyQuerySchema, viewingRequestSchema } from "../validation/propertySchemas.js";

export const createPropertyController = (service) => ({
  list: async (request, response, next) => {
    try { response.json(await service.discover(propertyQuerySchema.parse(request.query))); } catch (error) { next(error); }
  },
  detail: async (request, response, next) => {
    try { response.json(await service.detail(request.params.id)); } catch (error) { next(error); }
  },
  createViewing: async (request, response, next) => {
    try { response.status(201).json(await service.previewViewing(viewingRequestSchema.parse(request.body))); } catch (error) { next(error); }
  },
});
