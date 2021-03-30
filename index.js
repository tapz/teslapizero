// Copyright (c) 2021 Tapani Saarinen
'use strict';

const log = require('./logger');

log.info('Starting...');

const { openChargePort } = require('./teslaService');
const { startGpioListener } = require('./gpioListener');

let pending = false;

startGpioListener(async () => {
  if (!pending) {
    pending = true;

    try {
      await openChargePort();
    } finally {
      pending = false;
    }
  } else {
    log.warn('GPIO event ignored.');
  }
});