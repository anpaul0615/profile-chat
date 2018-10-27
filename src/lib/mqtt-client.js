import AWSIoTDeviceSDK from 'aws-iot-device-sdk';
import IOT_CONFIG from '../configs/aws.iot.json';

export default class MQTTClient {
  constructor(globalConfig) {
    this.globalConfig = globalConfig;
  }

  init(clientId) {
    if (this.mqtt) {
      this.mqtt.end();
      delete this.mqtt;
    }
    this.mqtt = AWSIoTDeviceSDK.device({
      region: IOT_CONFIG.region,
      host: IOT_CONFIG['profile-chat'].endpoint,
      clientId,
      protocol: 'wss',
      maximumReconnectTimeMs: 5000,
      // debug: true,
      accessKeyId: this.globalConfig.credentials.accessKeyId,
      secretKey: this.globalConfig.credentials.secretAccessKey,
      sessionToken: this.globalConfig.credentials.sessionToken,
    });
    this.mqtt.on('connect', () => {
      // console.log('mqtt#connect..');
    });
    this.mqtt.on('reconnect', () => {
      // console.log('mqtt#reconnect..');
    });
    this.mqtt.on('offline', () => {
      // console.log('mqtt#offline..');
    });
    this.mqtt.on('error', () => {
      // console.log('mqtt#error..');
    });
    this.mqtt.on('message', (topic, messageChunk) => {
      // console.log('mqtt#message..');
      this.recieveMessageCallback(messageChunk.toString());
    });
  }

  registerMessageCallback(callback) {
    if (this.recieveMessageCallback) {
      delete this.recieveMessageCallback;
    }
    this.recieveMessageCallback = callback;
  }

  publish(topic, message) {
    return new Promise((resolve, reject) => {
      this.mqtt.publish(topic, message, null, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  subscribe(topic) {
    return new Promise((resolve, reject) => {
      this.mqtt.subscribe(topic, null, (err, granted) => {
        if (err) reject(err);
        else resolve(granted);
      });
    });
  }

  unsubscribe(topic) {
    return new Promise((resolve, reject) => {
      this.mqtt.unsubscribe(topic, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  disconnect() {
    this.mqtt.end();
  }
}
