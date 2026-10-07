require("dotenv").config();
require("./config/database");

const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");

const app = express();

const PORT = process.env.PORT || 3000;
const bookRoutes = require("./routes/books");

const session = require("express-session");
const { MongoStore } = require("connect-mongo");

// Nhận dữ liệu từ form HTML
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.SESSION_URI,
      collectionName: "sessions"
    }),

    cookie: {
      maxAge: 1000 * 60 * 60
    }
  })
);
app.use("/books", bookRoutes);

// Public folder
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Route kiểm tra
app.get("/", (req, res) => {
  res.redirect("/books");
});

app.get("/session-test", (req, res) => {
  req.session.count = (req.session.count || 0) + 1;

  res.send(
    `Bạn đã truy cập ${req.session.count} lần`
  );
});


app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});