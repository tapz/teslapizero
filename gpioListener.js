// Copyright (c) 2021 Tapani Saarinen
'use strict';

const log = require('./logger');

const Gpio = require('onoff').Gpio;
let button = new Gpio(4, 'in', 'falling', { debounceTimeout: 10 });

process.on('SIGINT', _ => {
  if (button) {
    button.unexport();
  }
});

function startListener(onGpio) {
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
  startListener
};