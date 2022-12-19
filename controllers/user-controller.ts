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

    loadUserList = async (req: express.Request, res: express.Response) => {
        try {
            console.log("enter loadUserList API")

            let userResult = await this.userService.loadUserList();

            console.log("all users: ", userResult)

            res.status(200).json({
                userResult
            });
        } catch (err) {
            console.log(err);
        }
    };

    loadFriendList = async (req: express.Request, res: express.Response) => {
        try {
            console.log("loadFriendList API");
            const userId = parseInt(req.params.id)
            console.log("my userId: ", userId)
            const friendResult = await this.userService.getUserFriends(userId);
            console.log("@@@@@@@@ friendResult: ", friendResult)
            res.status(200).json({
                friendResult
            });

        } catch (e) {
            console.log(e);
        }
    };



    updateFriendList = async (req: express.Request, res: express.Response) => {
        try {
            console.log("updateFriendList API");
            const userId = parseInt(req.params.id)
            const targetId = req.body.targetId;
            console.log({ targetId, userId })

            if (!targetId || !userId) {
                console.log("invalid id")
                return
            }


            const result = await this.userService.friendOrNot(
                targetId,
                userId
            );
            if (result.length > 0) {
                res.status(400).json({
                    message: "they are friend already",
                });
                return;
            }


            await this.userService.addFriend(targetId, userId);

            res.json({ message: "add friend successfully" });
            return;
        } catch (e) {
            console.log(e);
        }
    };


}
