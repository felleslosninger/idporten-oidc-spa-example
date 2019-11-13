import React, {Component, Fragment} from 'react';
import './App.css';
import {UserManager} from 'oidc-client';

const manager = new UserManager({
   // authority: "https://oidc-ver2.difi.no/idporten-oidc-provider",
   // client_id: "713848d2-288c-45a3-ae33-3d8e1cd00de2",
    authority: "https://eid-systest-web01.dmz.local/idporten-oidc-provider",
    client_id: "oidc_idporten_brukerprofil_oidc",
    redirect_uri: "http://localhost:3000/",
    silent_redirect_uri: "http://localhost:3000/",
    post_logout_redirect_uri: "http://localhost:3000/",
    response_type: "code",
    //scope: "openid profile idporten:authorizations.read",
    scope: "openid profile idporten:authorizations.admin idporten:user.log.all.read",
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
            userdata: []
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
        //fetch("https://eid-systest-web01.dmz.local/authorizations",{
        fetch("https://eid-systest-web01.dmz.local/eventlog-api/logg/idporten/all?maxhits=1",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.state.user.access_token,
            }
        })
        //fetch("https://api.idporten-ver2.difi.no/authorizations")
        //fetch("https://api.idporten-ver2.difi.no/innlogginger/logg/idporten/all?maxhits=1")
            .then(res => res.json())
            .then((result) => this.setState({ userdata: result }))
            .catch(function(error) {
                console.log(error);
            });
    }

    callApiHealth(e) {
        fetch("https://api.idporten-ver2.difi.no/innlogginger/health")
        //fetch("https://oidc-ver2.difi.no/kontaktinfo-oauth2-server/health")
            .then(resp => resp.json())
            .then((health) => this.setState({ apihealth: health.status }))
            .catch(function(error) {
            console.log(error);
        });
    }

    render() {

        const authText = this.isAuthenticated() ? "authenticated" : "NOT authenticated";
        const { user, apihealth } = this.state;
        const { userdata } = this.state.userdata;
        console.log(userdata);
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
                    <Fragment><p>API is: {apihealth}</p></Fragment>

                    }
                    <button onClick={this.callApiHealth}>Call API</button>
                    <br/>


                    {userdata && userdata.length && <Fragment><p>API has this data about you:</p>
                        userdata.map((item, index) => {
                             <div> Innlogging med ID-porten:

                            </div>
                        }
                        );
                    </Fragment>
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
