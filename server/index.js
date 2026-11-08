import mongoose from "mongoose";
import { createApp } from "./app.js";

const port = Number(process.env.PORT || 4175);
const adapter = process.env.DATA_ADAPTER || "static";

if (adapter === "mongo") {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required when DATA_ADAPTER=mongo");
  await mongoose.connect(process.env.MONGODB_URI);
}

createApp({ adapter }).listen(port, () => {
  console.log(`Parcel & Pine API listening on ${port} with ${adapter} adapter`);
});
