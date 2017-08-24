import React, {Component} from 'react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import Submit from './Submit';
import Vote from './Vote';
import axios from 'axios';

class VoteSubmit extends Component{
    constructor(){
        super();
        this.state={
            auth:false,
            username: "",
            topics: []
        }
        this.checkVotes = this.checkVotes.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.newTopic = this.newTopic.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.vote = this.vote.bind(this);
    }
    componentWillMount(){
        axios.get('/topics')
            .then(res=>{
                this.setState({
                    topics: res.data
                });
            })
            .catch(err=>{
                console.log(err);
            })
        let authToken = localStorage.getItem("authToken");
        if (authToken) {
            this.setState({
                auth:true
            });
        }
    }
    checkVotes(index) {
        let topicsCopy = Array.from(this.state.topics);
        let topic = topicsCopy[index];
        if (topic.totalVotes !== 0) {
            let upVotePercent = Math.floor(topic.upVotes/topic.totalVotes*100);
            if (upVotePercent >= 5 && upVotePercent <= 95) {
                let include = (upVotePercent >= 30 && upVotePercent <=70);
                if (topic.include !== include) {
                    axios.put("/topics/"+topic._id, {include: include})
                        .then(res=>{
                            if(res.status===200) {
                                console.log("Topic updated, included:", include);
                            }
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                }
            }
            else if (topic.totalVotes>=20) {
                axios.delete("/topics/"+topic._id)
                    .then(res=>{
                        console.log("deleted:", res.data);
                        topicsCopy.splice(index, 1);
                        this.setState({
                            topics: topicsCopy
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            }
        }
    }
    
    login() {
        this.setState({
            auth: true
        });
    }
    logout(){
        this.setState({
            auth: false,
            username: ""
        });
        localStorage.setItem("authToken", "");
    }
    newTopic(input){
        axios.post('/topics', {
            user: this.state.username ? this.state.username : 'Anonymous',
            text: input
        })
        .then(res=>{
            console.log(res.data);
            if (res.status===200){
                let newTopic = res.data;
                let topicsCopy = Array.from(this.state.topics);
                topicsCopy.push(newTopic);
                this.setState({
                    topics: topicsCopy
                });
            }
        })
        .catch(err=>{
            console.log(err);
        });     
    }
    setUserName(username){
        this.setState({
            username: username
        })
    }
    vote(id, upDownVotes){
        let topicsCopy = Array.from(this.state.topics);
        // let updateData;
        let index;
        for(let i=0; i<topicsCopy.length; i++){
            if (topicsCopy[i]._id===id) {
                // updateData = {
                //     [upDownVotes]: topicsCopy[i][upDownVotes] + 1,
                //     totalVotes: topicsCopy[i].totalVotes + 1
                // }
                index = i;
                break;
            }
        };
        axios.put('/topics/'+id, {opinion: upDownVotes})
            .then(res=>{
                if(res.status===200) {
                    topicsCopy[index]=res.data;
                    this.setState({
                        topics: topicsCopy
                    }, ()=>{
                        this.checkVotes(index);
                    });
                }
            })
            .catch(err=>{
                console.log(err);
            });
    } 
    render(){
        return (
            <div>
                <div className="text-center">
                    {this.state.auth ? 
                    <div> Currenly logged in as: <strong> {this.state.username} </strong> <a role="button" onClick={this.logout}>Log Out</a> </div>
                    :
                    <div> 
                        Currently not logged in. <a role="button" data-toggle="modal" data-target="#login">Login</a> <a role="button" data-toggle="modal" data-target="#signup">Sign Up</a> 
                            <LoginModal login={this.login}/> <SignupModal login={this.login}/> 
                    </div>}
                </div>

                <Submit newTopic={this.newTopic} />
                <Vote auth={this.state.auth} topics={this.state.topics} vote={this.vote} setUserName={this.setUserName}/>
            </div>
        )
    }
}

export default VoteSubmit;