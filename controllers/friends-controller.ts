import { Request, Response } from "express";
import { FriendsService } from "../services/friends-service";
export class FriendsController {
    constructor(private friendsService: FriendsService) { }

    getUserFriends = async (req: Request, res: Response) => {
        try {
            console.log("getUserFriends API");
            let user_id = req.body.userID;
            const result = await this.friendsService.getUserFriends(user_id);
            const uniqueIds: any = [];
            const unique = result.filter((element: any) => {
                const isDuplicate = uniqueIds.includes(element.id);
                if (!isDuplicate) {
                    uniqueIds.push(element.id);
                    return true;
                }
                return false;
            });

            res.json(unique);
            return;
        } catch (e) {
            console.log(e);

            res.status(400).send("Upload Fail");
            return;
        }
    };

    checkFriend = async (req: Request, res: Response) => {
        try {
            console.log("checkFriend API");
            let searchBar = req.body.searchBar;
            let userID = req.body.userID;

            const result = await this.friendsService.searchFriend(searchBar);
            if (result.length == 0 || result[0] == undefined) {
                res.status(400).json({
                    type: 1,
                    message: "No such user",
                });
                return;
            }

            if (result[0].id == userID) {
                res.status(400).json({
                    type: 2,
                    message: "cannot add yourself",
                });
                return;
            }

            const result1 = await this.friendsService.friendOrNot(
                result[0].id,
                userID
            );
            if (result1.length > 0) {
                res.status(400).json({
                    type: 3,
                    message: "they are friend already",
                });
                return;
            }

            res.status(200).json({
                type: 4,
                message: "ready to add",
                userDetails: result[0],
            });
            return;
        } catch (e) {
            console.log(e);

            res.status(400).send("Upload Fail");
            return;
        }
    };

    addFriend = async (req: Request, res: Response) => {
        try {
            console.log("addFriend API");
            let targetID = req.body.targetID;
            let userID = req.body.userID;

            // add friend each other
            await this.friendsService.addFriend(targetID, userID);

            res.json({ message: "add success" });
            return;
        } catch (e) {
            console.log(e);

            res.status(400).send("add friend Fail");
            return;
        }
    };

    calculateMoney = async (req: Request, res: Response) => {
        try {
            console.log("calculateMoney API");
            let user_id = req.body.user_id;
            let user_friend_id = req.body.user_friend_id;

            // check有冇人差呢個user錢
            let results1 = await this.friendsService.calculateMoney1(
                user_id,
                user_friend_id
            );
            let userCanGet = 0;
            for (let result1 of results1) {
                userCanGet += result1.transcations_amount;
            }

            // check user有冇差人錢
            let results2 = await this.friendsService.calculateMoney2(
                user_id,
                user_friend_id
            );
            let userShouldPay = 0;
            for (let result2 of results2) {
                userShouldPay += result2.transcations_amount;
            }

            if (userCanGet - userShouldPay == 0) {
                // case 1: 冇拖冇欠
                res.json({
                    case: 1,
                    amount: 0,
                });
            } else if (userCanGet - userShouldPay > 0) {
                // case 2: user can get
                res.json({
                    case: 2,
                    amount: userCanGet - userShouldPay,
                });
            } else if (userShouldPay - userCanGet > 0) {
                // case 3: user should pay
                res.json({
                    case: 3,
                    amount: userShouldPay - userCanGet,
                });
            }
            return;
        } catch (e) {
            console.log(e);

            res.status(400).send("add friend Fail");
            return;
        }
    };

    getAllTxnRecord = async (req: Request, res: Response) => {
        try {
            console.log("getAllTxnRecord API");
            let user_id = req.body.user_id;
            let user_friend_id = req.body.user_friend_id;

            // add friend each other
            const results = await this.friendsService.getAllTxnRecord(user_id, user_friend_id);

            res.json(results);
            return;
        } catch (e) {
            console.log(e);

            res.status(400).send("getAllTxnRecord Fail");
            return;
        }
    };
}
