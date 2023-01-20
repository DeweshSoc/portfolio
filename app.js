const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const compression = require("compression");

const fs = require("fs");
const app = express();

app.use(compression());
app.set("view engine", "ejs");

// below we have used virtual path .... it is as if for static files we have set public folder as the root directory. It is called virtual because path where public folder is the root does noy actually exist.
app.use("/", express.static(__dirname + "/public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/uploads");
  },
});

const upload = multer({ storage: storage });

mongoose.connect(
  "mongodb+srv://dewesh-123:dewesh123@cluster0.bslz8.mongodb.net/portfolioDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// const mongoUrl = "mongodb+srv://dewesh-123:dewesh123@cluster0.bslz8.mongodb.net/portfolioDB?retryWrites=true&w=majority";

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Contact = new mongoose.model("Contact", contactSchema);

const resumeUrlSchema = new mongoose.Schema({
  resumeUrl : {
    type:String,
    required:true
  },
  uploadDate:{
    type:String,
    required:true
  }
});

const ResumeUrl = new mongoose.model("resumeUrl",resumeUrlSchema);

app.get("/", (req, res) => {
  ResumeUrl.findOne()
  .then(result=>{
    res.render("home",{
      resumeLink:result.resumeUrl
    });
  })
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/messages", (req, res) => {
  Contact.find({}, (err, contacts) => {
    if (err) {
      console.log(err);
    } else {
      res.render("messages", {
        contacts: contacts,
      });
    }
  });
});

app.get("/resumes",(req,res)=>{
  ResumeUrl.find()
  .then(resumes=>{
    res.render("resume",{
      resumeLink:resumes[0].resumeUrl
    });
  });  
});

app.get("/project", (req, res) => {
  res.redirect("/#project");
});
app.get("/project/0", (req, res) => {
  res.redirect("/#project");
});
app.get("/project/1", (req, res) => {
  res.redirect("/#project");
});

app.post("/contact/message", upload.none(), (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  const newContact = new Contact({
    name: name,
    email: email,
    message: message,
  });

  newContact.save((err, savedDoc) => {
    if (err) {
      console.log(err);
      res.send("Error occured");
    } else {
      console.log("Contact saved");
      res.redirect("/#contact");
    }
  });
});

app.post("/resumes",upload.none(),(req,res)=>{
  const resumeLink = req.body.resumeLink;
  let today = new Date().toLocaleDateString();
  const updateDate = today;
  const oldOne = {
    resumeUrl: resumeLink,
    uploadDate: updateDate,
  };
  ResumeUrl.findOneAndUpdate({},oldOne,{useFindAndModify:false})
  .then(result=>{
    console.log("saved new resume link");
    res.render("admin");
  })
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port, () => {
  console.log("Server started");
});
