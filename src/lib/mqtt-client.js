import IOT_CONFIG from '../configs/aws.iot.json';
import AWSIoTDeviceSDK from 'aws-iot-device-sdk';

export default class MQTTClient {

    constructor(credentials,clientId,recieveMessageCallback) {
        // Init IoT Client
        this.mqtt = AWSIoTDeviceSDK.device({
            region: IOT_CONFIG.region,
            host: IOT_CONFIG.endpoint,
            clientId: clientId,
            protocol: 'wss',
            maximumReconnectTimeMs: 5000,
            debug: true,
            accessKeyId: credentials.accessKeyId,
            secretKey: credentials.secretAccessKey,
            sessionToken: credentials.sessionToken
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
            console.log(result);
        });
        this.mqtt.on('error', (err) => {
            console.log('mqtt#error..');
            console.log(err);
        });
        this.mqtt.on('message', (topic, messageChunk) => {
            console.log('mqtt#message..');
            recieveMessageCallback(messageChunk.toString());
        });
    }

    publish(topic,message) {
        return new Promise((resolve,reject)=>{
            this.mqtt.publish(topic, message, null, (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });
    }

    subscribe(topic) {
        console.log('subscribe() called!! :: ', topic);
        return new Promise((resolve,reject)=>{
            this.mqtt.subscribe(topic, null, (err,granted)=>{
                if (err) reject(err);
                else resolve(granted);
            });
        });
    }

    unsubscribe(topic) {
        console.log('unsubscribe() called!! :: ', topic);
        return new Promise((resolve,reject)=>{
            this.mqtt.unsubscribe(topic, (err)=>{
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