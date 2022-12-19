import { NextFunction, Request, Response } from "express"
import { Bearer } from 'permit';
import { outdatedTokens } from "../controllers/user-controller";
import jwtSimple from 'jwt-simple';
import jwt from "../token/jwt";
import { UserService } from "../services/user-service";
import { knex } from "./db";


const permit = new Bearer({
    query: "access_token"
})

export async function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    const userService = new UserService(knex)
    try {
        // Check request中有沒有帶著token(前面Login成功的時候server派給了browser)
        const token = permit.check(req)
        if (!token) {
            return res.status(401).json({ msg: "Missing Token" });
        }
        console.log("token: ", token)

        console.log("outdatedTokens: ", outdatedTokens)

        if (outdatedTokens.includes(token)) {
            return res.status(401).json({ msg: "Your token is outdated. Please login again." });
        }

        // 拆 Token，取得 payload中的 username
        const payload = jwtSimple.decode(token, jwt.jwtSecret);
        const username = payload.username
        console.log(username)

        // Check DB
        // TODO: add DB checking logic
        const userResult = await userService.getUserByUsername(username)

        const users = userResult.filter((user: { username: any; }) => user.username == username)
        if (users.length == 1) {
            // req.user = users[0]
            // req.token = token
            return next();
        } else {
            return res.status(401).json({ msg: "Permission Denied" });
        }
    } catch (e) {
        return res.status(401).json({ msg: "Wrong Token" });
    }

}