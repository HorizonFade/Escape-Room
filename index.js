import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config';

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
  });

let taskCounter=0;
let standortCounter=0;
let loesungCounter=0;
let progressBar;
const showSolution="none";
let tasks = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

db.connect();

app.get("/dashboard/aufgaben", (req,res)=>{
    if(tasks.length>0){
        res.render("dashboard.ejs", {site: "aufgaben", tasks: tasks});
    }else{
    res.render("dashboard.ejs", {site: "aufgaben"});
    }
});


app.post("/dashboard/aufgaben", async (req,res)=>{
    if(tasks.length<1){
        const result = await db.query("SELECT * FROM task ORDER BY taskid ASC");
        result.rows.forEach((task)=>{
            tasks.push({
                id: task.taskid,
                hint: task.hint,
                extra: task.extra,
                solution: task.solution,
                char: task.char
            });
        });
    }
    res.render("dashboard.ejs", {site: "aufgaben", tasks: tasks});
});

app.get("/dashboard", (req,res)=>{
    res.render("dashboard.ejs", {site: "dashboard"});
});

app.get("/", async (req,res)=>{
    if(tasks.length<1){
        const result = await db.query("SELECT * FROM task ORDER BY taskid ASC");
        result.rows.forEach((task)=>{
            tasks.push({
                id: task.taskid,
                hint: task.hint,
                extra: task.extra,
                solution: task.solution,
                char: task.char
            });
        });
    }
    progressBar=Math.floor(100/tasks.length);
    res.render("index.ejs",{task: tasks[taskCounter], showSolution: showSolution, progressBar: progressBar*taskCounter});
});


app.post("/", (req,res)=>{
    if(req.body.password==tasks[taskCounter].solution){
    if(taskCounter<tasks.length-2){
        taskCounter++;
        res.render("index.ejs", {isCorrect: true, task: tasks[taskCounter], showSolution: showSolution, progressBar: progressBar*taskCounter});
    }else if(taskCounter==tasks.length-2){
        taskCounter++;
        res.render("index.ejs", {isCorrect: true, task: tasks[taskCounter], showSolution: showSolution, progressBar: progressBar*taskCounter, lastTask: true});

    }else{
        res.render("index.ejs", {secret: true, standortCounter: standortCounter, loesungCounter: loesungCounter});
    }
    }else{
        res.render("index.ejs", {isCorrect: false, task: tasks[taskCounter], showSolution: showSolution, progressBar: progressBar*taskCounter});
    }
});

app.post("/hint", (req,res)=>{
    const action = req.body.action;

    if(action == "standort"){
        res.render("index.ejs",{task: tasks[taskCounter], showSolution: "standort", progressBar: progressBar*taskCounter});
        if(standortCounter<=taskCounter){
            standortCounter++;
        }
    }else if(action == "loesung"){
        res.render("index.ejs",{task: tasks[taskCounter], showSolution: "loesung", progressBar: progressBar*taskCounter});
        if(loesungCounter<=taskCounter){
            loesungCounter++;
        }
        
    }
});

app.post("/reset", (req,res)=>{
    taskCounter=0;
    standortCounter=0;
    loesungCounter=0;

    res.render("index.ejs",{task: tasks[taskCounter], showSolution: showSolution, progressBar: progressBar*taskCounter});
});

app.listen(port, ()=>{
    console.log(`Server running on Port: ${port}`);
});
