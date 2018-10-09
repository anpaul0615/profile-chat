import IOT_CONFIG from '../configs/aws.iot.json';
import AWSIoTDeviceSDK from 'aws-iot-device-sdk';

let instance = null;

export default class MQTTClient {

    constructor(credentials,clientId,recieveMessageCallback) {
        // Return Singleton Object
        if (instance) return instance;
        // Init IoT Client
        instance = AWSIoTDeviceSDK.device({
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
        instance.on('connect', (result)=>{
            console.log('mqtt#connect..');
        });
        instance.on('reconnect', (result)=>{
            console.log('mqtt#reconnect..');
        });
        instance.on('offline', (result) => {
            console.log('mqtt#offline..');
            console.log(result);
        });
        instance.on('error', (err) => {
            console.log('mqtt#error..');
            console.log(err);
        });
        instance.on('message', (topic, messageChunk) => {
            console.log('mqtt#message..');
            recieveMessageCallback(messageChunk.toString());
        });
    }

    publish(topic,message) {
        return new Promise((resolve,reject)=>{
            instance.publish(topic, message, null, (err)=>{
                if (err) reject(err);
                else resolve();
            });
        });
    }

    subscribe(topic) {
        console.log('subscribe() called!! :: ', topic);
        return new Promise((resolve,reject)=>{
            instance.subscribe(topic, null, (err,granted)=>{
                if (err) reject(err);
                else resolve(granted);
            });
        });
    }

    unsubscribe(topic) {
        console.log('unsubscribe() called!! :: ', topic);
        return new Promise((resolve,reject)=>{
            instance.unsubscribe(topic, (err)=>{
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