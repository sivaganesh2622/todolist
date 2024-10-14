import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB Connection URL
const url = "mongodb+srv://siva:123@cluster0.zupye.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);
let todolists;

const main = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        todolists = client.db("tododatabase").collection("todolists");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if connection fails
    }
};

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        const data = await todolists.find().toArray();
        res.send({ status: 200, data });
    } catch (error) {
        console.error("Error fetching data:", error.message);
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
        console.error("Error inserting data:", error.message);
        res.status(500).send({ status: 500, error: "Internal Server Error" });
    }
});

app.put("/", async (req, res) => {
    try {
        const { ipvalue } = req.body;
        const id = req.query.id; // Rename from index to id

        if (!ipvalue || !id) {
            return res.status(400).send({ status: false, error: "ipvalue and id are required" });
        }

        await todolists.updateOne({ _id: new ObjectId(id) }, { $set: { ipvalue } });
        res.status(200).json({ status: true });
    } catch (error) {
        console.error("Error updating data:", error.message);
        res.status(500).send({ status: 500, error: "Internal Server Error" });
    }
});

app.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ status: false, error: "id is required" });
        }

        await todolists.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ status: true });
    } catch (error) {
        console.error("Error deleting data:", error.message);
        res.status(500).send({ status: 500, error: "Internal Server Error" });
    }
});

const startServer = async () => {
    await main();
    const port = process.env.PORT || 5000; // Use environment variable for the port
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
};

startServer();
