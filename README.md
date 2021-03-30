# Tesla Charge Port Latch Unlock

Unlock the Tesla charge port latch by pushing a doorbell button on the wall. The doorbell push button is wired to a Raspberry Pi Zero W, which has some JavaScript code to send a request to the Tesla API in the cloud.

This video shows how it works:

[![Video](https://img.youtube.com/vi/gBsD3nAcb6g/maxresdefault.jpg)](https://www.youtube.com/watch?v=gBsD3nAcb6g)

![Setup](https://ik.imagekit.io/ym7mmsjf12q/Tesla_button/IMG_9020_yqGA1LgZ_.jpeg)

![Raspberry Pi Zero W](https://ik.imagekit.io/ym7mmsjf12q/Tesla_button/IMG_8987_j3jfry_zQ_d7j.jpeg)

**Note: the Windows specific steps have not been tested!**

---
## **HARDWARE**

You need the following hardware components and equipments. The links are examples where you can buy the parts. You may find similar products elsewhere for lower price.

* [Raspberry Pi Zero W with headers](https://www.partco.fi/en/raspberry-pi/raspberry-pi/20722-rpi-zero-wh.html)
* [Raspberry Pi Zero case](https://shop.vadelmapii.com/tuote/raspberry-pi-zero-kotelo/)
* [PIN header connectors](https://www.partco.fi/en/liittimet/piikkirima-liittimet/johtoliittimet-piikkirimaan/15756-harwin-1x1.html)
* [Singlecore wire](https://www.partco.fi/en/kaapelitjohdot/yksisaeikeiset-kytkentaejohdot/14316-kaa-kj-1x06-pun.html) (1m)

* [Micro-USB cable](https://www.partco.fi/en/computer/buses/usb/usb-cables/19508-dk-usb-vj17-1mku.html?search_query=micro-usb&results=790)

* [USB charger](https://www.partco.fi/en/power-supplies/usb-chargers/21300-wchau484abk.html) (min 2.5A/13W)

* [Honeywell Home D680 QUADRA](https://www.elektroshopwagner.de/product_info.php/info/p244646_Honeywell-Home-D680-QUADRA-Taster-62x62x13-mm--elfenbein.html) (low voltage 1-24V doorbell push)

* [MicroSD memory card](https://www.partco.fi/en/memory-cards/21591-gr-sd-16gb-ua1.html?search_query=micro+sd&results=583) (min 16GB, class 10)

* USB MicroSD memory card reader

### Connect wires

![Doorbell button](https://ik.imagekit.io/ym7mmsjf12q/Tesla_button/IMG_9004_EK1uxsX_P.jpeg)

![Pins](https://ik.imagekit.io/ym7mmsjf12q/Tesla_button/IMG_9010_x8ENCGOEMLyI.jpeg)

![Connected button](https://ik.imagekit.io/ym7mmsjf12q/Tesla_button/IMG_9012_axd-B9zRvCQT.jpeg)

![Heat shrinking tubes](https://ik.imagekit.io/ym7mmsjf12q/Tesla_button/IMG_9013_pGUoyt4tL.jpeg)

Connect wires from the doorbell push connectors to Pi `GPIO 8` (pin 24) and `GROUND` (pin 20). See [Raspberry Pi Pinout](https://pinout.xyz/pinout/pin24_gpio8). If the pin header connectors are too bulky, just leave the black plastic part out, bend the metal part and cover it with a heat shrinking tube.

---

## **SOFTWARE**

Connect the memory card to your PC.

### Install operating system

Install and start [Raspberry Pi Imager](https://www.raspberrypi.org/software/)

Make the following selections:

```
Operating System: 
  Raspberry Pi (other)
    Raspberry Pi OS Lite (32-bit)

Storage:
  Memory card

Write
```

### Enable Secure Shell (SSH) login

Remove and reinsert the memory card to the reader.

Windows

1. Open *Notepad*
2. Save an empty file to the memory card (a drive called `boot`). Name the file as "ssh" (including the quotes to prevent Notepad from adding the .txt extension).

Mac

1. Open *Terminal*
2. `touch /Volumes/boot/ssh`

### Setup Wi-Fi

Create a text file named `"wpa_supplicant.conf"` to the memory card with the following content. Replace `wifiName` and `wifiPassword` with the name and password of you Wi-Fi. Mac: `nano /Volumnes/boot/wpa_supplicant.conf`.

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

Open the file `config.txt` in the memory card, and add the following line to the very bottom of the file and save:

```
dtoverlay=dwc2
```

Open `cmdline.txt` and add the text `modules-load=dwc2,g_ether` after the word `rootwait`, and save the file. There are no linebreaks in this file.


```
console=serial0,115200 console=tty1 root=PARTUUID=e8af6eb2-02 rootfstype=ext4 elevator=deadline fsck.repair=yes rootwait modules-load=dwc2,g_ether quiet init=/usr/lib/raspi-config/init_resize.sh
```

### Login to Pi

1. Eject the card from your PC and insert it to the Pi.
2. Connect the power adapter to the port labeled `PWR IN` on the Pi.
3. Wait about 90 seconds until the green led in Pi stops flashing and stays solid green.
4. Mac: Open *Terminal* app. Windows: Press `Windows+X` and click `Command Prompt (Admin)`
5. `arp -na`
6. Find a line with address `b8:27:eb`. Something like this:

```
? (192.168.1.230) at b8:27:eb:14:69:78 on en0 ifscope [ethernet]
```

1. Copy the IP address (it probably is something else than 192.168.1.230)

Windows 

* Install [Putty SSH client](https://www.putty.org)

  * Enter `raspberrypi 192.168.1.230` as the host name you wish to connect to in Putty, and click Open.

  * Click Ok if you get a security warning alert.

Mac

* Terminal: `ssh pi@192.168.1.230`
* Answer `yes` to the following question, if you see one

```
The authenticity of host '192.168.1.230 (192.168.1.230)' can't be established.
ECDSA key fingerprint is SHA256:Y6j2MbiAsPFb1Tvg2ilUbcokq4Y3Cd23IoeGYRn+W1o.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
```

Enter password `raspberry`:

```
pi@192.168.1.230's password: raspberry
```

### Change password

1. `sudo passwd pi`
2. Enter a new password
3. `su - pi`
4. The new password again

### Install Git version control system:

1. `sudo apt update`
2. `sudo apt full-upgrade`
3. Answer `Y` if you see this question:

```
After this operation, 7,435 kB of additional disk space will be used.
Do you want to continue? [Y/n] Y
```

4. Wait for several minutes...
5. `sudo apt install git`

6. `git --version`, should print something like
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
5. `npm install -g npm@latest`
6. `npm -v`, should print something like:
```
7.7.4
```

### Login to Tesla API

1. `cd teslapizero`
2. `npm install --only=prod`
3. `npm rebuild`
4. `npm run login`
5. Enter your Tesla e-mail, password and MFA code
6. Select your vehicle (VIN code and name displayed)

### Test

1. `node index`
2. Push the doorbell button
3. Control-C to exit
   
### Install PM2 process manager to start the app when Raspberry Pi is started

1. `sudo npm install pm2 -g`
2. `nano ~/.profile`
3. Add this as the last line of the file:

```   
PATH="/opt/nodejs/lib/node_modules/pm2/bin:$PATH"
```

4. Save file: Control-X, y
5. `source ~/.profile`
6. `pm2 start index.js --name teslapizero`
7. `pm2 startup systemd`
8. Copy-paste and run the printed line. It should be like this:

```
sudo env PATH=$PATH:/opt/nodejs/bin /opt/nodejs/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
```

9.  `pm2 save`
10. `pm2 list`, should print:
```
┌─────┬────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name           │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ teslapizero    │ default     │ 0.0.1   │ fork    │ 735      │ 7m     │ 0    │ online    │ 0%       │ 40.1mb   │ pi       │ disabled │
└─────┴────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

### Restart Pi
`sudo reboot`

---

## **Check logs (in case the button does not work)**

Login with SSH to the Pi

`tail -1000 teslapizero/teslapizero.log`

and for unhandled errors:

`pm2 logs --lines 1000`

---

## **If your password changes or the login expires**

Login with SSH to the Pi

1. `cd teslapizero`
2. `npm run login`

---

## **Update to the most recent version**

Login with SSH to the Pi

1. `cd teslapizero`
2. `git pull`
3. `npm update`
4. `npm rebuild`
5. `pm2 restart teslapizero`

---

Copyright (c) 2021 Tapani Saarinen