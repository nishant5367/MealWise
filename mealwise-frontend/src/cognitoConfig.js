// cognitoConfig.js
import AWS from "aws-sdk";

AWS.config.region = "eu-north-1";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "eu-north-1:a0119d8d-0d29-4944-a4d1-7fdf47b0effb",  // Your Identity Pool ID
});

const cognito = new AWS.CognitoIdentityServiceProvider();

export default cognito;
