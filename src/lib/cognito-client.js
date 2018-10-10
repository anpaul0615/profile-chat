import COGNITO_CONFIG from '../configs/aws.cognito.json';
import * as AWS from 'aws-sdk';
import * as CognitoIdentity from 'amazon-cognito-identity-js';

export default class CognitoClient {

    constructor() {
        this.userPool = new CognitoIdentity.CognitoUserPool({
            UserPoolId: COGNITO_CONFIG.UserPoolId,
            ClientId: COGNITO_CONFIG.ClientId
        });
    }

    getUserName() {
        return new Promise((resolve,reject)=>{
            if (!this.cognitoUser) return reject(new Error('Empty Session Data..!'));
            return resolve(this.cognitoUser.username);
        });
    }

    getCredentials(cognitoUserSession) {
        return new Promise((resolve,reject)=>{
            const idToken = cognitoUserSession.getIdToken().getJwtToken();
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
            AWS.config.credentials.refresh((err) => {
                if (err) return reject(err);
                return resolve(AWS.config.credentials);
            });
        });
    }

    getUserSessionFromStorage() {
        return new Promise((resolve,reject)=>{
            // Check Previous-Session-Data Form Cognito-Storage (Localstorage/Cookie)
            this.cognitoUser = this.userPool.getCurrentUser();
            if (!this.cognitoUser) {
                return reject(new Error('Empty Session Data..!'));
            }
            // Get Cognito-Session From Cognito-Storage
            this.cognitoUser.getSession((err,signInUserSession)=>{
                if (err) return reject(err);
                return resolve(signInUserSession);
            });
        });
    }

    getUserSessionByAuthentication(userName, password) {
        return new Promise((resolve,reject)=>{
            // Init CognitoUser
            this.cognitoUser = new CognitoIdentity.CognitoUser({
                Username : userName,
                Pool : this.userPool
            });
            // Init AuthenticationDetails
            const authenticationDetails = new CognitoIdentity.AuthenticationDetails({
                Username : userName,
                Password : password
            });
            // Authenticate Cognito User
            this.cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (cognitoUserSession)=>{
                    return resolve(cognitoUserSession);
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
            const userName = email.split('@')[0];
            const attributeList = [
                new CognitoIdentity.CognitoUserAttribute({
                    Name: 'email',
                    Value: email,
                }),
                new CognitoIdentity.CognitoUserAttribute({
                    Name: 'name',
                    Value: userName,
                })
            ];
            this.userPool.signUp(userName, password, attributeList, null, (err,result)=>{
                if (err) return reject(err);
                else return resolve({ userName: result.user.getUsername() });
            });
        });
    }

    signout() {
        this.cognitoUser.signOut();
    }

    clearStorage() {
        if (this.userPool.storage.length !== 0)
            this.userPool.storage.clear();
    }

}