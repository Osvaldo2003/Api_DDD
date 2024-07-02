import { Collection, Db, ObjectId } from 'mongodb';
import { Jugador } from '../../domain/Jugador';
import { JugadorRepository } from '../../domain/JugadorRepository';

export class MongoDBJugadorRepository implements JugadorRepository {
    private readonly collection: Collection;

    constructor(private readonly db: Db) {
        this.collection = this.db.collection('jugadores');
    }

    async getJugadores(): Promise<Jugador[]> {
        const jugadores = await this.collection.find().toArray();
        return jugadores.map(jugador => this.mapToDomainModel(jugador));
    }

    async getJugadorById(id: string): Promise<Jugador | null> {
        const jugador = await this.collection.findOne({ _id: new ObjectId(id) });
        return jugador ? this.mapToDomainModel(jugador) : null;
    }

    async addJugador(jugador: Omit<Jugador, 'id'>): Promise<Jugador> {
        const result = await this.collection.insertOne(jugador);
        return this.mapToDomainModel({
            ...jugador,
            _id: result.insertedId
        });
    }

    async updateJugador(id: string, jugador: Partial<Jugador>): Promise<void> {
        await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: jugador });
    }

    async deleteJugador(id: string): Promise<void> {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    private mapToDomainModel(data: any): Jugador {
        return new Jugador(
            data._id.toString(),
            data.nombre,
            data.edad,
            data.nacionalidad,
            data.posicion
        );
    }
}
