'use strict';

const bs58 = require('bs58');
const sha3_256 = require('js-sha3').sha3_256;
const urlsafeBase64  = require('urlsafe-base64');

// @flow

/**
* @module constellate/src/util
*/

function clone(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj));
}

function sha3Buffer(str: string): Buffer {
  return Buffer.from(sha3_256.buffer(str));
}

function digestBase64(str: string): string {
  return urlsafeBase64.encode(sha3Buffer(str)).toString('utf-8', 0, 3);
}

function encodeBase58(key: Buffer): string {
  return bs58.encode(key);
}

// from http://stackoverflow.com/questions/16167581/sort-object-properties-and-json-stringify#comment73545624_40646557

function orderStringify(obj: Object, space?: number): string {
  const keys = [];
  JSON.stringify(obj, (k, v) => {
    keys.push(k);
    return v;
  });
  return JSON.stringify(obj, keys.sort(), space);
}

exports.encodeBase58 = encodeBase58;
exports.digestBase64 = digestBase64;
exports.clone = clone;
exports.orderStringify = orderStringify;
exports.sha3Buffer = sha3Buffer;

//--------------------------------------------------------------------------------

function isArray(arr: any): boolean {
  return arr != null && Array.isArray(arr) && arr.length > 0;
}

function isBoolean(bool: any): boolean {
  return bool != null && typeof bool === 'boolean';
}

function isNumber(num: any): boolean {
  return num != null && typeof num === 'number';
}

function isObject(obj: any): boolean {
  return obj != null && obj.constructor === Object && Object.keys(obj).length > 0;
}

function isString(str: any): boolean {
  return str != null && typeof str === 'string' && str.length > 0;
}

function isEqual(val1: any, val2: any): boolean {
  return orderStringify(val1) === orderStringify(val2);
}

function arrayFromObject(obj: Object): any[][] {
  return Object.keys(obj).map((key) => [key, obj[key]]);
}

function hasKey(obj: Object, key: string): boolean {
  return obj.hasOwnProperty(key) && obj[key] != null;
}

function hasKeys(obj: Object, ...keys: string[]): boolean {
  if (!isArray(keys)) { return false; }
  return keys.every((key) => hasKey(obj, key));
}

function objectFromArray(arr: any[][]): Object {
  return arr.reduce((result, [key, val]) => Object.assign({}, result, {[key]: val}), {});
}

function recurse(x: any, fn: Function): any {
  if (isArray(x)) {
    return x.map((y) => recurse(fn(y), fn));
  }
  if (isObject(x)) {
    return Object.assign({}, ...Object.keys(x).map((k) => objectFromArray([[k, recurse(fn(x[k], k), fn)]])));
  }
  return x;
}

function withoutKeys(obj: Object, ...keys: string[]): Object {
  return Object.keys(obj).reduce((result, key) => {
    if (keys.includes(key)) { return result; }
    return Object.assign({}, result, objectFromArray([[key, obj[key]]]));
  }, {});
}

exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;

exports.arrayFromObject = arrayFromObject;
exports.hasKeys = hasKeys;
exports.objectFromArray = objectFromArray;
exports.orderStringify = orderStringify;
exports.recurse = recurse;
exports.withoutKeys = withoutKeys;
