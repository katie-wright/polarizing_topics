import React, {Component} from 'react';
import MyTopics from './MyTopics';

class Vote extends Component {
    render(){
        let topicList = this.props.topics.map((topic, i)=>{
            return <Topic 
                      key={i}
                      text={topic.text}
                      id={topic._id}
                      upVotes={Number(topic.upVotes)}
                      downVotes={Number(topic.downVotes)}
                      totalVotes={Number(topic.totalVotes)}
                      vote={this.props.vote}
                        />
        })
        return (
            <div className="row">
                <h3><strong> Vote on Topics </strong></h3>
                <div className="col-sm-6">
                    <h4><strong> All </strong></h4>
                    {topicList}
                </div>
                {this.props.auth ?
                <div className="col-sm-6">
                    <h4><strong> My Topics </strong></h4>
                    <MyTopics setUserName={this.props.setUserName} topics={this.props.topics}/>
                </div>
                :
                null}
            </div>
        )
    }
}

class Topic extends Component {
    constructor(){
        super();
        this.state={
            voted: false
        }
        this.showVotes = this.showVotes.bind(this);
    }
    showVotes(){
        document.getElementById(this.props.id+"up").className += " show";
        document.getElementById(this.props.id+"down").className += " show";
    }
    render(){
        let upVotePercent = Math.floor(this.props.upVotes/this.props.totalVotes*100);
        let downVotePercent = Math.floor(this.props.downVotes/this.props.totalVotes*100);
        return (
            <div className="row topic-vote">
                <span className="col-xs-6 topic-vote-text"> {this.props.text} </span>
                <div className="pull-right toic-vote-buttons">
                    <button className="btn upvote-button" 
                            onClick={()=>{this.props.vote(this.props.id, "upVotes");
                                            this.setState({voted:true});
                                            this.showVotes();}} 
                            disabled={this.state.voted}>
                            <i className="fa fa-thumbs-up"></i> 
                    </button>
                    <span className="votes" id={this.props.id+"up"}> {upVotePercent+"%"} </span>
                    <button className="btn downvote-button"
                            onClick={()=>{this.props.vote(this.props.id, "downVotes");
                                            this.setState({voted:true});
                                            this.showVotes();}} 
                            disabled={this.state.voted}> 
                            <i className="fa fa-thumbs-down"></i> 
                    </button>
                    <span className="votes" id={this.props.id+"down"}> {downVotePercent+"%"} </span>
                </div>
            </div>
        )
    }
}

export default Vote;