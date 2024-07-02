import { Equipo } from '../domain/Equipo';
import { EquipoRepository } from '../domain/EquipoRepository';

export class EquipoService {
    constructor(private readonly equipoRepository: EquipoRepository) {}

    async getEquipos(): Promise<Equipo[]> {
        return await this.equipoRepository.getEquipos();
    }

    async getEquipoById(id: string): Promise<Equipo | null> {
        return await this.equipoRepository.getEquipoById(id);
    }

    async addEquipo(equipoData: Omit<Equipo, "id">): Promise<Equipo> {
        return await this.equipoRepository.addEquipo(equipoData);
    }

    async updateEquipo(id: string, equipoData: Partial<Equipo>): Promise<void> {
        await this.equipoRepository.updateEquipo(id, equipoData);
    }

    async deleteEquipo(id: string): Promise<void> {
        await this.equipoRepository.deleteEquipo(id);
    }
}
