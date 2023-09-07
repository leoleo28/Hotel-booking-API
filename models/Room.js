import mongoose from "mongoose";
const RoomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: String,
      required: true,
    },
    total_inventory: {
      type: Number,
      default: 10,
      required: true,
    },
    total_reserved: {
      type: Number,
      default: 0,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
