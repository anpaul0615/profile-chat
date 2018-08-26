import COGNITO_CONFIG from '../configs/aws.cognito.json';
import * as AWS from 'aws-sdk';
import * as CognitoIdentity from 'amazon-cognito-identity-js';

export default class CognitoClient {

    constructor() {
        // Init CognitoUserPool
        this.userPool = new CognitoIdentity.CognitoUserPool({
            UserPoolId: COGNITO_CONFIG.UserPoolId,
            ClientId: COGNITO_CONFIG.ClientId
        });
    }

    getCredentials(username, password) {
        return new Promise((resolve,reject)=>{
            // Init CognitoUser
            this.cognitoUser = new CognitoIdentity.CognitoUser({
                Username : username,
                Pool : this.userPool
            });
            // Init AuthenticationDetails
            this.authenticationDetails = new CognitoIdentity.AuthenticationDetails({
                Username : username,
                Password : password
            });
            // Authenticate Cognito User
            this.cognitoUser.authenticateUser(this.authenticationDetails, {
                onSuccess: (result)=>{
                    // Init Cognito-Credentials by Cognito-AccessToken
                    const idToken = result.getIdToken().getJwtToken();
                    const providerKey = `cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/${COGNITO_CONFIG.UserPoolId}`;
                    const cognitoCredentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: COGNITO_CONFIG.IdentityPoolId,
                        Logins : {
                            [providerKey]: idToken,
                        }
                    });
                    // Set Cognito Credentials
                    AWS.config.region = COGNITO_CONFIG.region;
                    AWS.config.credentials = cognitoCredentials;
                    // Return Cognito Credentials Data
                    AWS.config.credentials.get((err) => {
                        if (err) return reject(err);
                        else return resolve(AWS.config.credentials);
                    });
                },
                onFailure: (err)=>{
                    return reject(err);
                }
            });
        });
    }

    registerNewAccount(email, password) {
        return new Promise((resolve,reject)=>{
            // Set Attributes
            const username = email.split('@')[0];
            const attributeList = [
                new CognitoIdentity.CognitoUserAttribute({
                    Name: 'email',
                    Value: email,
                }),
                new CognitoIdentity.CognitoUserAttribute({
                    Name: 'name',
                    Value: username,
                })
            ];
            this.userPool.signUp(username, password, attributeList, null, (err,result)=>{
                if (err) return reject(err);
                else return resolve({ username: result.user.getUsername() });
            });
        });
    }

    signout() {
        this.cognitoUser.signOut();
    }
}