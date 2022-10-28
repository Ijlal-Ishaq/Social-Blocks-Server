const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const likes_route = require('./routes/likes');
const post_route = require('./routes/post');
const user_route = require('./routes/user');
const comment_route = require('./routes/comment');
const type_route = require('./routes/type');

const cors = require('cors');

dotenv.config();

const host = '0.0.0.0';
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('uploads'));

const dbURI =
  'mongodb+srv://admin:admin123@cluster0.4h1l4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    app.listen(port, host, () => {
      console.log('Server is up and running on Port:', port);
    });
  })
  .catch(error => {
    console.log(error);
  });

app.get('/', async (req, res) => {
  res.send('server live!');
});

app.use('/likes', likes_route.router);
app.use('/posts', post_route.router);
app.use('/users', user_route.router);
app.use('/comment', comment_route.router);
app.use('/type', type_route.router);
