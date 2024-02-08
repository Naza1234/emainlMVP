const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/image", express.static("./image"));

// Import all routes
const userRoutes = require('./routes/user.routes');
const userEmailRoutes = require('./routes/userEmail.routes');


// Use the routes
app.use('/user', userRoutes);
app.use('/userEmail', userEmailRoutes);

var password="DEFIServerpassword"
// Database connection
const url = "mongodb+srv://EmailMVP:EmailMVPDataBase@cluster0.g3npwt7.mongodb.net/?retryWrites=true&w=majority";
const port = 4000;
// DEFIWebsiteServer
// HAWebsite
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to the database');
    app.use("/",(req,res)=>{
        res.end('origin')
      })
    app.listen(port, () => {
      console.log(`Server is now running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });