import React, {Component, Fragment} from 'react';
import './App.css';
import {UserManager} from 'oidc-client';

const manager = new UserManager({
    authority: "https://oidc-ver2.difi.no/idporten-oidc-provider",
    client_id: "713848d2-288c-45a3-ae33-3d8e1cd00de2",
    redirect_uri: "http://localhost:3000",
    response_type: "code",
    scope: "openid profile",
});

class App extends Component {

    constructor(props) {
        super(props);
        this.loginComplete = this.loginComplete.bind(this);
        this.logoutComplete = this.logoutComplete.bind(this);
        this.state = {
            user: null
        };
    }

    loginStart(e) {
        manager.signinRedirect();
    }

    loginComplete(e) {
        manager.signinRedirectCallback()
            .then(user => this.setState({user: user}));
    }

    logoutStart(e) {
        manager.signoutRedirect();
    }

    logoutComplete(e) {
        manager.signoutRedirectCallback()
            .then(() => this.setState({user: null}));
    }

    isAuthenticated() {
        if (this.state.user) {
            return this.state.user.access_token !== "" && this.state.user.expires_at > parseInt(Date.now() / 1000);
        } else {
            return false;
        }
    }

    render() {

        const authText = this.isAuthenticated() ? "authenticated" : "NOT authenticated";
        const user = this.state.user;

        return (
            <div className="App">
                <header className="App-header">

                    <p>You are: <b>{authText}</b></p>
                    <br/>
                    {user &&
                    <Fragment>
                        <table>
                            <thead>
                            <tr><th>Attribute</th><th>Value</th></tr>
                            </thead>
                            <tbody>
                            <tr><td>access_token: </td><td >{user.access_token.substr(0, 50) + "..."}</td></tr>
                            <tr><td>scope: </td><td>{user.scope}</td></tr>
                            <tr><td>pid: </td><td>{user.profile.pid}</td></tr>
                            </tbody>
                        </table>
                    </Fragment>
                    }
                    <br/>
                    <button onClick={this.loginStart}>Start login</button>
                    <button onClick={this.loginComplete}>Complete login</button>
                    <br/>
                    <button onClick={this.logoutStart}>Start logout</button>
                    <button onClick={this.logoutComplete}>Complete logout</button>

                </header>
            </div>
        );
    }


}

export default App;
