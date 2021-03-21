// Copyright (c) 2021 Tapani Saarinen
const { openChargePort } = require('./teslaApi');
const { startGpioListener } = require('./gpioListener');

startGpioListener(openChargePort);