import Express, { Application } from "express";
import Cors from "cors";
import routerUsers from '../routes/users.routes';
import routerAuth from '../routes/auth.routes';
import dbConn from "../db/config.db";

class Server{

    public app:Application;
    public port:string | undefined;
    public usersPath:string;
    public authPath:string;

    constructor(){
        this.app = Express();
        this.port=process.env.PORT;
        this.usersPath='/api/users';
        this.authPath='/auth';

        //connect to DB
        this.dbConnect();

        // Middlewares
        this.middlewares();

        // app's routes
        this.routes();
    }

    public middlewares(){
        // CORS
        this.app.use( Cors() );

        // Read and parse of Body
        this.app.use( Express.json() );

        // public directory
        this.app.use( Express.static('public') );
    }

    public routes(){
        this.app.use( this.authPath, routerAuth );
        this.app.use( this.usersPath, routerUsers );
    }

    public listen(){
        this.app.listen(this.port, () =>{
            console.log(`Listening port: ${this.port}`);
        });
    }

    public async dbConnect(){
        await dbConn(process.env.MONGO_CNN);
    }

}

export default Server;