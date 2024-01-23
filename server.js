require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Item = require('./models/Item.js');

const app = express();

const port = process.env.PORT || 4000; //backup port in case PORT isn't available

//Connect to MongoDB - create a .env file and populate these environment variables with your database information.
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.uqp8tlu.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

//Middleware

//Enable CORS
app.use(cors());

//Serve static files - application knows where to find our static files, html, css, and assets
app.use(express.static('public'));

//Parse requests - these help the server read requests. if you're getting weird pages, then you probably forgot these two lines
app.use(express.urlencoded({extended: false})); //if incoming request is a string or an array, we can parse it/read it
app.use(express.json()); //if incoming request is in json, we can parse it/read it

//Set EJS as template engine - tells our server where our views will be stored instead of looking for them as static pages in html
app.set('view engine', 'ejs');

//Routes
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/item', async (req, res) => {
    const items = await Item.find({})
    res.render('item', {items}) //rendering the item page, just like we did with index but can pass in the list of items retrieved from the db. tells ejs that we want it to populate those items into the html.
});

//Create
app.post('/item', async (req, res) => {
    const newItem = new Item(req.body);
    try {
      await newItem.save();
      res.redirect('/item');
    } catch (err) {
      //you can set up custom error handling on the client side using this information
      res.redirect('/item?error=true');
    }
  });

// Update
app.post('/item/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        await Item.findByIdAndUpdate(id, { name, description });
        res.redirect('/item');
    } catch (err) {
        //you can set up custom error handling on the client side using this information
        res.redirect('/item?error=true');
    }
});

//Delete
app.delete('/item/delete/:id', async (req, res) => {
    const {id} = req.params;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item deleted successfully' });
});

//Start the server
app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`)
});