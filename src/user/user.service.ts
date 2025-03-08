import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SearchUsersDto } from './dto/search_user.dto'
import { from } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) { }

  async findByEmail(email: string) {
    const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const result = await this.databaseService.query(query, [email]);
    return result[0];
  }

  async findById(id: number) {
    const query = "SELECT * FROM users WHERE id = $1 LIMIT 1";
    const response = await this.databaseService.query(query, [id]);

    return response[0];
  }

  async serachUsers(value: SearchUsersDto, userId: number) {
    const { firstName, lastName, age } = value;

    const query = `
        SELECT id, first_name, last_name, email, age, created_at FROM users
        WHERE
          ($1::text IS NULL OR first_name ILIKE $1::text) AND
          ($2::text IS NULL OR last_name ILIKE $2::text) AND
          ($3::int IS NULL OR age = $3::int) AND 
          (id != $4::int)  
        `;

    const values = [
      firstName ? `%${firstName}%` : null,
      lastName ? `%${lastName}%` : null,
      age ?? null,
      userId
    ];

    return await this.databaseService.query(query, values);
  }

  async makeFriendRequest(fromId: number, toId: number): Promise<void> {
    if (fromId == toId) throw new BadRequestException("Cannot make freind request to yourself!");

    const checkQuery = `SELECT * FROM requests WHERE 
                        (from_user_id = $1 AND to_user_id = $2) 
                        LIMIT 1;`;

    const existsRequest = await this.databaseService.query(checkQuery, [fromId, toId]);
    if (existsRequest[0]) throw new BadRequestException("Request already sent!");


    const insertQuery = `INSERT INTO requests
                        (from_user_id, to_user_id) 
                        VALUES ($1, $2);`;

    await this.databaseService.query(insertQuery, [fromId, toId]);
  }

  async getFriendRequests(toId: number) {
    // Get friend requests with requester email
    const query = `SELECT 
                      r.id AS request_id, 
                      u.email AS sent_user_email
                  FROM requests r
                  JOIN users u ON r.from_user_id = u.id
                  WHERE r.to_user_id = $1`;
    return await this.databaseService.query(query, [toId]);
  }

  async acceptFriendRequest(requestId: number, userId: number) {
    const checkQuery = `
        SELECT * FROM requests
        WHERE id = $1 AND to_user_id = $2
    `;
    const request = await this.databaseService.query(checkQuery, [requestId, userId]);

    if (request.length === 0) {
      throw new BadRequestException("Friend request not found or does not belong to the user.");
    }

    // Insert into follows table
    const insertFollowQuery = `
        INSERT INTO follows (following_user_id, followed_user_id)
        VALUES ($1, $2)
    `;
    await this.databaseService.query(insertFollowQuery, [request[0].from_user_id, userId]);

    // Delete the friend request after accepting
    const deleteQuery = `DELETE FROM requests WHERE id = $1`;
    await this.databaseService.query(deleteQuery, [requestId]);
  }

  async declineFriendRequest(requestId: number, userId: number) {
    const checkQuery = `
        SELECT * FROM requests
        WHERE id = $1 AND to_user_id = $2
    `;
    const request = await this.databaseService.query(checkQuery, [requestId, userId]);

    if (request.length === 0) {
      throw new BadRequestException("Friend request not found or does not belong to the user.");
    }

    // Delete the request since it's declined
    const deleteQuery = `DELETE FROM requests WHERE id = $1`;
    await this.databaseService.query(deleteQuery, [requestId]);
  }
}
