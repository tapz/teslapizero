// Copyright (c) 2021 Tapani Saarinen
'use strict';

const Gpio = require('onoff').Gpio;
let button = new Gpio(4, 'in', 'both');

process.on('SIGINT', _ => {
  if (button) {
    button.unexport();
  }
});

function startListener(onGpio) {
  button = new Gpio(4, 'in', 'both');
  button.watch((err, value) => {
    if (err) {
      throw err;
    }

    onGpio();
  });
}

module.exports = {
  startListener
}