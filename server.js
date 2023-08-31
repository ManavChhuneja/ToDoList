import express from "express";

const app = express();
const port = 3000;
const date = new Date();
const options = { weekday: "long", month: "long", day: "numeric" };
const dateToday = date.toLocaleDateString("en-US", options);
let toDoList = ["To Do Item"];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set a daily schedule to clear dataArray

app.get("/", (req, res) => {
  res.render("index.ejs", {
    date: dateToday,
    toDoList: toDoList,
  });
});

app.post("/", (req, res) => {
  const todo = req.body.todo;
  toDoList.push(todo);

  res.render("index.ejs", {
    toDoList: toDoList,
    date: dateToday,
  });
});

///////////////////////////////////////////// WORK ROUTE //////////////////////////////////////////////////

let workList = [];
app.get("/work", (req, res) => {
  res.render("work.ejs", {
    date: dateToday,
    workList: workList,
  });
});

app.post("/work", (req, res) => {
  const workTodo = req.body.todo;
  workList.push(workTodo);

  res.render("work.ejs", {
    workList: workList,
    date: dateToday,
  });
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server live on port ${port}`);
});
