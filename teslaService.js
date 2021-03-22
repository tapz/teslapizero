// Copyright (c) 2021 Tapani Saarinen
'use strict';

const fs = require('fs');
const tesla = require('teslajs');
const log = require('./logger');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function openChargePort() {
  try {
    const json = fs.readFileSync('tokens.json', {
      encoding: 'utf8'
    });

    const options = JSON.parse(json);
    if (!options) {
      log.error('Invalid tokens file.');
      return;
    }

    tesla.wakeUpAsync(options).catch(e => {
      log.error('Failed to wake-up vehicle.', e);
    });
    
    log.info('Get charge state...');

    const chargeState = await tesla.chargeStateAsync(options);
    log.info('Charge port latch: ' + JSON.stringify(chargeState.charge_port_latch));
    log.info('Charging state: ' + JSON.stringify(chargeState.charging_state));
    
    if (chargeState.charge_port_latch === 'Engaged' && chargeState.charging_state !== 'Disconnected') {
      if (chargeState.charging_state === 'Charging' || chargeState.charging_state === 'Starting') {
        console.log('Stop charging...');
        await tesla.stopChargeAsync(options);
        await tesla.flashLightsAsync(options);
        await tesla.flashLightsAsync(options);

        for (let i = 0; i < 10; i++) {
          await sleep(1000);
          const cs = await tesla.chargeStateAsync(options);
          
          if (cs.charging_state === 'Stopped') {
            log.info('Charging stopped.');
            break;
          }
        }
      }

      log.info('Release charge port latch...');

      await tesla.openChargePortAsync(options);
      await tesla.flashLightsAsync(options);
    } else {
      if (chargeState.charging_state === 'Disconnected') {
        if (chargeState.charge_port_door_open) {
          log.info('Close charge port...');
          await tesla.closeChargePortAsync(options);
        } else {
          log.info('Open charge port...');
          await tesla.openChargePortAsync(options);
        }
      } else {
        log.info('Start charging...');
        await tesla.startChargeAsync(options);
      }
      
      await tesla.flashLightsAsync(options);
    }

    const chargeStateAfter = await tesla.chargeStateAsync(options);
    log.info('Charge port latch: ' + JSON.stringify(chargeStateAfter.charge_port_latch));
    log.info('Charging state: ' + JSON.stringify(chargeStateAfter.charging_state));
  } catch (e) {
    log.error('Tesla API failed: ', e);
  }
}

module.exports = {
  openChargePort
};