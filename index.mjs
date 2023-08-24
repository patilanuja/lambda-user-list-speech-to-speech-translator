'use strict';

import pg from 'pg';
const { Client } = pg;

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: process.env.DB_SCHEMA,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

export const handler = async (event, context) => {
    console.log('Event: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));
    try {
        let query = 'select id, uid, name, language from lingualol.user where name is not null and language is not null and uid != $1';
        let result = await client.query(query, [JSON.parse(event.body).uid]);
        let response = JSON.stringify(result.rows);
        console.log('Response: ' + response);
        return {
            statusCode: 200,
            body: response,
        };
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500
        };
    }
};
