// Copyright (c) 2021 Tapani Saarinen
'use strict';

const log = require('./logger');

const Gpio = require('onoff').Gpio;

function startGpioListener(onGpio) {
  const button = new Gpio(8, 'in', 'falling', { debounceTimeout: 10 });

  process.on('SIGINT', _ => {
    button.unexport();
  });

  button.watch((err, value) => {
    if (err) {
      log.error('Failed to start GPIO listener.', err);
      throw err;
    }

    onGpio();
  });

  log.info('Listening GPIO 8.');
}

module.exports = {
  startGpioListener
};

