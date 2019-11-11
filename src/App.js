import React, {Component, Fragment} from 'react';
import './App.css';
import {UserManager} from 'oidc-client';

const manager = new UserManager({
    authority: "https://oidc-ver2.difi.no/idporten-oidc-provider",
    client_id: "oidc_difi_spa_example1",
    redirect_uri: "http://localhost:3000/",
    response_type: "code",
    scope: "openid profile",
});

class App extends Component{

render() {

  const authText = "NOT authenticated";

  return (
      <div className="App">
        <header className="App-header">

          You are: {authText}


            <button onClick={this.loginStart}>Start login</button>
        </header>
      </div>
  );
}
}

export default App;
