import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {Pool, QueryResultRow} from 'pg';
@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    private conexion : Pool;
    constructor(){
        this.conexion = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
    });
    }

    async onModuleInit() {
        const res = await this.conexion.query('SELECT now()');
        console.log('DB funcionando',res.rows[0].now);
    }
    async onModuleDestroy() {
        await this.conexion.end();
    }
    query<T extends QueryResultRow=any>(cons:string,params?:any[]){
        return this.conexion.query<T>(cons,params);
    }
}

