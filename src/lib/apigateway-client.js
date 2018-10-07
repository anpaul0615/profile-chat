import APIGATEWAY_CONFIG from '../configs/aws.apigateway.json';
import * as AWS from 'aws-sdk';
import sigV4Client from './sigV4Client';

export default class APIGatewayClient {
    async invokeAPIGateway({ path='/', method='GET', headers={}, queryParams={}, body }) {
        
        if (!AWS.config.credentials) {
            throw new Error('User is not logged in..!');
        }
        if (Date.now() > AWS.config.credentials.expireTime - 60000) {
            throw new Error('Expired-time is nearby..!');
        }
        
        const client = sigV4Client.newClient({
            accessKey: AWS.config.credentials.accessKeyId,
            secretKey: AWS.config.credentials.secretAccessKey,
            sessionToken: AWS.config.credentials.sessionToken,
            region: APIGATEWAY_CONFIG.region,
            endpoint: APIGATEWAY_CONFIG.endpoint,
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