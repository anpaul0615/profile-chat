import APIGATEWAY_CONFIG from '../configs/aws.apigateway.json';
import sigV4Client from './sigV4Client';

export default class APIGatewayClient {

    constructor(globalConfig) {
        this.globalConfig = globalConfig;
    }

    async invokeAPIGateway({ path='/', method='GET', headers={}, queryParams={}, body }) {
        if (!this.globalConfig.credentials) {
            throw new Error('User is not logged in..!');
        }
        if (Date.now() > this.globalConfig.credentials.expireTime - 60000) {
            throw new Error('Expired-time is nearby..!');
        }
        
        const client = sigV4Client.newClient({
            accessKey: this.globalConfig.credentials.accessKeyId,
            secretKey: this.globalConfig.credentials.secretAccessKey,
            sessionToken: this.globalConfig.credentials.sessionToken,
            region: APIGATEWAY_CONFIG.region,
            endpoint: APIGATEWAY_CONFIG['profile-chat'].endpoint,
        });
        
        const signedRequest = client.signRequest({
            method,
            path,
            headers,
            queryParams,
            body,
        });
        
        const signedBody = body ? JSON.stringify(body) : body;
        const signedHeaders = signedRequest.headers;
        
        const results = await fetch(signedRequest.url, {
            method,
            headers: signedHeaders,
            body: signedBody,
        });
        
        if (results.status !== 200) {
            throw new Error(await results.text());
        }

        return results.json();
    }
}