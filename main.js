'use strict'

const bleno = require('bleno-mac');
const BlenoPrimaryService = bleno.PrimaryService;

const SERVECE_UUID = `D5875408-FA51-4763-A75D-7D33CECEBC31`; //適宜書き換え
const CHARACTERISTIC_UUID = `A4F01D8C-A037-43B6-9050-1876A8C23584`; //適宜書き換え
const DEVICE_NAME = `n0bisuke-BLE-device`; //デバイス名
console.log(`bleno - ${DEVICE_NAME}`);

let counter = 0;
setInterval(()=>{counter++}, 1000); //値の変化を見るために毎秒インクリメント

const Characteristic = bleno.Characteristic;
const characteristic = new Characteristic({
    uuid: CHARACTERISTIC_UUID,
    properties: ['read','write'],
    onReadRequest: (offset, callback) => { //Central側からReadリクエストが来ると発火
        console.log(counter); //READリクエストでカウントを表示
        const result = Characteristic.RESULT_SUCCESS;
        const data = new Buffer.from(`${counter}`);
        callback(result, data);
    },
    onWriteRequest: (data,offset,withoutResponse,callback) => {
      console.log(data)
      const result = Characteristic.RESULT_SUCCESS;
      callback(result)
    }
});

bleno.on('stateChange', (state) => {
    console.log(`on -> stateChange: ${state}`);
    if (state === 'poweredOn') {
        bleno.startAdvertising(DEVICE_NAME, [SERVECE_UUID]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', (error) => {
    console.log(`on -> advertisingStart: ${(error ? 'error ' + error : 'success')}`);
    if(error) return;

    const blenoService = new BlenoPrimaryService({
        uuid: SERVECE_UUID,
        characteristics: [characteristic]
    });

    bleno.setServices([blenoService]);
});
/*
var bleno = require('bleno');

var uuid = 'aaaaaaaabbbbccccddddeeeeeeeeeeee';
var major = 0;
var minor = 0;
var measuredPower = -59;

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower);
  }
});
*/
//  nodebrew use v8.9.4
// https://github.com/sandeepmistry/node-xpc-connection/issues/28#issuecomment-442614064