const express = require("express");
let port = 8080;
const app = express();

const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
var methodOverride = require("method-override");
app.set("view engine", "views");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "sigma",
  password: "root",
});

const createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = `select * from students`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let users = result;
      res.render("user.ejs", { users });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select * from students where id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let usr = result[0];
      // console.log("Retrieved user data:", usr);
      res.render("edit.ejs", { usr });
    });
  } catch (err) {
    console.log(err);
  }
});

app.patch("/:id", (req, res) => {
  let { id } = req.params;
  let {password : newPass , username : newUserName} = req.body ;
  console.log(newPass,newUserName)
  let q = `select * from students where id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      // console.log("Submitted Docs : " ,result);
      let user = result[0];
      console.log(user)
      if(newPass !== user.password){
        res.send("Password not Matched , Try with correct Password")
      }else{
        let q = `update students set username = '${newUserName}' where id = '${id}'` ;
        connection.query(q,(err,result)=>{
          if (err) throw err ;
          res.redirect('/')
        })
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`App is listening to port ${port}`);
});
