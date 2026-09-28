import mongoose from 'mongoose'
import Model from '../models/model.js'
import { resolveLocation } from "../services/locationService.js";
import { fetchReports } from "../services/reportService.js";
import Resource from "../models/resource.js";
import { getIO } from "../socket/socket.js";

const serializeDisaster = (disaster) => {
  const result = disaster.toObject({ virtuals: true })
  result.id = result._id.toString()
  delete result._id
  delete result.__v
  return result
}

const editableFields = [
  'title',
  'description',
  'location',
  'tags',
  'status',
  'created_by',
]

const handleError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message })
  }

  console.error('Disaster request failed:', error)
  return res.status(500).json({ message: 'Internal server error' })
}

// export const createDisaster = async (req, res) => {
//   try {
//     const disaster = await Model.create(req.body)
//     return res.status(201).json(serializeDisaster(disaster))
//   } catch (error) {
//     return handleError(res, error)
//   }
// }

export const createDisaster = async (req, res) => {
    try {
        const { description } = req.body;

        const location = resolveLocation(description);

        if (!location) {
            return res.status(400).json({
                message: "Could not determine disaster location",
            });
        }

   const disaster = await Model.create({
    ...req.body,
    location,
});

getIO().emit("disaster_updated", serializeDisaster(disaster));

return res.status(201).json(serializeDisaster(disaster));
    } catch (error) {
        return handleError(res, error);
    }
};





export const getDisasters = async (req, res) => {
    try {
        const { tag } = req.query

        const filter = {}

        if (tag) {
            filter.tags = tag
        }

        const disasters = await Model
            .find(filter)
            .sort({ created_at: -1 })

        return res.json(disasters.map(serializeDisaster))
    } catch (error) {
        return handleError(res, error)
    }
}






export const getDisasterById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid disaster id' })
    }

    const disaster = await Model.findById(req.params.id)
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' })
    }

    return res.json(serializeDisaster(disaster))
  } catch (error) {
    return handleError(res, error)
  }
}

export const updateDisaster = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid disaster id' })
    }

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([field]) => editableFields.includes(field)),
    )

 const disaster = await Model.findByIdAndUpdate(
    req.params.id,
    updates,
    {
        new: true,
        runValidators: true,
    }
);

if (!disaster) {
    return res.status(404).json({
        message: "Disaster not found"
    });
}

getIO().emit("disaster_updated", serializeDisaster(disaster));

return res.json(serializeDisaster(disaster));
  } catch (error) {
    return handleError(res, error)
  }
}

export const deleteDisaster = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid disaster id' })
    }

    const disaster = await Model.findByIdAndDelete(req.params.id)
    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' })
    }

    return res.status(204).end()
  } catch (error) {
    return handleError(res, error)
  }
}

// for near by 

export const getNearbyResources = async (req, res) => {
    try {
        const { id } = req.params;
        const { lat, lng, radius } = req.query;

        if (!lat || !lng || !radius) {
            return res.status(400).json({
                message: "lat, lng and radius are required",
            });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid disaster id",
            });
        }

        const disaster = await Model.findById(id);

        if (!disaster) {
            return res.status(404).json({
                message: "Disaster not found",
            });
        }

        const resources = await Resource.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            Number(lng),
                            Number(lat),
                        ],
                    },
                    $maxDistance: Number(radius) * 1000,
                },
            },
        });

        return res.json(resources);
    } catch (error) {
        return handleError(res, error);
    }
};


// community contriller 

export const getReports = async (req, res) => {
    try {
        const reports = await fetchReports();

        return res.json(reports);
    } catch (error) {
        console.error("Reports service failed:", error);

        return res.status(502).json({
            message: "Failed to fetch community reports",
        });
    }
};