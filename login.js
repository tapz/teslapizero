// Copyright (c) 2021 Tapani Saarinen
'use strict';

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

    console.log('Auth token: ' + result.authToken);
    console.log('Refresh token: ' + result.refreshToken);

    fs.writeFileSync('tokens.json', JSON.stringify({
      authToken: result.authToken,
      refreshToken: result.refreshToken
    }));
  } catch (e) {
    console.log('Login failed: ', e);
  }
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("E-mail: ", email => {
  rl.question("Password: ", password => {
    rl.question("MFA code: ", async mfaPassCode => {
      rl.close();
      await login(email, password, mfaPassCode);
    });
  });
});