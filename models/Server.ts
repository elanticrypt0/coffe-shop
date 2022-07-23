import Express, { Application } from "express";
import Cors from "cors";
import Fileupload from 'express-fileupload';

import routerAuth from '../routes/auth.routes';
import routerCategories from '../routes/categories.routes';
import routerProducts from '../routes/products.routes';
import routerSearch from '../routes/search.routes';
import routerUploads from '../routes/uploads.routes';
import routerUsers from '../routes/users.routes';

import dbConn from "../db/config.db";

class Server{

    public app:Application;
    public port:string | undefined;
    public paths:{};

    constructor(){
        this.app = Express();
        this.port=process.env.PORT;

        this.paths={
            auth        :'/auth',
            categories  :'/api/categories',
            products    :'/api/products',
            search      :'/api/search',
            uploads     :'/api/uploads',
            users       :'/api/users',
        }

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

        // uploadFiles config
        this.app.use(Fileupload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));

    }

    public routes(){
        this.app.use( this.paths.auth, routerAuth );
        this.app.use( this.paths.categories, routerCategories );
        this.app.use( this.paths.products, routerProducts );
        this.app.use( this.paths.search, routerSearch );
        this.app.use( this.paths.uploads, routerUploads );
        this.app.use( this.paths.users, routerUsers );
    }

    public listen(){
        this.app.listen(this.port, () =>{
            console.log('###  Starting Server ###');
            console.log(`Listening port: ${this.port}`);
        });
    }

    public async dbConnect(){
        await dbConn(process.env.MONGO_CNN);
    }

}

export default Server;
