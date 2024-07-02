import mysql, { Connection, MysqlError, OkPacket, FieldPacket, QueryOptions } from 'mysql2/promise';

export class MySQLConnection implements Connection {
    private connection!: mysql.Connection;

    constructor(private readonly config: mysql.ConnectionOptions) {}

    async connect(): Promise<void> {
        try {
            this.connection = await mysql.createConnection(this.config);
            console.log('Connected to MySQL database');
        } catch (error) {
            console.error('Error connecting to MySQL database:', error);
            throw error;
        }
    }

    async query<T extends mysql.QueryResult>(sql: string | QueryOptions, values?: any): Promise<[T, FieldPacket[]]> {
        if (!this.connection) {
            throw new Error('MySQL connection is not established.');
        }
        
        if (typeof sql === 'string') {
            return this.connection.query<T>(sql, values);
        } else {
            return this.connection.query<T>(sql);
        }
    }

    async execute<T extends mysql.QueryResult>(sql: string | QueryOptions, values?: any): Promise<[OkPacket, FieldPacket[]]> {
        if (!this.connection) {
            throw new Error('MySQL connection is not established.');
        }
        
        if (typeof sql === 'string') {
            return this.connection.execute(sql, values);
        } else {
            return this.connection.execute(sql);
        }
    }

    async end(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
            console.log('MySQL connection closed');
        }
    }
}
