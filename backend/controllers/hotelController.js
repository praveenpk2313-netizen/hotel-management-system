const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

// @desc    Fetch all hotels with filters
// @route   GET /api/hotels
// @access  Public
// @desc    Fetch all hotels with filters
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, amenities, rating } = req.query;

    // Base match for approved hotels only
    const pipeline = [
      { $match: { isApproved: true } }
    ];

    // Location filter
    if (location && location.trim() !== "") {
      pipeline.push({
        $match: {
          $or: [
            { location: { $regex: location, $options: 'i' } },
            { city: { $regex: location, $options: 'i' } },
            { address: { $regex: location, $options: 'i' } },
            { name: { $regex: location, $options: 'i' } }
          ]
        }
      });
    }

    // Rating filter
    if (rating && rating !== '0') {
      pipeline.push({ $match: { averageRating: { $gte: Number(rating) } } });
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = amenities.split(',').map(a => a.trim()).filter(a => a !== "");
      if (amenitiesArray.length > 0) {
        const amenityMatches = amenitiesArray.map(a => ({
          amenities: { $regex: a, $options: 'i' }
        }));
        pipeline.push({ $match: { $and: amenityMatches } });
      }
    }

    // Lookup rooms to filter by price
    pipeline.push({
      $lookup: {
        from: 'rooms',
        localField: '_id',
        foreignField: 'hotelId',
        as: 'rooms'
      }
    });

    // Price range filter (checks if hotel has at least one room in range)
    if (minPrice || maxPrice) {
      const priceMatch = {};
      if (minPrice && minPrice != 0) priceMatch['rooms.price'] = { $gte: Number(minPrice) };
      if (maxPrice && maxPrice != 50000) { // 50000 is new default frontend max
        priceMatch['rooms.price'] = { ...priceMatch['rooms.price'], $lte: Number(maxPrice) };
      }
      
      if (Object.keys(priceMatch).length > 0) {
        pipeline.push({ $match: priceMatch });
      }
    }

    // Project fields (don't send all room data yet, just minPrice)
    pipeline.push({
      $addFields: {
        minPrice: { $cond: [{ $gt: [{ $size: "$rooms" }, 0] }, { $min: "$rooms.price" }, null] },
        maxPriceInHotel: { $cond: [{ $gt: [{ $size: "$rooms" }, 0] }, { $max: "$rooms.price" }, null] }
      }
    });

    // Sorting
    const { sortBy } = req.query;
    if (sortBy === 'price_asc') {
      pipeline.push({ $sort: { minPrice: 1 } });
    } else if (sortBy === 'price_desc') {
      pipeline.push({ $sort: { minPrice: -1 } });
    } else if (sortBy === 'rating_desc') {
      pipeline.push({ $sort: { averageRating: -1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } }); // Default: Newest first
    }

    const hotels = await Hotel.aggregate(pipeline);
    res.json(hotels);
  } catch (error) {
    console.error('Fetch hotels error:', error);
    res.status(500).json({ message: 'Error fetching hotels' });
  }
};

// @desc    Fetch all hotels (including pending) for Admin
// @route   GET /api/hotels/admin/all
// @access  Private/Admin
const getAllHotelsAdmin = async (req, res) => {
  const hotels = await Hotel.find({});
  res.json(hotels);
};

// @desc    Approve/Reject a hotel
// @route   PUT /api/hotels/:id/approve
// @access  Private/Admin
const approveHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    hotel.isApproved = req.body.isApproved;
    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } else {
    res.status(404).json({ message: 'Hotel not found' });
  }
};

// @desc    Fetch single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    // Join rooms for detailed view
    const hotelWithRooms = await Hotel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: 'hotelId',
          as: 'rooms'
        }
      }
    ]);

    res.json(hotelWithRooms[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotel' });
  }
};

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin/Manager
const createHotel = async (req, res) => {
  const { name, description, address, city, location, amenities, images } = req.body;

  try {
    const hotel = new Hotel({
      name,
      description,
      address,
      city,
      location: location || city,
      amenities,
      images: images || [],
      managerId: req.user._id,
      isApproved: false // Requires admin approval
    });

    const createdHotel = await hotel.save();
    res.status(201).json(createdHotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin/Manager
const updateHotel = async (req, res) => {
  const { name, description, address, city, location, amenities, images } = req.body;

  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    // Check ownership if not admin
    if (req.user.role !== 'admin' && hotel.managerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    hotel.name = name || hotel.name;
    hotel.description = description || hotel.description;
    hotel.address = address || hotel.address;
    hotel.city = city || hotel.city;
    hotel.location = location || hotel.location;
    hotel.amenities = amenities || hotel.amenities;
    hotel.images = images || hotel.images;

    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } else {
    res.status(404).json({ message: 'Hotel not found' });
  }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    await hotel.deleteOne();
    res.json({ message: 'Hotel removed' });
  } else {
    res.status(404).json({ message: 'Hotel not found' });
  }
};

// @desc    Get hotel and city suggestions for search bar
// @route   GET /api/hotels/suggestions
// @access  Public
const getHotelSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) return res.json([]);

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const hotels = await Hotel.find({
      isApproved: true, // Only suggest approved hotels to customers
      $or: [
        { name: { $regex: escapedQuery, $options: 'i' } },
        { city: { $regex: escapedQuery, $options: 'i' } },
        { location: { $regex: escapedQuery, $options: 'i' } },
        { address: { $regex: escapedQuery, $options: 'i' } }
      ]
    }).limit(30).select('name city location address');

    const suggestions = new Set();
    hotels.forEach(h => {
      if (h.city.toLowerCase().includes(query.toLowerCase())) suggestions.add(h.city);
      if (h.location && h.location.toLowerCase().includes(query.toLowerCase())) suggestions.add(h.location);
      if (h.name.toLowerCase().includes(query.toLowerCase())) suggestions.add(h.name);
      if (h.address && h.address.toLowerCase().includes(query.toLowerCase())) suggestions.add(h.address);
    });

    res.json(Array.from(suggestions).slice(0, 8));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suggestions' });
  }
};

module.exports = { 
  getHotels, 
  getHotelById, 
  createHotel, 
  updateHotel, 
  deleteHotel, 
  getAllHotelsAdmin, 
  approveHotel,
  getHotelSuggestions
};
