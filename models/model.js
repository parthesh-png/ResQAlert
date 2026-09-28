import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    
    // location: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },

    location: {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    coordinates: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
},











    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: 'open',
      trim: true,
    },
    created_by: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
)

// Mongoose automatically provides `id` as a virtual string version of `_id`.
const Model = mongoose.model('Model', schema)

export default Model