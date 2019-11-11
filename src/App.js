import React, {Component, Fragment} from 'react';
import './App.css';

class App extends Component{

render() {

  const authText = "NOT authenticated";

  return (
      <div className="App">
        <header className="App-header">

          You are: {authText}

        </header>
      </div>
  );
}
}

export default App;
