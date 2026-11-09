import { ViewingRequestModel } from "../models/ViewingRequest.js";
export class MongoViewingRepository {
  async create(payload) { return ViewingRequestModel.create(payload).then((record) => record.toObject()); }
  async list() { return ViewingRequestModel.find().sort({ createdAt: -1 }).lean(); }
  async hasConflict({ propertyId, slot, email }) { return Boolean(await ViewingRequestModel.exists({ propertyId, slot, email })); }
}
