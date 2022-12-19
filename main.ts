import express from "express";
import { userRoutes } from "./routes/userRoute";
import dotenv from "dotenv";
import cors from "cors";

export const app = express();
const PORT = 8000;

app.use(express.json());

let bodyParser = require("body-parser");
app.use(bodyParser.text({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());


dotenv.config();


app.get('/ping', (_, res) => {
    res.json('Server started')
})

app.use("/user", userRoutes);


app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
