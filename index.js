import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "escape",
    password: "rkzrkz135",
    port: 5432
  });

const password="IcE=T4WYa2-+UB";
let taskCounter=0;
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
    res.render("index.ejs",{task: tasks[taskCounter], showSolution: false});
});


app.post("/", (req,res)=>{
    if(req.body.password==tasks[taskCounter].solution){
    if(taskCounter<tasks.length-2){
        taskCounter++;
        res.render("index.ejs", {isCorrect: true, task: tasks[taskCounter], showSolution: false});
    }else if(taskCounter==tasks.length-2){
        taskCounter++;
        res.render("index.ejs", {isCorrect: true, task: tasks[taskCounter], showSolution: false, lastTask: true});

    }else{
        res.render("index.ejs", {secret: true});
    }
    }else{
        res.render("index.ejs", {isCorrect: false, task: tasks[taskCounter], showSolution: false});
    }
});

app.post("/hint", (req,res)=>{
        res.render("index.ejs",{task: tasks[taskCounter], showSolution: true});
});

app.post("/reset", (req,res)=>{
    taskCounter=0;
    res.render("index.ejs",{task: tasks[taskCounter], showSolution: false});
});

app.listen(port, ()=>{
    console.log(`Server running on Port: ${port}`);
});


/*
const tasks = [
    {
        id: 1,
        hint: "Im Raum ist ein Buch mit der Aufschrift: \"Python für Einsteiger\". Findet die Seitennummer des Kapitels: \"Operatoren und Operatorrangfolge\".",
        extra: "",
        solution: 73,
        char: "I"
    },
    {
        id: 2,
        hint: "Eventuell könnte man nach QR-Codes suchen. Vielleicht ist darin etwas versteckt.",
        extra: "",
        solution: 99,
        char: "c"
    },
    {
        id: 3,
        hint: "Mmmh, ich würde eventuell mal die schönen Bilder im Raum anschauen.",
        extra: "",
        solution: 69,
        char: "E"
    },
    {
        id: 4,
        hint: "Wem gehört das Blatt im Drucker?",
        extra: "",
        solution: 61,
        char: "="
    },
    {
        id: 5,
        hint: "Die Rollcontainer sind echt praktisch für persönliche Dokumente.",
        extra: "",
        solution: 84,
        char: "T"
    },
    {
        id: 6,
        hint: "Mal sehen, ob der Roboter irgendwelche Zahlen ausspuckt.",
        extra: "",
        solution: 52,
        char: "4"
    },
    {
        id: 7,
        hint: "Wie soll man denn schreiben, wenn die Tastatur falsch herum liegt?",
        extra: "01010111",
        solution: 87,
        char: "W"
    },
    {
        id: 8,
        hint: "Ich muss beim ICP anrufen, wie war nochmal die Vorwahl von München?",
        extra: "",
        solution: 89,
        char: "Y"
    },
    {
        id: 9,
        hint: "Der Schrank ist ziemlich staubig, ich glaube man sollte ihn mal wieder sauber machen.",
        extra: "",
        solution: 97,
        char: "a"
    },
    {
        id: 10,
        hint: "Wir müssen immer das Inventar aufschreiben, ich glaube wir haben die Anzahl an Werkzeugen im Werkzeugkoffer und in der Werkzeugtasche nicht dokumentiert.",
        extra: "",
        solution: 50,
        char: "2"
    },
    {
        id: 11,
        hint: "Aus irgendeinem Grund liegt nur ein Papier in der Box im Regal.",
        extra: "XLVI",
        solution: 45,
        char: "-"
    },
    {
        id: 12,
        hint: "Die Festplatte im PC ist schon ziemlich alt, ich glaube man sollte mal nachschauen.",
        extra: "00101011",
        solution: 43,
        char: "+"
    },
    {
        id: 13,
        hint: "Ich muss noch einen Laptop am Fernseher anschließen, könnte jemand vllt kurz für mich schauen, ob noch ein HDMI-Port frei ist?",
        extra: "01010101",
        solution: 85,
        char: "U"
    },
    {
        id: 14,
        hint: "Ich habe leider den Code für meinen Aktenkoffer vergessen und komme nicht an meine Dokumente. Naja, inzwischen vergesse ich viele Dinge, wie z.B. das heutige Datum.",
        extra: "",
        solution: 66,
        char: "B"
    },
    {
        id: 15,
        hint: "Was bringen mir so viele Zahlen? Mir kommt es vor, als hätte es was mit ASCII zu tun. Vielleicht hilft ja die Tabelle im Koffer.",
        extra: "Letzte Aufgabe",
        solution: password,
        char: password
    },
];
*/
