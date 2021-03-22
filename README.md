# Tesla Charge Port Latch Opener
Open Tesla charge port latch

HARDWARE

Raspberry Pi Zero W (with headers)
https://www.partco.fi/fi/raspberry-pi/raspberry-pi/20722-rpi-zero-wh.html
https://www.partco.fi/fi/liittimet/piikkirima-liittimet/johtoliittimet-piikkirimaan/15756-harwin-1x1.html
https://www.partco.fi/fi/kaapelitjohdot/yksisaeikeiset-kytkentaejohdot/14316-kaa-kj-1x06-pun.html

Micro-USB cable
https://www.tokmanni.fi/datakaapeli-micro-usb-6430035340453

USB charger, min 2.5A/13W
https://www.ikea.com/fi/fi/p/koppla-3-paikkainen-usb-laturi-valkoinen-20415027/

Honeywell Home D680 QUADRA
https://www.elektroshopwagner.de/product_info.php/info/p244646_Honeywell-Home-D680-QUADRA-Taster-62x62x13-mm--elfenbein.html

https://www.eibabo.fi/novar/oven-soittopainikkeen-pinta-asennettu-d680-eb11217131?utm_source=Portals&utm_medium=CPC&utm_campaign=eibabo-FI_GoogleShopping_FI&gclid=Cj0KCQjw3duCBhCAARIsAJeFyPVZOW8W3tiAs_S1PXUYN8XTvOs-iKsRVvQ3UUpzE-c94UZnQMcxss4aAlXpEALw_wcB

https://verkkokauppa.huhta.fi/7003562

Micro-SD memory card, min 16GB (class 10)

https://www.multitronic.fi/en/products/2307246/sandisk-high-endurance-32gb-microsdhc---sd-adapter

USB Micro-SD memory card reader

SOFTWARE

Connect the memory card to your PC.

Install and start Raspberry Pi Imager
https://www.raspberrypi.org/software/

Operating System: 
Select Raspberry Pi (other)
Raspberry Pi OS Lite (32-bit) 

Storage:
Memory card

Write

Use Notepad in Windows or TextEdit in Mac. When saving files in Notepad, use quotes in the filename to prevent Notepad from adding the .txt extension.

Write an empty text file named "ssh" to the root of the directory of the memory card.

Setup Wi-Fi

Create a text file named "wpa_supplicant.conf" to the root directory of the memory card with the following content:

country=FI
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
  scan_ssid=1
  key_mgmt=WPA-PSK
  ssid="wifiName"
  psk="wifiPassword"
}

Open the file config.txt in the root directory of the micro SD card, and add the line dtoverlay=dwc2 to the very bottom of the file and save.

Open cmdline.txt and add the text modules-load=dwc2,g_ether after the word rootwait, and save the file. There are no linebreaks in this file.

If your PC is in the same Wi-Fi you configured to the Pi:
Connect the power adapter to the port labeled "PWR" on the Pi.
If not:
Connect the micro USB cable to the port labeled "USB" on the Pi. This will not work if you connect to the port labeled "PWR.". Connect the other end of the USB cable to your PC.

Login to Pi:

----

Windows 

Install Apple Bonjour Print Services
https://support.apple.com/kb/dl999?locale=en_US

Install Putty SSH client
https://www.putty.org

Enter raspberrypi (if Wi-Fi) or raspberrypi.local (if usb cable) as the host name you wish to connect to in Putty, and click Open.

Click Ok if you get a security warning alert.

----

Mac:
Terminal
ssh raspberrypi

---

username: pi
password: raspberry

Change password:

sudo passwd pi
su - pi
(password again)

Install Git version control system:

sudo apt update
sudo apt full-upgrade

sudo apt install git

Verify:
git --version
>git version 2.20.1

Fetch the source code

git clone https://github.com/tapz/teslapizero.git

Install Node.js

curl -o install-node.sh https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v14.16.0.sh
sudo chmod +x install-node.sh
./install-node.sh

Verify:
node -v
>v14.16.0
npm -v
>7.5.4

Login to Tesla API

cd teslapizero
npm install
npm run login

Test

/opt/nodejs/bin/node /home/pi/teslapizero/index
Click the button

Make the app to start when Raspberry Pi is started

crontab -e
Choose nano
Add to the end of the file:
@reboot /opt/nodejs/bin/node /home/pi/teslapizero/index &
control-x, y and enter

Restart Pi
sudo reboot

All done

To check logs (in case the button does not work):



If your password changes or the login expires:

Login with SSH to host name raspberrypi (or raspberrypi.local if connecting with a usb cable instead of Wi-Fi)
cd teslapizero
npm run login

Copyright (c) 2021 Tapani Saarinen