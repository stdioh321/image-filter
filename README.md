# Image Filters

#### [Demo Page](https://image-filters.netlify.com/)

## Run locally
```
$ git clone https://github.com/stdioh321/image-filter.git
$ cd image-filters
$ cd client
$ npm install
$ ng serve
```
## Browser
http://localhost:4200

### Requirements
1. [Node/NPM](https://nodejs.org/en/)
2. [Angular CLI](https://cli.angular.io/)

# Build Android APK(Cordova)
```
$ cd cordova
$ cd Image-Filters
$ npm install
$ cordova prepare
$ cordova platform add android
```
 Plug your android device on the computer with debug mode enabled
```
$ cordova run android
```
This last command will generate and install the apk on the device.
The apk file will be located on the path:

```
image-filter/cordova/Image-Filters/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```
### Requirements
1. [Node/NPM](https://nodejs.org/en/)
2. [Cordova](https://cordova.apache.org/)