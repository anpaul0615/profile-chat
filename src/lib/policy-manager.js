import * as AWS from 'aws-sdk';

export default class PolicyManager {

    constructor(){
        this.iotClient = new AWS.Iot();
    }

    attachUserIdentityToPolicy(policyName, principal) {
        return new Promise((resolve,reject)=>{
            this.iotClient.attachPrincipalPolicy({policyName, principal}, (err,data)=>{
                if (err) return reject(err);
                else return resolve(data);
            });
        });
    }
}