import React, {Component} from 'react';

class Submit extends Component {
    constructor(){
        super();
        this.state={
            input: ""
        }
        this.onTextChange = this.onTextChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onTextChange(event) {
		this.setState({input: event.target.value})
	}
	onSubmit(event) {
		event.preventDefault();
        if (this.state.input) {
            this.props.newTopic(this.state.input)
            this.setState({
                input: ""
            }) 
        }
        else {
            alert("Please enter a topic");
        }
	}
    render(){
        return (
            <div className="row">
                <h3><strong> Submit a Topic </strong></h3>
                <form onSubmit={this.onSubmit} className="input-group col-sm-6">
					<input className="form-control" placeholder="new topic" onChange={this.onTextChange} value={this.state.input}/>
                    <span className="input-group-btn">
						<button className="btn submit-button" type="submit">Submit</button>
					</span>
                </form>
            </div>
        )
    }
}

export default Submit;