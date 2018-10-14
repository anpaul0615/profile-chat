import * as AWS from 'aws-sdk';
import AWS_COMMON_CONFIG from '../configs/aws.common.json';

import CognitoClient from './cognito-client';
import MQTTClient from './mqtt-client';
import PolicyManager from './policy-manager';
import APIGatewayClient from './apigateway-client';

AWS.config.update({
  region: AWS_COMMON_CONFIG.region,
});

export const apigwClient = new APIGatewayClient(AWS.config);
export const cognitoClient = new CognitoClient(AWS.config);
export const mqttClient = new MQTTClient(AWS.config);
export const poilcyManager = new PolicyManager(AWS.config);
