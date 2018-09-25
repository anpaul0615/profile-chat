import IOT_CONFIG from '../configs/aws.iot.json';
import AWSIoTDeviceSDK from 'aws-iot-device-sdk';

let instance = null;

export default class MQTTClient {

    constructor(email, credentials) {
        if (instance) {
          return instance;
        }
        // Set Default Properties
        instance = this;
        this.topic = email;
        this.clientId = email;
        this.credentials = credentials;
        this.initClient();
    }

    async initClient() {
        // Init IoT Client
        instance = AWSIoTDeviceSDK.device({
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
        instance.on('connect', (result)=>{
            console.log('event#connect..');
            console.log(result);
        });
        instance.on('reconnect', (result)=>{
            console.log('event#reconnect..');
            console.log(result);
        });
        instance.on('offline', (result) => {
            console.log('event#offline..');
            console.log(result);
        });
        instance.on('error', (err) => {
            console.log('event#error..');
            console.log(err);
        });
    }

    registerRecieveMessageCallback(handleRecieveMessage) {
        instance.on('message', (topic, messageChunk) => {
            console.log('event#message..');
            console.log('> topic : ', topic.toString());
            console.log('> messageChunk : ', messageChunk.toString());
            handleRecieveMessage(messageChunk.toString());
        });
    }

    publish(message) {
        console.log(message);
        return new Promise((resolve,reject)=>{
            instance.publish(this.topic, message, null, (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });
    }

    subscribe() {
        return new Promise((resolve,reject)=>{
            instance.subscribe(this.topic, null, (err,granted)=>{
                if (err) reject(err);
                else resolve(granted);
            });
        });
    }

    unsubscribe() {
        return new Promise((resolve,reject)=>{
            instance.unsubscribe(this.topic, (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });
    }

    disconnect(){
        instance.end();
        instance = null;
    }
}