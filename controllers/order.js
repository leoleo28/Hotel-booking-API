import Order from "../models/Order.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";

export const createOrder = async (req, res, next) => {
  const hotelId = req.body.hotelId;
  try {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    let dateMove = new Date(startDate);
    let strDate = startDate;
    let success = true;
    while (strDate <= endDate) {
      const room = await Room.findOne({
        hotelId,
        date: strDate,
      });

      if (room.total_reserved + 1 > room.total_inventory) {
        success = false;
        break;
      }
      dateMove.setDate(dateMove.getDate() + 1);
      strDate = dateMove.toISOString().slice(0, 10);
    }
    // if (!success) return res.status(200).json("Hotel is fully reserved");
    if (!success)
      return next(
        createError(
          400,
          "Hotel has been fully reserved, please choose another hotel"
        )
      );
    dateMove = new Date(startDate);
    strDate = dateMove.toISOString().slice(0, 10);
    while (strDate <= endDate) {
      const room = await Room.findOne({
        hotelId,
        date: strDate,
      });
      let reservedRoomUpdated = { ...room._doc };
      reservedRoomUpdated.total_reserved =
        reservedRoomUpdated.total_reserved + 1;
      await Room.findByIdAndUpdate(
        room._id,
        { $set: reservedRoomUpdated },
        { new: true }
      );
      dateMove.setDate(dateMove.getDate() + 1);
      strDate = dateMove.toISOString().slice(0, 10);
    }
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const removedOrder = await Order.findByIdAndDelete(req.params.id);
    const startDate = removedOrder.startDate;
    const endDate = removedOrder.endDate;
    const hotelId = removedOrder.hotelId;
    let dateMove = new Date(startDate);
    let strDate = startDate;
    while (strDate <= endDate) {
      const room = await Room.findOne({
        hotelId,
        date: strDate,
      });
      let reservedRoomUpdated = { ...room._doc };
      reservedRoomUpdated.total_reserved =
        reservedRoomUpdated.total_reserved - 1;
      await Room.findByIdAndUpdate(
        room._id,
        { $set: reservedRoomUpdated },
        { new: true }
      );
      dateMove.setDate(dateMove.getDate() + 1);
      strDate = dateMove.toISOString().slice(0, 10);
    }
    res.status(200).json("Order has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};
