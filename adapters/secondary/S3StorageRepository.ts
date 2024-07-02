import AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Readable } from 'stream';
import { StorageRepository } from '../../domain/StorageRepository';

export class S3StorageRepository implements StorageRepository {
    private s3: AWS.S3;

    constructor() {
        this.s3 = new AWS.S3({
            region: 'us-east-1',
            accessKeyId: 'ASIAYBE5LGLDTBYIAO57',
            secretAccessKey: '+9ZOMJeOb2+EE3dDcEmnU1F7VVDVyIkZHyJ6/9vy'
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const uploadParams: AWS.S3.PutObjectRequest = {
            Bucket: 'your-bucket-name',
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        const result: ManagedUpload.SendData = await this.s3.upload(uploadParams).promise();
        return result.Location;
    }

    async getFileStream(key: string): Promise<Readable | null> {
        const params: AWS.S3.GetObjectRequest = {
            Bucket: 'your-bucket-name',
            Key: key
        };

        try {
            const data = await this.s3.getObject(params).promise();
            if (!data.Body) {
                return null;
            }
            return data.Body as Readable;
        } catch (err) {
            console.error(`Error retrieving file from S3: ${err}`);
            return null;
        }
    }

    async deleteFile(key: string): Promise<void> {
        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: 'your-bucket-name',
            Key: key
        };

        await this.s3.deleteObject(params).promise();
    }

    async getFileUrl(key: string): Promise<string | null> {
        const params: AWS.S3.GetObjectRequest = {
            Bucket: 'your-bucket-name',
            Key: key
        };

        try {
            const url = await this.s3.getSignedUrlPromise('getObject', params);
            return url;
        } catch (err) {
            console.error(`Error generating URL for file from S3: ${err}`);
            return null;
        }
    }
}
