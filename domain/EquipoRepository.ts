import { Equipo } from "../domain/Equipo";

export interface EquipoRepository {
    getEquipos(): Promise<Equipo[]>;
    getEquipoById(id: string): Promise<Equipo | null>;
    addEquipo(equipo: Omit<Equipo, "id">): Promise<Equipo>;
    updateEquipo(id: string, equipo: Partial<Equipo>): Promise<void>;
    deleteEquipo(id: string): Promise<void>;
}
