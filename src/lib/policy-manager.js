import IOT_CONFIG from '../configs/aws.iot.json';
import * as AWS from 'aws-sdk';

export default class PolicyManager {

    constructor(globalConfig) {
        this.iotClient = new AWS.Iot();
        this.globalConfig = globalConfig;
    }

    async attachUserIdentityToPolicy(policyName, principal) {
        this.iotClient.config.update({
            credentials: this.globalConfig.credentials,
            region: IOT_CONFIG.region,
            endpoint: IOT_CONFIG.endpoint,
        });
        return new Promise((resolve,reject)=>{
            this.iotClient.attachPrincipalPolicy({policyName, principal}, (err,data)=>{
                if (err) return reject(err);
                else return resolve(data);
            });
        });
    }
}