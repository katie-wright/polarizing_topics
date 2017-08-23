import React, {Component} from 'react';
import axios from 'axios';

class MyTopics extends Component {
    constructor(){
        super();
        this.state={
            topics: []
        }
    }
    componentWillMount(){
        let authToken = localStorage.getItem("authToken");
        if (authToken) {
            axios.get("/privatedata", {
                headers:
                {"authorization": authToken}
            })
            .then(res=>{
                if (res.status===200) {
                    this.setState({
                        topics: res.data.topics
                    })
                    this.props.setUserName(res.data.username);
                }
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }
    render(){ 
    if (this.state.topics.length>0) {
        let topicList = this.state.topics.map((topic,i)=>{
            return <Topic key={i}
                      text={topic.text}
                      upVotes={Number(topic.upVotes)}
                      downVotes={Number(topic.downVotes)}
                      totalVotes={Number(topic.totalVotes)}
                        />
        })
        return (
            <div> 
                {topicList}
            </div>
        )
    }
      else {
        return   (
            <div>
                No topics submitted yet, or previous topics have been deleted.
            </div>
        )
      }
    }
}

class Topic extends Component {
    render() {
    let upVotePercent = Math.floor(this.props.upVotes/this.props.totalVotes*100);
    let downVotePercent = Math.floor(this.props.downVotes/this.props.totalVotes*100);
        return (
            <div className="row topic-vote">
                <div className="col-xs-6 topic-vote-text"> {this.props.text} </div>
                    <span className="pull-right topic-vote-text">
                        <span className="upvote-button">
                            <i className="fa fa-thumbs-up"></i> 
                            {isNaN(upVotePercent) ? 0 : upVotePercent}%
                        </span>
                        <span className="downvote-button">
                            <i className="fa fa-thumbs-down"></i> 
                            {isNaN(downVotePercent) ? 0 : downVotePercent}%
                        </span>
                    </span>
            </div>
        )
    }
}

export default MyTopics;