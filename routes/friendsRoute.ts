import express from "express";
import { FriendsController } from "../controllers/friends-controller";
import { FriendsService } from "../services/friends-service";
import { knex } from "../utils/db";

export const friendsRoute = express.Router();

let friendsService = new FriendsService(knex);
let friendsController = new FriendsController(friendsService);

friendsRoute.post("/", friendsController.getUserFriends);
friendsRoute.post("/newFriend", friendsController.checkFriend);
friendsRoute.post("/addFriend", friendsController.addFriend);
friendsRoute.post("/calculateMoney", friendsController.calculateMoney);
friendsRoute.post("/getAllTxnRecord", friendsController.getAllTxnRecord);
