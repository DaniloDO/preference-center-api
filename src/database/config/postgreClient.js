import pg from "pg"; 
import dotenv from "dotenv"; 
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

const environment = process.env.NODE_ENV || "development";
dotenv.config({path: `.${environment}.env`});

const { Pool } = pg; 

class PostgreClient {
    constructor() {
        if(!PostgreClient.instance) {
            this.pool = new Pool({
                user: process.env.POSTGRES_USER,
                host: process.env.POSTGRES_HOST,
                database: process.env.POSTGRES_DATABASE,
                password:process.env.POSTGRES_PASSWORD,
                port: process.env.POSTGRES_PORT
            });

            this._connect(); 
            this.loadSchema();  
            PostgreClient.instance = this; 
        }

        return PostgreClient.instance; 
    }

    async _connect() {
        try {
            const response = await this.pool.query("SELECT NOW();");
            console.log(`PostgreSQL connected: ${response.rows[0].now} `); 
        } 
        
        catch (error) {
            console.error('PostgreSQL connection failed:', error.message); 
            process.exit(1);    
        }
    }

    async loadSchema() {
        try {
            const schemaPath = join(__dirname, "../schema/schema.sql");
            const schemaSQL = readFileSync(schemaPath, "utf-8"); 
            await this.pool.query(schemaSQL);
            console.log('Database schema loaded successfully'); 
        } 
        
        catch (error) {
            console.error('Error loading database schema:', error.message);
            throw error;
        }
    }

    async closeConnection() {
        this.pool.end(() => {
            console.log('PostgreSQL pool closed.');
        });
    }
}

const postgreClient = new PostgreClient(); 
Object.freeze(postgreClient); 

export default postgreClient; 