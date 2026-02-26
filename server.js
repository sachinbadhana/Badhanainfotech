const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect("YOUR_MONGO_URL");

// USER MODEL
const User = mongoose.model("User", {
  username: String,
  password: String,
  balance: { type: Number, default: 0 },
  referral: String
});

// WITHDRAW MODEL
const Withdraw = mongoose.model("Withdraw", {
  username: String,
  amount: Number,
  status: String
});

// REGISTER
app.post("/register", async (req, res) => {
  const { username, password, referral } = req.body;
  const user = new User({ username, password, referral });
  await user.save();
  res.send("Registered");
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.send("Invalid");
  res.send(user);
});

// DEPOSIT
app.post("/deposit", async (req, res) => {
  const { username, amount } = req.body;
  const user = await User.findOne({ username });
  user.balance += amount;
  await user.save();
  res.send(user);
});

// WITHDRAW
app.post("/withdraw", async (req, res) => {
  const { username, amount } = req.body;
  const user = await User.findOne({ username });

  if (user.balance < amount) return res.send("Low balance");

  user.balance -= amount;
  await user.save();

  await Withdraw.create({
    username,
    amount,
    status: "pending"
  });

  res.send("Withdraw Requested");
});

// ADMIN - VIEW WITHDRAW
app.get("/admin/withdraws", async (req, res) => {
  const data = await Withdraw.find();
  res.send(data);
});

app.listen(3000, () => console.log("PRO SERVER RUNNING"));