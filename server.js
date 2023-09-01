import express from "express";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
const port = 3000;
// let toDoList = ["To Do Item"];

///////////////////////////////////////////////////// Adding Database //////////////////////////////////////////////////
mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", itemsSchema);

const wakeUp = new Item({
  name: "Wake Up",
});
const seizeTheDay = new Item({
  name: "Seize The Day",
});
const goToBed = new Item({
  name: "Go To Bed",
});
const defaultItems = [wakeUp, seizeTheDay, goToBed];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set a daily schedule to clear dataArray

app.get("/", (req, res) => {
  Item.find({})
    .then((data) => {
      if (data.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Successfully added");
          })
          .catch(() => {
            console.log("Failed to add items");
          });
        res.redirect("/");
      } else {
        res.render("index.ejs", {
          listTitle: "Today",
          toDoList: data,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  const listName = req.body.list;
  const todoItemName = new Item({ name: req.body.todo });
  if (listName === "Today") {
    todoItemName
      .save()
      .then(() => {
        console.log("Success");
      })
      .catch((err) => {
        console.log(err);
      });

    res.redirect("/");
  } else {
    List.findOne({ name: listName })
      .then((data) => {
        data.items.push(todoItemName);
        data.save();
        res.redirect(`/${listName}`);
      })
      .catch((err) => {
        console.log("Error posting");
      });
  }
});

app.post("/delete", (req, res) => {
  const checkedId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove({ _id: checkedId })
      .then(() => {
        console.log("Success");
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/");
  } else {
    //////
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedId } } }
    )
      .then((data) => {
        res.redirect(`/${listName}`);
      })
      .catch((err) => {
        console.log("Issue deleting item");
      });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/:listName", (req, res) => {
  const customListName = _.capitalize(req.params.listName);

  List.findOne({ name: customListName })
    .then((response) => {
      if (!response) {
        // create a new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect(`/${customListName}`);
      } else {
        // show an existing list
        res.render("index.ejs", {
          listTitle: response.name,
          toDoList: response.items,
        });
      }
    })
    .catch((err) => {
      console.log("Doesn't exist");
    });
});

////////////////////////////////////////////////////////////////////////////////

app.listen(process.env.PORT || port, () => {
  console.log(`Server live on port ${port}`);
});
