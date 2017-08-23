import React, {Component} from 'react';
import axios from 'axios';

class SignupModal extends Component {
    constructor(){
        super();
        this.state={
            username: "",
            password: ""
        }
        this.formSubmit = this.formSubmit.bind(this);
        this.txtFieldChange = this.txtFieldChange.bind(this);
    }
    txtFieldChange(e){
        if(e.target.name === "username"){
            this.setState({
                username: e.target.value
            });
        }
        else if(e.target.name === "password"){
            this.setState({
                password: e.target.value
            });
        }
    }
    formSubmit(e){
    e.preventDefault();
    if (!this.state.username || !this.state.password) {
        alert("Please enter a username and password");
    }
    else {
        axios.post('http://localhost:8080/register',this.state)
        .then(res =>{
            console.log(res);
            if (res.status===200){
                return (axios.post('http://localhost:8080/login',this.state))
            }
        })
        .then(res =>{
            if (res.status===200) {
                localStorage.setItem("authToken", res.data.token);
                this.props.login();
            }
        })
        .catch(err=>{
            console.log(err);
        });
    }
  }
    render(){
        return (
            <div id="signup" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Sign Up</h4>
                        </div>
                        <div className="modal-body">
                            <div id="auth">
                                <form>
                                    <div className="form-group">
                                        <input 
                                        onChange={this.txtFieldChange}
                                        className="form-control"
                                        type="text" 
                                        placeholder="Username" 
                                        name="username"
                                        value={this.state.username} />
                                    </div>
                                    <div className="form-group">
                                        <input 
                                        onChange={this.txtFieldChange}
                                        className="form-control"
                                        type="password" 
                                        placeholder="Password" 
                                        name="password"
                                        value={this.state.password} />
                                    </div> 
                                    <div className="form-group">
                                        <button onClick={this.formSubmit} type="submit" className="btn btn-primary" data-dismiss="modal">Register</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignupModal;