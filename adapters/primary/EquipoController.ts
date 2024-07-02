import { Request, Response, Router } from 'express';
import { EquipoService } from '../../application/EquipoService';

export class EquipoController {
    constructor(private readonly equipoService: EquipoService) {}

    registerRoutes(): Router {
        const router = Router();
        router.get('/equipos', this.getEquipos.bind(this));
        router.get('/equipos/:id', this.getEquipoById.bind(this));
        router.post('/equipos', this.addEquipo.bind(this));
        router.put('/equipos/:id', this.updateEquipo.bind(this));
        router.delete('/equipos/:id', this.deleteEquipo.bind(this));
        return router;
    }

    async getEquipos(req: Request, res: Response): Promise<void> {
        const equipos = await this.equipoService.getEquipos();
        res.json(equipos);
    }

    async getEquipoById(req: Request, res: Response): Promise<void> {
        const equipo = await this.equipoService.getEquipoById(req.params.id);
        if (!equipo) {
            res.sendStatus(404);
            return;
        }
        res.json(equipo);
    }

    async addEquipo(req: Request, res: Response): Promise<void> {
        const { nombre, pais, edad } = req.body; // Cambiado 'entrenador' por 'edad'
        const equipo = await this.equipoService.addEquipo({ nombre, pais, edad });
        res.status(201).json(equipo);
    }

    async updateEquipo(req: Request, res: Response): Promise<void> {
        const { nombre, pais, edad } = req.body; // Cambiado 'entrenador' por 'edad'
        await this.equipoService.updateEquipo(req.params.id, { id: req.params.id, nombre, pais, edad });
        res.sendStatus(204);
    }

    async deleteEquipo(req: Request, res: Response): Promise<void> {
        await this.equipoService.deleteEquipo(req.params.id);
        res.sendStatus(204);
    }
}
