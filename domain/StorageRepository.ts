export interface StorageRepository {
    uploadFile(file: Express.Multer.File): Promise<string>;
    getFileUrl(filename: string): Promise<string | null>;
    deleteFile(filename: string): Promise<void>;
}
