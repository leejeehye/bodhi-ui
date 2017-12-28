import { Map } from 'immutable';
import BN from 'bn.js';
const fetch = require('node-fetch');
const BOTOSHI_TO_BOT = 100000000; // Both qtum and bot's conversion rate is 10^8 : 1
const BOT_MIN_VALUE = 0.01; // Both qtum and bot's conversion rate is 10^8 : 1
const BOT_DECIMALS = 8;

export function clearToken() {
  localStorage.removeItem('id_token');
}

export function getToken() {
  try {
    const idToken = localStorage.getItem('id_token');
    return new Map({ idToken });
  } catch (err) {
    clearToken();
    return new Map();
  }
}

export function timeDifference(time) {
  const givenTime = new Date(time);
  const milliseconds = new Date().getTime() - givenTime.getTime();
  const numberEnding = (number) => number > 1 ? 's' : '';
  const number = (num) => num > 9 ? `${num}` : `0${num}`;
  const getTime = () => {
    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
      const month = number(givenTime.getUTCMonth() + 1);
      const day = number(givenTime.getUTCDate());
      const year = givenTime.getUTCFullYear() % 100;
      return `${day}-${month}-${year}`;
    }
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      if (days < 28) {
        return `${days} day${numberEnding(days)}`;
      }
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const month = months[givenTime.getUTCMonth()];
      const day = number(givenTime.getUTCDate());
      return `${day} ${month}`;
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return `${hours} hour${numberEnding(hours)} ago`;
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return `${minutes} minute${numberEnding(minutes)} ago`;
    }
    return 'a few seconds ago';
  };
  return getTime();
}


/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export function request(url, options) {
  console.log('url:', url, 'options:', options);

  return fetch(url, options)
    .then(parseJSON)
    .then(checkStatus);
}

/**
 * Returns resolved Promise if Http response contains result; otherwise returns rejected upon error.
 *
 * @param  {object} response   JSON response from a HTTP request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  // We can rely on checking error object so dont check HTTP status code here.
  if (response.error) {
    throw new Error(response.error);
  } else {
    return response.result;
  }
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json();
}

// Returns a new random alphanumeric string of the given size.
//
// Note: to simplify implementation, the result has slight modulo bias,
// because chars length of 62 doesn't divide the number of all bytes
// (256) evenly. Such bias is acceptable for most cases when the output
// length is long enough and doesn't need to be uniform.
export function randomString(size) {
  if (size === 0) {
    throw new Error('Zero-length randomString is useless.');
  }
  const chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789');

  let result = '';

  for (let i = size; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

// Returns a new random alphanumeric string suitable for object ID.
export function newObjectId(size = 10) {
  return randomString(size);
}

/**
 * Convert a BigNumber to ES6 Int (2^53 max == 9 007 199 254 740 992) and divide it by 10^8
 * If result number is too small (less than 0.01) we return 0
 * @param  {[type]}
 * @return {[type]}
 */
export function convertBNHexStrToQtum(input) {
  const bigNumber = new BN(input, 16);
  const botoshi = new BN(BOTOSHI_TO_BOT);

  const integer = bigNumber.div(botoshi).toNumber();
  const decimal = bigNumber.mod(botoshi).toNumber();
  const result = integer + (decimal / BOTOSHI_TO_BOT);

  // if (input !== '0') { console.log(`${input} to ${result}`); }

  return result >= BOT_MIN_VALUE ? result : 0;
}

/**
 * Convert ES6 Int to Botoshi (BigNumber format).
 * @param  {Number} Number to convert to Botoshi in decimal format.
 * @return {String} The converted decimal to BigNumber in hex format.
 */
export function decimalToBotoshiHex(decimalNum) {
  // Converting to BigNumber drops the decimals so we need to store the decimals as a BN to add it back.
  let decimalsBN;
  if (decimalNum.toString().indexOf('.') !== -1) {
    decimalsBN = new BN(decimalNum.toFixed(BOT_DECIMALS).toString().split('.')[1]);
  } else {
    decimalsBN = new BN(0);
  }

  const bigNumber = new BN(decimalNum);
  const botoshiBN = new BN(BOTOSHI_TO_BOT);
  return bigNumber.mul(botoshiBN).add(decimalsBN).toJSON();
}

/**
 * Convert ES6 Int to BigNumber hex string.
 * @param  {Number} Number to convert (no decimals).
 * @return {String} The converted number to BigNumber in hex format.
 */
export function numToBNHex(number) {
  return new BN(number).toJSON();
}