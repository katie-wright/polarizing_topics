import React, {Component} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
const socket = io('/');

class Play extends Component{
    constructor(){
        super();
        this.state={
            canJoinGame: false,
            gameId: "",
            index: 0,
            topics: [],
            votes: {}
        }
        this.joinGame = this.joinGame.bind(this);
        this.startGame = this.startGame.bind(this);
    }
    joinGame(name){
        if (name) {
            socket.emit('client:getTopics',{name: name});
        }
        else {
            alert("Please enter the name of the game you'd like to join!");
        }
    }
    startGame(players, name){
        if (players && name) {
            let self=this;
            if (self.state.topics.length===0){
                axios.get('/topics?include=true', {
                    params: {
                        players: players,
                        name: name
                    }
                })
                .then(res=>{
                    if (res.status===200) {
                        self.setState({gameId: res.data})
                        socket.emit('client:createdNewGame', {gameId: res.data})
                    } 
                })
                .catch(err=>{
                    console.log(err);
                    alert("There is already a game with that name. Please use something unique!");
                });
            }
        }
        else {
            alert("Please enter the number of players and the name of your game!")
        }
    }
    componentDidMount(){
        const self=this;
        socket.on("news", function(data){
            console.log(data);
        })
        socket.on('server:gotTopics', function(data){
            if (data.topics) {
                self.setState({
                    topics: data.topics,
                    index: data.index,
                    votes: data.votes
                });
            }
            else {
                alert("This game is already full or does not exist");
            }
        })
        socket.on('server:checkedForGame', function(data){
            self.setState({
                canJoinGame: (data.game)
            })
        });
        socket.on('server:gameStarted',function(data){
            self.setState({
                canJoinGame: true
            })
        });
        socket.on('server:gameEnded',function(data){
            self.setState({
                gameId: "",
                topics:[],
                canStartGame: true,
                index: 0,
                votes: {}
            })
            console.log("Game ended.");
        });
    }
    componentWillUnmount(){
        socket.emit('client:leavingGame', {data:"data"});
        socket.disconnect();
    }
    render(){
        if (this.state.topics.length>0) {
            return (
            <div>
                <GamePlay topics={this.state.topics} 
                        index={this.state.index}
                        gameId={this.state.gameId}
                        votes={this.state.votes} />
            </div> 
            )
        }
        else {
            return (
                <div>
                    <GameInputs canJoinGame={this.state.canJoinGame} startGame={this.startGame} joinGame={this.joinGame} />
                </div>
            )
        }
    }
}

class GamePlay extends Component {
    constructor(props){
        super();
        this.state={
            gameId: props.gameId,
            index: props.index,
            voted: false,
            upVotes: props.votes.upVotes,
            downVotes: props.votes.downVotes
        }
        this.changeCard = this.changeCard.bind(this);
        this.endGame = this.endGame.bind(this);
        this.vote = this.vote.bind(this);
    }
    changeCard(direction){
        this.setState({
            index: this.state.index + direction,
            upVotes: 0,
            downVotes: 0,
            voted: false
        },()=>{
            if (this.state.gameId && this.state.index>=this.props.topics.length) {
                this.endGame();
            }
        })
    }
    endGame() {
        let self = this;
        socket.emit('client:endGame',{gameId: self.state.gameId});
    }
    vote(upDownVotes){
        socket.emit('client:vote', {opinion: upDownVotes});
        this.setState({
            voted:true
        });
    }
    componentDidMount(){
        const self=this;
        socket.on('server:vote', function(data){
            let upDownVotes = data.opinion;
            self.setState({
                [upDownVotes]: self.state[upDownVotes] +1 
            })
        })
        socket.on('server:votingDone', function(data){
            let upDownVotes = data.opinion;
            self.setState({
                [upDownVotes]: self.state[upDownVotes] +1 
            }, ()=>{
                    if (self.state.upVotes>self.state.downVotes) {
                    alert('Thumbs up wins!');
                    }
                    else if (self.state.upVotes<self.state.downVotes){
                        alert('Thumbs down wins!');
                    }
                    else {
                        alert("It's a tie!");
                    }
                    self.changeCard(1);
                }
            ) 
        })
    }
    componentWillUnmount(){
        const self = this;
        if (this.state.gameId) {
            socket.emit('client:endGame',{gameId: self.state.gameId});
        }
    }
    render(){            
        let topicCards = this.props.topics.map((topic, i)=>{
            return <Topic  key={topic._id}
                        text={topic.text} 
                        user={topic.user.username}
                        />
            })
            return (
                <div>
                    <div className="text-center row">
                        <div className="col-xs-3"></div>
                        <div className="topic-card col-xs-6">
                            {topicCards[this.state.index]}
                        </div>
                        <div className="col-xs-3"></div>
                    </div>
                    <div className="text-center row">
                        <button className="btn upvote-button" 
                            onClick={()=>{this.vote("upVotes")}}
                            disabled={this.state.voted}>
                            <i className="fa fa-thumbs-up"></i> 
                        </button>
                        {this.state.upVotes}
                        <button className="btn downvote-button" 
                                onClick={()=>{this.vote("downVotes")}}
                                disabled={this.state.voted}>
                                <i className="fa fa-thumbs-down"></i> 
                        </button>
                        {this.state.downVotes}
                    </div>
                    <div className="text-center row">
                        {this.state.index+1}/{topicCards.length}
                    </div>
                    { (this.state.gameId) ? 
                        <div className="row">
                            <button className="btn pull-right" onClick={this.endGame}>End Game</button>
                        </div>
                        :
                        null
                    }
                </div>
            )}
}

class Topic extends Component{
    render(){
        return (
            <div className="topic-info d-inline-block">
                <h2 className="topic-title"> {this.props.text} </h2>
                <p className="topic-author"> Submitted by: {this.props.user} </p>
            </div>
        )
    }
}

class GameInputs extends Component{
    componentWillMount(){
        socket.disconnect();
        socket.connect();
        socket.emit('client:checkForGame', {data:"data"});
    }
    render(){
        return (
            <div className="row">
                <div className="col-sm-6 form-group">
                    <h3> Create New Game </h3>
                    <label>Game Name:</label><input type="text" ref="nameStart" className="form-control"/>
                    <br />
                    <div className="pull-right">
                        <label >Number of Players: </label><input type="number" ref="players" min="1" max="50"/>
                        {"  "}
                        <button className="btn submit-button" onClick={()=>this.props.startGame(this.refs.players.value, this.refs.nameStart.value)} >Start Game</button>
                    </div>
                </div>
                <div className="col-sm-6 form-group">
                    <h3> Join Game </h3>
                    <label >Game Name:</label><input type="text" ref="nameJoin" className="form-control"/>
                    <br />
                    <button className="btn submit-button pull-right" onClick={()=>{this.props.joinGame(this.refs.nameJoin.value)}} disabled={!this.props.canJoinGame} >Join Game</button>
                </div>
            </div>
        )
    }
}

export default Play;