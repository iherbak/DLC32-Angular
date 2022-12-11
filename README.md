# DLC32UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.2.

# Purpose

To provide an alternative UI for my MKS-DLC32 based on Angular material

#Functions

For daily use it contains all the controls you would find in the other UI-s
- Jogging and homing
- File actions
- Engraving status
- A terminal to issue commands towards the firmware

#Under construction
- Better error handling

#Releases

- you can use one of the precompiled releases for upload

#Compilation

- npm install
- Build with ng build
- use https://github.com/iherbak/DLC32-UIEmbedder to integrate the files into the index.html and generate an uploadable index.html.gz
- Upload the index.html.gz to the device's internal flash/SPIFFS

#Upload

- IMPORTANT - Create a backup of the current version of your index.html.gz by downloading it. (click on it)

- Find the option to update web UI and upload the index.html.gz overwriting the default one. (see image)

<img src="/readme/upload.jpg">

#Screenshot

<img src="/readme/screenshot.jpg">