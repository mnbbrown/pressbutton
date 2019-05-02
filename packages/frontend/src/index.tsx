import React from "react";
import Amplify from "@aws-amplify/core";
import ReactDOM from "react-dom";
import { withAuthenticator } from "aws-amplify-react";
import * as serviceWorker from "./serviceWorker";

console.log(process.env);

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_COGNITO_REGION || "eu-west-2",
    userPoolId: process.env.REACT_APP_COGNITO_POOL_ID || "eu-west-2_FsjRHoorz",
    userPoolWebClientId:
      process.env.REACT_APP_COGNITO_POOL_CLIENT_ID ||
      "1fa3mha4c969tlgdc691sku4hl"
  }
});

const App = withAuthenticator(() => {
  return <div>Logged In</div>;
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
