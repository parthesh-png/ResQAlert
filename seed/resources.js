import mongoose from "mongoose";
import dotenv from "dotenv";
import Model from "../models/resource.js";

import dns from 'dns'

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const resources = [
    {
        name: "Patna General Hospital",
        type: "hospital",
        location: {
            type: "Point",
            coordinates: [85.1376, 25.5941],
        },
    },

    {
        name: "Patna Flood Relief Shelter",
        type: "shelter",
        location: {
            type: "Point",
            coordinates: [85.1450, 25.6000],
        },
    },

    {
        name: "Emergency Water Point",
        type: "water",
        location: {
            type: "Point",
            coordinates: [85.1300, 25.5900],
        },
    },

    {
        name: "Community Food Center",
        type: "food",
        location: {
            type: "Point",
            coordinates: [85.1500, 25.5850],
        },
    },

    {
        name: "Bihar Rescue Team",
        type: "rescue",
        location: {
            type: "Point",
            coordinates: [85.1200, 25.6050],
        },
    },
];

const seedResources = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Model.deleteMany({});
        await Model.insertMany(resources);

        console.log("Resources seeded successfully");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedResources();