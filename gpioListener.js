// Copyright (c) 2021 Tapani Saarinen
'use strict';

const log = require('./logger');

const Gpio = require('onoff').Gpio;
let button = new Gpio(23, 'in', 'falling', { debounceTimeout: 100 });

process.on('SIGINT', _ => {
  if (button) {
    button.unexport();
  }
});

function startGpioListener(onGpio) {
  button = new Gpio(4, 'in', 'both');
  button.watch((err, value) => {
    if (err) {
      log.error('Failed to start GPIO listener.', err);
      throw err;
    }

    onGpio();
  });

  log.info('GPIO listener started.');
}

module.exports = {
  startGpioListener
};