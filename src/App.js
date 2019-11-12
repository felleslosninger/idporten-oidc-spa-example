import React, {Component, Fragment} from 'react';
import './App.css';
import {UserManager} from 'oidc-client';

const manager = new UserManager({
    authority: "https://oidc-ver2.difi.no/idporten-oidc-provider",
    client_id: "713848d2-288c-45a3-ae33-3d8e1cd00de2",
    redirect_uri: "http://localhost:3000",
    silent_redirect_uri: "http://localhost:3000",
    post_logout_redirect_uri: "http://localhost:3000",
    response_type: "code",
    scope: "openid profile",
    loadUserInfo: false
});

class App extends Component {

    constructor(props) {
        super(props);
        this.loginComplete = this.loginComplete.bind(this);
        this.logoutComplete = this.logoutComplete.bind(this);
        this.callApiHealth= this.callApiHealth.bind(this);
        this.callOppslagstjenestenApi = this.callOppslagstjenestenApi.bind(this);
        this.state = {
            user: null,
            apihealth: null,
            userdata: null
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

    callOppslagstjenestenApi(e) {
    }

    callApiHealth(e) {
        let currentComponent = this;
        fetch("https://api.idporten-ver2.difi.no/innlogginger/health")
        //fetch("https://oidc-ver2.difi.no/kontaktinfo-oauth2-server/health")
            .then(res => res.json())
            .then((result) => currentComponent.setState({ apihealth: result.status }))
            .catch(function(error) {
            console.log(error);
        });
    }

    render() {

        const authText = this.isAuthenticated() ? "authenticated" : "NOT authenticated";
        const { user, apihealth, userdata } = this.state;

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
                    {apihealth &&
                    <p>API is: {apihealth}</p>

                    }
                    <button onClick={this.callApiHealth}>Call API</button>
                    <br/>

                    {userdata &&
                    <p>API has this data about you: {userdata}</p>

                    }
                    <button onClick={this.callOppslagstjenestenApi}>Fetch data from API</button>
                    <br/>
                    <button onClick={this.logoutStart}>Start logout</button>
                    <button onClick={this.logoutComplete}>Complete logout</button>

                </header>
            </div>
        );
    }


}

export default App;
