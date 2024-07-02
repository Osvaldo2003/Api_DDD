import { Request, Response, Router } from 'express';
import { StorageService } from '../../application/StorageService';

export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    registerRoutes(): Router {
        const router = Router();
        router.post('/upload', this.uploadFile.bind(this));
        return router;
    }

    async uploadFile(req: Request, res: Response): Promise<void> {
        const file = req.file; // Assuming file handling middleware is configured
        if (!file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        // Process the file using the storage service
        const result = await this.storageService.uploadFile(file);
        res.json(result);
    }
}
