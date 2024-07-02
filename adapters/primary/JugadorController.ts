import { Request, Response, Router } from 'express';
import { JugadorService } from '../../application/JugadorService';

export class JugadorController {
    constructor(private readonly jugadorService: JugadorService) {}

    registerRoutes(): Router {
        const router = Router();
        router.get('/jugadores', this.getJugadores.bind(this));
        router.get('/jugadores/:id', this.getJugadorById.bind(this));
        router.post('/jugadores', this.addJugador.bind(this));
        router.put('/jugadores/:id', this.updateJugador.bind(this));
        router.delete('/jugadores/:id', this.deleteJugador.bind(this));
        return router;
    }

    async getJugadores(req: Request, res: Response): Promise<void> {
        const jugadores = await this.jugadorService.getJugadores();
        res.json(jugadores);
    }

    async getJugadorById(req: Request, res: Response): Promise<void> {
        const jugador = await this.jugadorService.getJugadorById(req.params.id);
        if (!jugador) {
            res.sendStatus(404);
            return;
        }
        res.json(jugador);
    }

    async addJugador(req: Request, res: Response): Promise<void> {
        const { nombre, edad, posicion, nacionalidad } = req.body;
        const jugador = await this.jugadorService.addJugador({ nombre, edad, posicion, nacionalidad });
        res.status(201).json(jugador);
    }

    async updateJugador(req: Request, res: Response): Promise<void> {
        const { nombre, edad, posicion, nacionalidad } = req.body;
        await this.jugadorService.updateJugador(req.params.id, { id: req.params.id, nombre, edad, posicion, nacionalidad });
        res.sendStatus(204);
    }

    async deleteJugador(req: Request, res: Response): Promise<void> {
        await this.jugadorService.deleteJugador(req.params.id);
        res.sendStatus(204);
    }
}
