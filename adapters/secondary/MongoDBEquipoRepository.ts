import { Collection, Db, ObjectId } from 'mongodb';
import { Equipo } from '../../domain/Equipo';
import { EquipoRepository } from '../../domain/EquipoRepository';

export class MongoDBEquipoRepository implements EquipoRepository {
    private readonly collection: Collection;

    constructor(private readonly db: Db) {
        this.collection = this.db.collection('equipos');
    }

    async getEquipos(): Promise<Equipo[]> {
        const equipos = await this.collection.find().toArray();
        return equipos.map(equipo => this.mapToDomainModel(equipo));
    }

    async getEquipoById(id: string): Promise<Equipo | null> {
        const equipo = await this.collection.findOne({ _id: new ObjectId(id) });
        return equipo ? this.mapToDomainModel(equipo) : null;
    }

    async addEquipo(equipo: Omit<Equipo, 'id'>): Promise<Equipo> {
        const result = await this.collection.insertOne(equipo);
        return this.mapToDomainModel({
            ...equipo,
            _id: result.insertedId
        });
    }

    async updateEquipo(id: string, equipo: Partial<Equipo>): Promise<void> {
        await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: equipo });
    }

    async deleteEquipo(id: string): Promise<void> {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    private mapToDomainModel(data: any): Equipo {
        return new Equipo(
            data._id.toString(),
            data.nombre,
            data.edad, 
            data.pais
        );
    }
}
