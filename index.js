import express from "express";

const app = express();
const port = 3000;
const dateToday = new Date().toDateString();
let toDoList = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  toDoList = []
  
  res.render("index.ejs", {
    date: dateToday, 
    toDoList: toDoList
  });
});

app.post("/", (req, res) => {
  const todo = req.body.todo;
  toDoList.push(todo);

  res.render("index.ejs", {
    toDoList: toDoList, 
    date: dateToday
  })
})

app.listen(port, () => {
  console.log(`Server live on port ${port}`);
});
