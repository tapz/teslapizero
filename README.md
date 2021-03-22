# Tesla Charge Port Latch Opener
Open Tesla charge port latch without Tesla button in the charger plug.

---
## **HARDWARE**

You need the following hardware components and equipments. The links are examples where you can buy the parts. You may find similar products elsewhere for lower price.

* [Raspberry Pi Zero W with headers](https://www.partco.fi/en/raspberry-pi/raspberry-pi/20722-rpi-zero-wh.html)
* [PIN header connectors](https://www.partco.fi/en/liittimet/piikkirima-liittimet/johtoliittimet-piikkirimaan/15756-harwin-1x1.html)
* [Singlecore wire](https://www.partco.fi/en/kaapelitjohdot/yksisaeikeiset-kytkentaejohdot/14316-kaa-kj-1x06-pun.html) (1m)

* [Micro-USB cable](https://www.partco.fi/en/computer/buses/usb/usb-cables/19508-dk-usb-vj17-1mku.html?search_query=micro-usb&results=790)

* [USB charger](https://www.partco.fi/en/power-supplies/usb-chargers/21300-wchau484abk.html) (min 2.5A/13W)

* [Honeywell Home D680 QUADRA](https://www.elektroshopwagner.de/product_info.php/info/p244646_Honeywell-Home-D680-QUADRA-Taster-62x62x13-mm--elfenbein.html) (low voltage 1-24V doorbell push)

* [MicroSD memory card](https://www.partco.fi/en/memory-cards/21591-gr-sd-16gb-ua1.html?search_query=micro+sd&results=583) (min 16GB, class 10)

* USB MicroSD memory card reader

---

## **SOFTWARE**

Connect the memory card to your PC.

### Install operating system

Install and start [Raspberry Pi Imager](https://www.raspberrypi.org/software/)

```
Operating System: 
  Raspberry Pi (other)
    Raspberry Pi OS Lite (32-bit)

Storage:
  Memory card

Write
```

Use Notepad in Windows or TextEdit in Mac. When saving files in Notepad, use quotes in the filename to prevent Notepad from adding the .txt extension.

Write an empty text file named `"ssh"` to the root of the directory of the memory card.

### Setup Wi-Fi

Create a text file named `"wpa_supplicant.conf"` to the root directory of the memory card with the following content. Replace `wifiName` and `wifiPassword` with the name and password of you Wi-Fi.

```
country=FI
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
  scan_ssid=1
  key_mgmt=WPA-PSK
  ssid="wifiName"
  psk="wifiPassword"
}
```

Open the file `config.txt` in the root directory of the microSD card, and add the following line to the very bottom of the file and save:

```
dtoverlay=dwc2
```

Open `cmdline.txt` and add the text `modules-load=dwc2,g_ether` after the word `rootwait`, and save the file. There are no linebreaks in this file.

### Login to Pi

If your PC is in the same Wi-Fi you configured to the Pi:
  * Connect the power adapter to the port labeled "PWR" on the Pi.
  
If not,
  * Connect the micro USB cable to the port labeled "USB" on the Pi. This will not work if you connect to the port labeled "PWR.". Connect the other end of the USB cable to your PC.


Windows 

* Install [Apple Bonjour Print Services](https://support.apple.com/kb/dl999?locale=en_US)

* Install [Putty SSH client](https://www.putty.org)

  * Enter raspberrypi (if Wi-Fi) or raspberrypi.local (if usb cable) as the host name you wish to connect to in Putty, and click Open.

  * Click Ok if you get a security warning alert.

Mac

* Terminal: `ssh raspberrypi`

Enter login credentials:

* username: `pi`
* password: `raspberry`

### Change password

1. `sudo passwd pi`
2. Enter a new password
3. `su - pi`
4. The new password again

### Install Git version control system:

1. `sudo apt update`
2. `sudo apt full-upgrade`
3. `sudo apt install git`

4. `git --version`, should print something like
```
git version 2.20.1
```

### Fetch source code

`git clone https://github.com/tapz/teslapizero.git`

### Install Node.js

1. `curl -o install-node.sh https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v14.16.0.sh`
2. `sudo chmod +x install-node.sh`
3. `./install-node.sh`

4. `node -v`, should print:
```
v14.16.0
```
5. `npm -v`, should print something like:
```
7.5.4
```

### Login to Tesla API

1. `cd teslapizero`
2. `npm install --only=prod`
3. `npm run login`

### Test

1. `/opt/nodejs/bin/node /home/pi/teslapizero/index`
2. Push the doorbell button

### Make the app to start when Raspberry Pi is started

1. `crontab -e`
2. Choose `nano`
3. Add to the end of the file:
```
@reboot /opt/nodejs/bin/node /home/pi/teslapizero/index &
```
4. control-x, y and enter

### Restart Pi
`sudo reboot`

---

## **To check logs (in case the button does not work)**

Login with SSH to host name raspberrypi (or raspberrypi.local if connecting with a usb cable instead of Wi-Fi)

`tail teslapizero/teslapizero.log`

---

## **If your password changes or the login expires**

Login with SSH to host name raspberrypi (or raspberrypi.local if connecting with a usb cable instead of Wi-Fi)
1. `cd teslapizero`
2. `npm run login`

---

Copyright (c) 2021 Tapani Saarinen