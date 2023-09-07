import express from "express";
import { createRoom, deleteRoom, updateRoom } from "../controllers/room.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();
//CREATE
router.post("/:hotelId", [verifyToken, verifyAdmin], createRoom);

//UPDATE
router.put("/:id", [verifyToken, verifyAdmin], updateRoom);

//DELETE
router.delete("/:id", [verifyToken, verifyAdmin], deleteRoom);

export default router;
