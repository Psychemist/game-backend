import { Knex } from "knex";



export class UserService {
    constructor(private knex: Knex) { }

    async checkUser(username: string): Promise<any> {
        try {

            let result = (
                await this.knex.raw(/*sql*/`
            SELECT * 
            FROM users 
            WHERE name = ?
        `,
                    [username])
            )
            return result

        } catch (error) {
            console.log(error)
        }
    }

    async createUser(username: string): Promise<any> {
        try {

            let result = await this.knex.insert({
                name: username,
                games_played: 0,
                score: 0
            }).into("users").returning('*');

            return result;

        } catch (error) {
            console.log(error)
        }
    }

    async saveGame(userId: string, gamePlayed: number, score: number): Promise<any> {
        try {
            let userResult = await this.knex.raw(/*sql*/
                `
            select * from users
            where id = ?
            `
                , [userId]
            );

            let currentScore = userResult.rows[0]["score"]
            console.log("currentScore: ", currentScore)
            console.log("score: ", score)

            if (currentScore > score) {
                console.log("DB is higher")
                await this.knex.raw(/*sql*/
                    `
                update users
                set games_played = ? , score = ?
                where id = ?
                `
                    , [gamePlayed, currentScore, userId]
                );
            } else {
                console.log("the new one is higher")
                await this.knex.raw(/*sql*/
                    `
                update users
                set games_played = ? , score = ?
                where id = ?
                `
                    , [gamePlayed, score, userId]
                );
            }





        } catch (error) {
            console.log(error)
        }
    }

    async loadGame(userId: string): Promise<any> {
        try {

            let result = await this.knex.raw(/*sql*/
                `
                select * from users
                where id = ?
                `
                , [userId]
            );

            const gamePlayed = result.rows[0]["games_played"]
            const score = result.rows[0]["score"]
            return { gamePlayed, score }

        } catch (error) {
            console.log(error)
        }
    }



}