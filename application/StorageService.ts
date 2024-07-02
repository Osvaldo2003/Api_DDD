import { StorageRepository } from '../domain/StorageRepository';

export class StorageService {
    constructor(private readonly storageRepository: StorageRepository) {}

    async uploadFile(file: Express.Multer.File): Promise<string> {
        return await this.storageRepository.uploadFile(file);
    }

    async deleteFile(fileName: string): Promise<void> {
        await this.storageRepository.deleteFile(fileName);
    }
}
