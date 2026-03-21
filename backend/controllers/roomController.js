const Room = require('../models/Room');

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ hotelId: req.params.hotelId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
};

const createRoom = async (req, res) => {
  try {
    const { hotelId, roomNumber, type, price, capacity, totalRooms, amenities, images } = req.body;

    const room = new Room({
      hotelId,
      roomNumber,
      type,
      price,
      capacity,
      totalRooms,
      amenities,
      images: images || [],
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { roomNumber, type, price, capacity, totalRooms, isAvailable, amenities, images } = req.body;

    const room = await Room.findById(req.params.id);

    if (room) {
      room.roomNumber = roomNumber || room.roomNumber;
      room.type = type || room.type;
      room.price = price || room.price;
      room.capacity = capacity || room.capacity;
      room.totalRooms = totalRooms || room.totalRooms;
      room.isAvailable = isAvailable !== undefined ? isAvailable : room.isAvailable;
      room.amenities = amenities || room.amenities;
      room.images = images || room.images;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await room.deleteOne();
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };
