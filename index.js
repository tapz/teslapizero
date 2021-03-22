// Copyright (c) 2021 Tapani Saarinen
const { openChargePort } = require('./teslaService');
const { startGpioListener } = require('./gpioListener');

startGpioListener(openChargePort);