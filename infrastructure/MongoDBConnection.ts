import { MongoClient, Db } from 'mongodb';

export class MongoDBConnection {
    private client: MongoClient;
    private db: Db;

    constructor(private readonly url: string, private readonly dbName: string) {
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    getDb(): Db {
        if (!this.client.isConnected()) {
            throw new Error('MongoDB connection is not established.');
        }
        return this.db;
    }

    async close(): Promise<void> {
        await this.client.close();
        console.log('MongoDB connection closed');
    }
}
