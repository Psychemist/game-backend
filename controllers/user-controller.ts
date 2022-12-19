import express from "express";
import { UserService } from "../services/user-service";

export const outdatedTokens: string[] = [];

export class UserController {
    constructor(private userService: UserService) { }



    register = async (req: express.Request, res: express.Response) => {
        try {
            console.log("enter")
            const { username } = req.body
            console.log(username)
            if (!username) {
                res.status(404).json({ message: "invalid input" });
                return
            }

            let checkUserResult = await this.userService.checkUser(
                username
            );

            console.log("checkUserResult:", checkUserResult)

            if (checkUserResult.rows[0]) {
                console.log("############# User exists")
                let { id, name } = checkUserResult.rows[0]
                res.status(200).json({
                    id: id,
                    name: name
                });
                return
            }

            let createUserResult = await this.userService.createUser(
                username
            );
            console.log("userResult: ", createUserResult)

            let { id, name } = createUserResult[0];


            res.status(200).json({
                id: id,
                name: name
            });
        } catch (err) {
            console.log(err);
        }
    };

    saveGame = async (req: express.Request, res: express.Response) => {
        try {
            console.log("enter saveGame API")
            const userId = req.params.id
            console.log("req.body:", req.body)
            const { gamePlayed, score } = req.body
            console.log(userId)
            console.log({ gamePlayed, score })
            if (!userId) {
                res.status(404).json({ message: "Not logged in yet" });
                return
            }

            if (!gamePlayed || !score) {
                res.status(404).json({ message: "invalid input for gamePlayed / score" });
                return
            }

            await this.userService.saveGame(
                userId, gamePlayed, score
            );


            res.status(200).json({
                message: "success",
                id: userId
            });
        } catch (err) {
            console.log(err);
        }
    };

    loadGame = async (req: express.Request, res: express.Response) => {
        try {
            console.log("enter loadGame API")
            const userId = req.params.id
            console.log("req.body:", req.body)
            console.log(userId)
            if (!userId) {
                res.status(404).json({ message: "Not logged in yet" });
                return
            }


            let userResult = await this.userService.loadGame(
                userId
            );
            console.log("@@@@@@@@ gamePlayed: ", userResult.gamePlayed)
            console.log("@@@@@@@@ score: ", userResult.score)


            res.status(200).json({
                message: "success",
                id: userId,
                gamePlayed: userResult.gamePlayed,
                score: userResult.score
            });
        } catch (err) {
            console.log(err);
        }
    };



}
