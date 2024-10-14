import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { MongoClient, ObjectId } from "mongodb";

const port = process.env.PORT || 5000;

dotenv.config()


// Connecting with MongoDB
const client = new MongoClient(process.env.MONGO_LINK);
let todolists;

const main = async () => {
    await client.connect();
    console.log("Connected to MongoDB");
    todolists = client.db("tododatabase").collection("todolists");
};

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        const data = await todolists.find().toArray();
        res.send({
            status: 200,
            data
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ status: 500, error: "Internal Server Error" });
    }
});

app.post("/", async (req, res) => {
    try {
        const { ipvalue } = req.body; // Destructure ipvalue from req.body

        if (!ipvalue) {
            return res.status(400).send({ status: false, error: "ipvalue is required" });
        }

        await todolists.insertOne({ ipvalue });
        res.status(201).json({ status: true });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send({ status: 500, error: "Internal Server Error" });
    }
});

app.put("/", async (req, res) => {
    try {
        const { ipvalue } = req.body;
        const index = req.query.index;

        if (!ipvalue || !index) {
            return res.status(400).send({ status: false, error: "ipvalue and index are required" });
        }

        await todolists.updateOne({ _id: new ObjectId(index) }, { $set: { ipvalue } });
        res.status(200).json({ status: true });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).send({ status: 500, error: "Internal Server Error" });
    }
});

app.delete("/:index", async (req, res) => {
    try {
        const { index } = req.params;

        if (!index) {
            return res.status(400).send({ status: false, error: "index is required" });
        }

        await todolists.deleteOne({ _id: new ObjectId(index) });
        res.status(200).json({ status: true });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).send({ status: 500, error: "Internal Server Error" });
    }
});

const startServer = async () => {
    await main();
    app.listen(5000, () => {
        console.log(`Server started on port ${5000}`);
    });
};

startServer();
