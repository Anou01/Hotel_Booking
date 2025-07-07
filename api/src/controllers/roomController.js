const Room = require("../models/RoomModel");

// CREATE: Add a new room
exports.createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ: Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const {
      roomNumber,
      type,
      airConditioning,
      status,
      page = 1,
      limit = 10,
      sort = "createdAt",
    } = req.query;

    let query = {};
    if (type) query.type = type;
    if (airConditioning) query.airConditioning = airConditioning;
    if (status) query.status = status;
    if (roomNumber) query.roomNumber = { $regex: roomNumber, $options: "i" }; // ค้นหาแบบ case-insensitive

    // คำนวณ offset สำหรับ Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const rooms = await Room.find(query)
      .sort(sort) // เรียงลำดับตาม field ที่ระบุ (เช่น createdAt)
      .skip(skip)
      .limit(limitNum);

    // นับจำนวนผู้ใช้ทั้งหมดสำหรับ Pagination
    const total = await Room.countDocuments(query);

    res.status(200).json({
      data: rooms,
      total: total,
      pagination: {
        current: pageNum,
        pageSize: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ: Get a room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE: Update a room
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Room updated", room });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE: Delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
