# DLC32UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.2.

# Purpose

To provide an alternative UI for my MKS-DLC32 based on Angular material

#Functions

For daily use it contains all the controls you would find in the other UI-s
- Jogging and homing (HARD and SOFT based on Grbl settings)
- File actions on storages (SPIFFS and SD)
- Engraving status
- A terminal to issue commands towards the firmware and monitor messages

#Under construction
- Better error handling

#Releases

- The compiled UI is integrated into the custom firmware I made at https://github.com/iherbak/MKS-DLC32-FIRMWARE

#Compilation

- npm install
- Build with ng build
- use https://github.com/iherbak/DLC32-UIEmbedder to integrate the files into the index.html and generate an uploadable index.html.gz
- Upload the index.html.gz to the device's internal flash/SPIFFS

#Upload

- The compiled UI is integrated into the custom firmware I made at https://github.com/iherbak/MKS-DLC32-FIRMWARE so upload the firmware instead

#Screenshot

<img src="/readme/screenshot.jpg">