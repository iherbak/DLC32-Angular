# DLC32UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.2.

# Purpose

To provide an alternative UI for my modded MKS-DLC32 UI https://github.com/iherbak/MKS-DLC32-FIRMWARE

#Functions

For daily use it contains all the controls you would find in the other UI-s
- Jogging and homing
- File actions
- Engraving status
- a terminal to issue commands towards the firmware

#Under construction
- Better error handling

#Compilation

- npm install
- Build with ng build
- use https://github.com/iherbak/DLC32-UIEmbedder to integrate the files into the index.html and generate an uploadable index.html.gz
- Upload the index.html.gz to the device's internal flash/SPIFF

#Releases

- you can use one of the precompiled releases for upload

#Upload

- IMPORTATNT - Create a backup of the current version of your index.html.gz by downloading it. (click on it)

- Find the option to update web UI and upload the index.html.gz overwriting the default one. (see image)

![Alt text](/readme/upload.jpg,'Upload')