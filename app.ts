import dotenv from 'dotenv';
import Server from './models/Server';

dotenv.config();

console.clear();

const server = new Server();

server.listen();