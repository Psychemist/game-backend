// console.log(`A`)
import express from "express";
import expressSession from "express-session";
import { userRoutes } from "./routes/userRoute";
import dotenv from "dotenv";
import { friendsRoute } from "./routes/friendsRoute";
import cors from "cors";

export const app = express();
const PORT = 8000;// To be changed to 8080 AWS server

app.use(express.json());

let bodyParser = require("body-parser");
app.use(bodyParser.text({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(
    expressSession({
        secret: "what to buy",
        resave: true,
        saveUninitialized: true,
    })
);

dotenv.config();




app.get('/ping', (_, res) => {
    res.json('Server started')
})
app.use("/user", userRoutes);
app.use("/friend", friendsRoute);
app.use(express.static("public"));
app.use((req, res) => {
    res.redirect("/404.html");
});
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
