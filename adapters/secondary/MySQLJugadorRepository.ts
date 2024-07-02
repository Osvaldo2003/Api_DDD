import { Connection } from 'mysql2/promise';
import { Jugador } from '../../domain/Jugador';
import { JugadorRepository } from '../../domain/JugadorRepository';

export class MySQLJugadorRepository implements JugadorRepository {
    constructor(private readonly connection: Connection) {}

    async getJugadores(): Promise<Jugador[]> {
        const [rows] = await this.connection.query('SELECT * FROM jugadores');
        return (rows as any[]).map(row => this.mapToDomainModel(row));
    }

    async getJugadorById(id: string): Promise<Jugador | null> {
        const [rows] = await this.connection.query('SELECT * FROM jugadores WHERE id = ?', [id]);
        if ((rows as any[]).length === 0) {
            return null;
        }
        const row = (rows as any[])[0];
        return this.mapToDomainModel(row);
    }

    async addJugador(jugador: Omit<Jugador, 'id'>): Promise<Jugador> {
        const [result] = await this.connection.execute('INSERT INTO jugadores (nombre, posicion, nacionalidad, equipo_id) VALUES (?, ?, ?, ?)', [jugador.nombre,jugador.edad, jugador.posicion, jugador.nacionalidad]);
        const insertId = (result as any).insertId;
        return this.getJugadorById(insertId.toString())!;
    }

    async updateJugador(id: string, jugador: Partial<Jugador>): Promise<void> {
        await this.connection.execute('UPDATE jugadores SET nombre = ?, posicion = ?, nacionalidad = ?, equipo_id = ? WHERE id = ?', [jugador.nombre, jugador.edad, jugador.posicion, jugador.nacionalidad, id]);
    }

    async deleteJugador(id: string): Promise<void> {
        await this.connection.execute('DELETE FROM jugadores WHERE id = ?', [id]);
    }

    async getJugadoresByEquipoId(equipoId: string): Promise<Jugador[]> {
        const [rows] = await this.connection.query('SELECT * FROM jugadores WHERE equipo_id = ?', [equipoId]);
        return (rows as any[]).map(row => this.mapToDomainModel(row));
    }

    private mapToDomainModel(row: any): Jugador {
        return new Jugador(
            row.id.toString(),
            row.nombre,
            row.edad, // Assuming 'edad' is a property in your Jugador domain object
            row.nacionalidad,
            row.posicion,
        );
    }
}
