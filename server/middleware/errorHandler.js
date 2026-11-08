import { ZodError } from "zod";

export function errorHandler(error, _request, response, _next) {
  if (error instanceof ZodError) {
    return response.status(422).json({ code: "VALIDATION_ERROR", message: "Please check the highlighted information.", issues: error.flatten() });
  }
  const status = Number(error.status) || 500;
  return response.status(status).json({ code: error.code || "INTERNAL_ERROR", message: status === 500 ? "Something went wrong." : error.message });
}
