const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const CloudConvert = require("cloudconvert");


const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTBiOWVjMjkxNjJkZjgzMzRhZDY0ZjdiM2NmMzIzZWVmZDUwNDcxNDQ5M2MzZGJlODI0MGEyMzNhNDU4N2RhMTYwZDE5MmEwYjBhYWRmNmYiLCJpYXQiOjE2Njk5MTM1NzEuMDY2NzM5LCJuYmYiOjE2Njk5MTM1NzEuMDY2NzQsImV4cCI6NDgyNTU4NzE3MS4wNTkwNjcsInN1YiI6IjYxMTAwNTg5Iiwic2NvcGVzIjpbInVzZXIucmVhZCIsInVzZXIud3JpdGUiLCJ0YXNrLnJlYWQiLCJ0YXNrLndyaXRlIiwid2ViaG9vay5yZWFkIiwid2ViaG9vay53cml0ZSIsInByZXNldC53cml0ZSIsInByZXNldC5yZWFkIl19.gujTIjRmDCdZYVoFBryFNPqfXX0JVpNEkAqx1t8TpWeH7RHIntH50AvhVJziAlGHwk4mAmKJceUjfBBe4QZnQYWcOjZcRPLffD--e3oM1nRrjVWb8q92EVtP4xfL00JTy1kIing_QQKW-k8VdX2aF9ET5Mh1OFKE3deBw-lyJprP5t15qTvvev8jsnk2_6yyhyI4Oz7L-STQEtuOqyemYAA2fE72WeEdRoKcQ8e2OTU7E3nePhyztGjfRgh67EZyHQzliJREzl8qUEj52Y2gOwnI7KSVnFFlbNCk2ylvublrGhY6jIICC5xrxn-jSib2OMZKOmFsvFQsSAQ7e9NVGkaiRGRO6fYIEZdwfis2BL_cGiAh4QKLIC_DwRcVxbkKrSyi-WtppVgu7nXEKGSVM0QjMfrdkyGXPAJlcL5E90eoR6AhCPbAHQxL9NRAMsOI2DxsaFZ9rNO3bi1taAZeR7D3NmCQT6cCbUVB-nUEHh5e0_Bnyq6BRx-YLkWJcb-sdmz3hgiBhk4GPdbChJVPI1AZNlTbd-yAP9tI1Pfo1-hl7ca9g5oBvBelGztkCdTvTUHPlT5z900TTk8ZbvRs1Nm26K77riIweDRtKWPjXOYlSsJFo0wR2Cwt6g0rfZEjLzxX4zeH9PWm4afZRqEIXedOQN-umKpjdH6L4t867Z8');



//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
