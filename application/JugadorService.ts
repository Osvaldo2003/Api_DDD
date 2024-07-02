import { Jugador } from '../domain/Jugador';
import { JugadorRepository } from '../domain/JugadorRepository';

export class JugadorService {
    constructor(private readonly jugadorRepository: JugadorRepository) {}

    async getJugadores(): Promise<Jugador[]> {
        return await this.jugadorRepository.getJugadores();
    }

    async getJugadorById(id: string): Promise<Jugador | null> {
        return await this.jugadorRepository.getJugadorById(id);
    }

    async addJugador(jugadorData: Omit<Jugador, "id">): Promise<Jugador> {
        return await this.jugadorRepository.addJugador(jugadorData);
    }

    async updateJugador(id: string, jugadorData: Partial<Jugador>): Promise<void> {
        await this.jugadorRepository.updateJugador(id, jugadorData);
    }

    async deleteJugador(id: string): Promise<void> {
        await this.jugadorRepository.deleteJugador(id);
    }
}
