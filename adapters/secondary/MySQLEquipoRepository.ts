import { Connection } from 'mysql2/promise';
import { Equipo } from '../../domain/Equipo';
import { EquipoRepository } from '../../domain/EquipoRepository';

export class MySQLEquipoRepository implements EquipoRepository {
    constructor(private readonly connection: Connection) {}

    async getEquipos(): Promise<Equipo[]> {
        const [rows] = await this.connection.query('SELECT * FROM equipos');
        return (rows as any[]).map(row => this.mapToDomainModel(row));
    }

    async getEquipoById(id: string): Promise<Equipo | null> {
        const [rows] = await this.connection.query('SELECT * FROM equipos WHERE id = ?', [id]);
        if ((rows as any[]).length === 0) {
            return null; 
        }
        const row = (rows as any[])[0];
        return this.mapToDomainModel(row);
    }

    async addEquipo(equipo: Omit<Equipo, 'id'>): Promise<Equipo> {
        const [result] = await this.connection.execute('INSERT INTO equipos (nombre, pais, edad) VALUES (?, ?, ?)', [equipo.nombre, equipo.pais, equipo.edad]);
        const insertId = (result as any).insertId;
        return await this.getEquipoById(insertId.toString())!;
    }

    async updateEquipo(id: string, equipo: Partial<Equipo>): Promise<void> {
        await this.connection.execute('UPDATE equipos SET nombre = ?, pais = ?, edad = ? WHERE id = ?', [equipo.nombre, equipo.pais, equipo.edad, id]);
    }

    async deleteEquipo(id: string): Promise<void> {
        await this.connection.execute('DELETE FROM equipos WHERE id = ?', [id]);
    }

    private mapToDomainModel(row: any): Equipo {
        return new Equipo(
            row.id.toString(),
            row.nombre,
            row.pais,
            row.edad
        );
    }
}
