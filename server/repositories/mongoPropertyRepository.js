import { PropertyModel } from "../models/Property.js";

export class MongoPropertyRepository {
  async list(filters) {
    const query = {};
    if (filters.query) query.$text = { $search: filters.query };
    if (filters.neighbourhood) query.neighbourhood = filters.neighbourhood;
    if (filters.kinds?.length) query.kind = { $in: filters.kinds };
    if (filters.minBeds) query.beds = { $gte: filters.minBeds };
    if (filters.maxPrice) query.price = { $lte: filters.maxPrice };
    return PropertyModel.find(query).sort({ featured: -1, price: 1 }).lean();
  }

  async byId(id) {
    return PropertyModel.findById(id).lean();
  }
}
