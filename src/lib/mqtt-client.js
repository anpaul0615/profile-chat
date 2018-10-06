import IOT_CONFIG from '../configs/aws.iot.json';
import AWSIoTDeviceSDK from 'aws-iot-device-sdk';

export default class MQTTClient {

    constructor(email, credentials) {
        this.mqtt = this;
        this.topic = email;
        this.clientId = email;
        this.credentials = credentials;
        this.initClient();
    }

    async initClient() {
        // Init IoT Client
        this.mqtt = AWSIoTDeviceSDK.device({
            region: IOT_CONFIG.region,
            host: IOT_CONFIG.endpoint,
            clientId: this.clientId,
            protocol: 'wss',
            maximumReconnectTimeMs: 5000,
            debug: true,
            accessKeyId: this.credentials.accessKeyId,
            secretKey: this.credentials.secretAccessKey,
            sessionToken: this.credentials.sessionToken
        });
        // Set IoT Client Event Listener
        this.mqtt.on('connect', (result)=>{
            console.log('mqtt#connect..');
        });
        this.mqtt.on('reconnect', (result)=>{
            console.log('mqtt#reconnect..');
        });
        this.mqtt.on('offline', (result) => {
            console.log('mqtt#offline..');
        });
        this.mqtt.on('error', (err) => {
            console.log('mqtt#error..');
        });
    }

    registerRecieveMessageCallback(handleRecieveMessage) {
        this.mqtt.on('message', (topic, messageChunk) => {
            console.log('mqtt#message..');
            handleRecieveMessage(messageChunk.toString());
        });
    }

    publish(message) {
        return new Promise((resolve,reject)=>{
            this.mqtt.publish(this.topic, message, null, (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });
    }

    subscribe() {
        return new Promise((resolve,reject)=>{
            this.mqtt.subscribe(this.topic, null, (err,granted)=>{
                if (err) reject(err);
                else resolve(granted);
            });
        });
    }

    unsubscribe() {
        return new Promise((resolve,reject)=>{
            this.mqtt.unsubscribe(this.topic, (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });
    }

    disconnect(){
        this.mqtt.end();
        this.mqtt = null;
    }
}