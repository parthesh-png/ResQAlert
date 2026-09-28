import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    type: {
        type: String,
        required: true,
        enum: ["shelter", "hospital", "food", "water", "rescue"],
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },

        coordinates: {
            type: [Number],
            required: true,
        },
    },
});

schema.index({ location: "2dsphere" });

const Model = mongoose.model("Resource", schema);

export default Model;