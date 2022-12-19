import express from "express";
import { UserController } from "../controllers/user-controller";
import { UserService } from "../services/user-service";
import { knex } from "../utils/db";

export const userRoutes = express.Router();

let userService = new UserService(knex);
let userController = new UserController(userService);

userRoutes.post("/", userController.register);
userRoutes.put("/id/:id/state", userController.saveGame);
userRoutes.get("/id/:id/state", userController.loadGame);

