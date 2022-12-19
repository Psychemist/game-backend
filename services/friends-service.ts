import { Knex } from "knex";

export class FriendsService {
    constructor(private knex: Knex) { }

    async getUserFriends(user_id: number): Promise<any> {
        const results = await this.knex.raw(
            "select * from user_friends inner join users on user_friend_id = users.id where user_id = ?",
            [user_id]
        );
        return results.rows;
    }

    async searchFriend(searchBar: string): Promise<any> {
        const results = await this.knex.raw(
            "select * from users where mobile = ?",
            [searchBar]
        );

        const emailResult = await this.knex.raw(
            "select * from users where email = ?",
            [searchBar]
        );
        // console.log("results.rowsEmail :", emailResult.rows);

        results.rows.push(emailResult.rows[0]);

        return results.rows;
    }

    async friendOrNot(targetUserID: number, userID: number): Promise<any> {
        const results = await this.knex.raw(
            "select * from user_friends where user_id = ? and user_friend_id = ?",
            [userID, targetUserID]
        );
        return results.rows;
    }

    async addFriend(targetUserID: number, userID: number): Promise<any> {
        await this.knex.raw(
            `INSERT INTO user_friends
            (user_id, user_friend_id) 
            VALUES (?,?)`,
            [userID, targetUserID]
        );
        await this.knex.raw(
            `INSERT INTO user_friends
          (user_id, user_friend_id) 
          VALUES (?,?)`,
            [targetUserID, userID]
        );
    }

    async calculateMoney1(
        user_id: number,
        user_friend_id: number
    ): Promise<any> {
        // check有冇人差呢個user錢
        const result = await this.knex.raw(
            `select * from transcations 
            where is_settled = false 
            AND creditor_id = ? 
            AND debitor_id = ?`,
            [user_id, user_friend_id]
        );

        return result.rows;
    }

    async calculateMoney2(
        user_id: number,
        user_friend_id: number
    ): Promise<any> {
        // check有冇人差呢個user錢
        const result = await this.knex.raw(
            `select * from transcations 
            where is_settled = false 
            AND debitor_id = ?
            AND creditor_id = ?`,
            [user_id, user_friend_id]
        );
        return result.rows;
    }

    async getAllTxnRecord(
        user_id: number,
        user_friend_id: number
    ): Promise<any> {

        const result = await this.knex.raw(
            `select * from transcations inner join groups on transcations.group_id = groups.id where debitor_id = ? and creditor_id = ? or debitor_id = ? and creditor_id = ?`,
            [user_id, user_friend_id, user_friend_id, user_id]
        );
        let notYetSettleArray = []
        let settledArray = []

        for (let item of result.rows) {
            if (item.is_settled == true) {
                settledArray.push(item)
            } else {
                notYetSettleArray.push(item)
            }

        }
        return { notYetSettled: notYetSettleArray, settled: settledArray };
    }
}
