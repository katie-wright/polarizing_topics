const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT);
const io = require('socket.io').listen(server);

const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
mongoose.Promise = global.Promise;

const topicRoutes = require('./routes/topics');
const authorize = require('./middleware/authorize');

const User = require('./models/User');
const Topic = require('./models/Topic');
const Game = require('./models/Game').model;
const GameSchema = require('./models/Game').schema;
GameSchema.plugin(deepPopulate, { 
    populate: { 'topics': {select: 'text user'},
                'topics.user': {select: 'username'}
            }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + './../build'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});

mongoose.connect('mongodb://localhost/data/db/');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Connected to db at /data/db")
});

const createAnonymous = require('./seeds/users');
createAnonymous();

app.use('/topics', topicRoutes);

app.post('/register',(req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if(err) console.log(err);

            let newUser = new User({
                username: username,
                hash: hash
            });
            
            newUser.save()
                .then(saved=>{
                    res.send("Password saved")
                })
                .catch(err=>{
                    if (err.code === 11000){
                        res.status(403);
                        res.send("That username already exists");
                    }
                    else {
                        res.json(err);
                        console.log(err);
                    }
                });

            });
        });
});

app.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({username: username})
        .then(user=>{
            if (user) {
                bcrypt.compare(password, user.hash, (err, result) => {
                    if (result) {
                        let token = jwt.sign({ username: username }, 'secretKatie');
                        res.json({token: token});
                    }
                    else {
                        res.status(403);
                        res.json({token:null});
                    }
                });
            }
            else {
                res.status(403);
                res.json({token:null});
            }
        });
});

app.get('/privatedata', authorize, (req,res)=>{
    let username=req.decoded.username;
    User.findOne({username: username})
            .then(user=>{
                return Topic.find({user: user._id})
            })
            .then(topics=>{
                if (topics.length>0) {
                    res.json({topics: topics, username: username});
                }
                else {
                    res.json({topics: [], username: username});
                }
            })
            .catch(err=>{
                console.log(err);
                res.send(err);
            })
});

app.get('*', (req, res) => {
    res.sendFile('index.html',{root: __dirname + './../build'});
});

io.on('connection', function (socket) {
  socket.emit("news", {hello: "world"});

  socket.on('client:checkForGame', function(data){
    Game.find({status: "playing"})
        .then(games=>{
            socket.emit('server:checkedForGame', {game: (games.length>0)});
        })
        .catch(err=>{
            console.log(err);
        })
  });  
  socket.on('client:createdNewGame', function(data){
    Game.findById(data.gameId)
        .deepPopulate('topics topics.user')
        .then(game=>{
            socket.room=game.name;
            socket.join(game.name);
            socket.emit('server:gotTopics', {topics: game.topics, index: game.index, votes:game.votes});
            socket.broadcast.emit('server:gameStarted', {data:"data"});
            game.connections++;
            game.save();;         
        })
        .catch(err=>{
            console.log(err);
        })
  });
  socket.on('client:getTopics', function(data){
    Game.findOne({name: data.name})
        .deepPopulate('topics topics.user')
        .then(game=>{
            if(game){
                if (game.connections<game.players) {
                    socket.room = game.name;
                    socket.join(game.name);
                    game.connections ++;
                    game.save();
                    socket.emit('server:gotTopics', {topics: game.topics, index: game.index, votes:game.votes})
                }
                else {
                    socket.emit('server:gotTopics', {topics: null});
                }
            }
            else {
                socket.emit('server:gotTopics', {topics: null});
            }
            
        })
        .catch(err=>{
            console.log(err);
        })
  });
  socket.on('client:vote', function(data){
    Game.findOne({name:socket.room})
        .then(game=>{
            game.votes.total ++;
            game.votes[data.opinion]++;
            return game.save()
        })
        .then(game=>{
            if (game.votes.total<game.players){
                io.sockets.in(socket.room).emit('server:vote', data);
            }
            else if (game.votes.total===game.players) {
                io.sockets.in(socket.room).emit('server:votingDone',data);
                game.votes= {
                    total: 0,
                    upVotes: 0,
                    downVotes: 0
                }
                game.index ++;
                game.save();
            }
        })
        .catch(err=>{
            console.log(err)
        })
  });
  socket.on('client:leavingGame', function(data){
    Game.findOne({name:socket.room})
        .then(game=>{
            if (game && game.connections>0){
                game.connections --;
                game.save();
                socket.leave(socket.room);
            }
        })
        .catch(err=>{
            console.log(err);
        })
});
socket.on('client:endGame', function(data){
    Game.findByIdAndRemove(data.gameId)
        .then(game=>{
            io.sockets.in(socket.room).emit('server:gameEnded', {data:"data"});
            socket.leave(socket.room);
        })
        .catch(err=>{
            console.log(err);
        })
  });
});