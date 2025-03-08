import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from "pg";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    constructor(private readonly configService: ConfigService) {
        this.pool = new Pool({
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            user: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
        })
    }

    async onModuleInit() {
        console.log('Database connected');
    }

    async onModuleDestroy() {
        await this.pool.end();
        console.log('Database connection closed');
    }

    async query<T = any>(queryText: string, params?: any[]): Promise<T[]> {
        const client: PoolClient = await this.pool.connect();
        try {
            const result = await client.query(queryText, params);
            return result.rows;
        } finally {
            client.release();
        }
    }
}
