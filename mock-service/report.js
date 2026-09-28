import express from "express";

const app = express();

app.use(express.json());

const reports = [
    {
        content: "Need drinking water near Patna",
        user: "citizen123",
        created_at: "2026-09-28T10:00:00Z",
    },
    {
        content: "Road is flooded near Gandhi Maidan",
        user: "citizen456",
        created_at: "2026-09-28T10:05:00Z",
    },
    {
        content: "People need food near Patna Junction",
        user: "citizen789",
        created_at: "2026-09-28T10:10:00Z",
    },
];

app.get("/reports", (req, res) => {
    res.json(reports);
});

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Report server running on port ${PORT}`);
});