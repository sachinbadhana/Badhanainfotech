const express = require("express");
const app = express();
app.use(express.json());

let users = [];
let withdraws = [];

app.post("/deposit",(req,res)=>{
  const {username, amount} = req.body;
  let u = users.find(x=>x.username==username);

  if(!u){
    u = {username, balance:0};
    users.push(u);
  }

  u.balance += amount;
  res.send(u);
});

app.post("/withdraw",(req,res)=>{
  const {username, amount} = req.body;
  let u = users.find(x=>x.username==username);

  if(!u || u.balance < amount){
    return res.send("Low balance");
  }

  u.balance -= amount;

  withdraws.push({username, amount, status:"pending"});

  res.send("Withdraw requested");
});

app.get("/",(req,res)=>{
  res.send("Backend running");
});

app.listen(5000);