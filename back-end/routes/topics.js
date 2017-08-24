const express = require('express'),
    router = express.Router();

const Topic = require('../models/Topic');
const User = require('../models/User');
const Game = require('../models/Game').model;

function shuffle(array) {
    //Fisher-Yates shuffle algorithm
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

router.get('/', (req,res)=>{
    if (req.query.include==='true') {
        Topic.find({include: true}).select('_id')
            .then(topics=>{
                if (topics.length>0) {
                    let shuffledTopicIds = [];
                    shuffle(topics).forEach(topic=>{
                        shuffledTopicIds.push(topic._id)});
                    let newGame = new Game({
                        topics: shuffledTopicIds,
                        players: req.query.players,
                        index: 0,
                        votes: {
                            total: 0,
                            upVotes: 0,
                            downVotes: 0
                        },
                        connections: 0,
                        status: 'playing',
                        name: req.query.name
                    });
                    newGame.save()
                        .then(saved=>{
                            res.json(saved._id)
                        })
                        .catch(err=>{
                            res.status(403);
                            res.send("Name already exists");
                        })
                }
                else {
                    res.status(404);
                    res.send("No topics found");
                }
            })
            .catch(err=>{
                console.log(err);
                res.send(err);
            })
    }
    else {
        Topic.find({})
            .then(topics=>{
                if (topics.length>0) {
                    res.json(topics);
                }
                else {
                    res.status(404);
                    res.send("No topics found");
                }
            })
            .catch(err=>{
                console.log(err);
                res.send(err);
            })
    }
});

router.post('/', (req,res)=>{
    let newTopic = new Topic({
        text: req.body.text,
        upVotes: 0,
        downVotes: 0,
        totalVotes: 0,
        include: false
    });
    User.findOne({username: req.body.user})
        .then(user=>{
            newTopic.user = user._id
            return newTopic.save()
        })
        .then(saved=>{
            res.json(saved);
        })
        .catch(err=>{
            res.json(err);
            console.log(err);
        })
});

router.put('/:id', (req,res)=>{
    if (req.body.opinion) {
        const upDownVotes=req.body.opinion;
        Topic.findById(req.params.id)
            .then(topic=>{
                topic[upDownVotes] ++;
                topic.totalVotes ++;
                return topic.save();
            })
            .then(savedTopic=>{
                res.json(savedTopic);
            })
            .catch(err=>{
                res.json(err);
                console.log(err);
            })
    }
    else if (req.body.include!==undefined) {
        const updateData = req.body;
        Topic.findOneAndUpdate({_id: req.params.id}, updateData, {})
            .then(oldTopic=>{
               res.send("Topic updated");
            })
            .catch(err=>{
                res.json(err);
                console.log(err);
            })
            
    }

        
});

router.delete('/:id', (req,res)=>{
    Topic.findOneAndRemove({_id: req.params.id})
        .then(deleted=>{
            res.json(deleted);
        })
        .catch(err=>{
            console.log(err);
            res.json(err);
        });
});

module.exports = router;