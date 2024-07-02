import express, { Application } from 'express';
import { EquipoController } from './adapters/primary/EquipoController';
import { JugadorController } from './adapters/primary/JugadorController';
import { StorageController } from './adapters/primary/StorageController';
import { MongoDBEquipoRepository } from './adapters/secondary/MongoDBEquipoRepository';
import { MySQLEquipoRepository } from './adapters/secondary/MySQLEquipoRepository'; 
import { MongoDBJugadorRepository } from './adapters/secondary/MongoDBJugadorRepository';
import { MySQLJugadorRepository } from './adapters/secondary/MySQLJugadorRepository';
import { S3StorageRepository } from './adapters/secondary/S3StorageRepository';
import { EquipoService } from './application/EquipoService';
import { JugadorService } from './application/JugadorService';
import { StorageService } from './application/StorageService';
import { MongoDBConnection } from './infrastructure/MongoDBConnection';
import { MySQLConnection } from './infrastructure/MySQLConnection';
import { config } from 'dotenv';
import { join } from 'path';

config({ path: join(__dirname, '../.env') });

const app: Application = express();

app.use(express.json());

// Conexiones a las bases de datos
const mongoDBConnection = new MongoDBConnection(process.env.MONGODB_URI || '', process.env.MONGODB_DB_NAME || '');
const mySQLConnection = new MySQLConnection({
    host: process.env.MYSQL_HOST || 'databaseapi.c4vamuawvh4u.us-east-1.rds.amazonaws.com',
    user: process.env.MYSQL_USER || 'admin',
    password: process.env.MYSQL_PASSWORD || 'pichon69',
    database: process.env.MYSQL_DATABASE || 'dbrdsaws',
});

// Repositorios y servicios
const equipoRepository = new MongoDBEquipoRepository(mongoDBConnection.getDb());
const jugadorRepository = new MySQLJugadorRepository(mySQLConnection);
const storageRepository = new S3StorageRepository();

const equipoService = new EquipoService(equipoRepository);
const jugadorService = new JugadorService(jugadorRepository);
const storageService = new StorageService(storageRepository);

// Controladores
const equipoController = new EquipoController(equipoService);
const jugadorController = new JugadorController(jugadorService);
const storageController = new StorageController(storageService);

// Registrar rutas
app.use('/api', equipoController.registerRoutes());
app.use('/api', jugadorController.registerRoutes());
app.use('/api', storageController.registerRoutes());

// Puerto de escucha
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
