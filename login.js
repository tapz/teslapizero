// Copyright (c) 2021 Tapani Saarinen
'use strict';

const log = require('./logger');
const fs = require('fs');
const tesla = require('teslajs');

async function login(username, password, mfaPassCode) {
  try {
    const res = await tesla.loginAsync({
      username: '',
      password: '',
      mfaPassCode: ''
    });

    if (res.error) {
      console.log(JSON.stringify(res.error));
      process.exit(1);
    }

    console.log('Auth token: ' + res.authToken);
    console.log('Refresh token: ' + res.refreshToken);

    const tokens = {
      authToken: res.authToken,
      refreshToken: res.refreshToken
    };

    const vehicles = await tesla.vehiclesAsync(tokens);
    if (!vehicles || vehicles.length === 0) {
      log.error('No vehicles.');
      return;
    }

    vehicles.forEach((vehicle, i) => {
      console.log(`${i}: ${vehicle.vin} - ${vehicle.display_name}`);
    });

    rl.question('Car index: ', index => {
      fs.writeFileSync('tokens.json', JSON.stringify({
        ...tokens,
        vehicleID: vehicles[index].id
      }));
    });
  } catch (e) {
    log.error('Login failed: ', e);
  } finally {
    rl.close();
  }
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('E-mail: ', email => {
  rl.question('Password: ', password => {
    rl.question('MFA code: ', async mfaPassCode => {
      console.log('Logging in...');
      await login(email, password, mfaPassCode);
    });
  });
});