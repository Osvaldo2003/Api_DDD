import { Jugador } from './Jugador';

export interface JugadorRepository {
    getJugadores(): Promise<Jugador[]>;
    getJugadorById(id: string): Promise<Jugador | null>;
    addJugador(jugador: Omit<Jugador, 'id'>): Promise<Jugador>;
    updateJugador(id: string, jugador: Partial<Jugador>): Promise<void>;
    deleteJugador(id: string): Promise<void>;
}
