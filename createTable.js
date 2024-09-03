import pg from "pg";
import 'dotenv/config';

import tasks from "./tasks.json" assert {type: "json"};

const db = new pg.Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
  });

  db.connect();

await db.query("CREATE TABLE IF NOT EXISTS task (id serial primary key, hint varchar(255) not null, extra varchar(255), solution varchar(255) not null, char varchar(255) not null, taskid integer)");
const result = await db.query("SELECT * FROM task");
if(result.rows.length < 1){
    tasks.forEach(task => {
        db.query("INSERT INTO task (hint, extra, solution, char, taskid) VALUES ($1, $2, $3, $4, $5)", [task.hint, task.extra, task.solution, task.char, task.id]);
    });
}


