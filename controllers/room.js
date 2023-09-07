import Room from "../models/Room.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  try {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    let dateMove = new Date(startDate);
    let strDate = startDate;
    while (strDate <= endDate) {
      const newRoom = new Room({
        hotelId,
        date: strDate,
      });
      await newRoom.save();
      dateMove.setDate(dateMove.getDate() + 1);
      strDate = dateMove.toISOString().slice(0, 10);
    }
    res.status(200).json("Room created successfully");
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
