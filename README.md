# Cordova Sync

Respond to file changes and build Cordova application

## Installation

`npm install cordova-sync -g`

## Setup

**Web Project**

Must specify a `csync` script inside of package.json

`npm run csync`

cordova-sync expects that this script will compile any source code from the *./src* directory into the *./dist* directory

**Cordova Project**

## Dependencies

`xcode-select --install`

## Usage

`cordova-sync [path_to_app] [options]`

[path_to_app]             The relative path to the Cordova Project

## Options

-w, --watch               If present the package will watch *src* directory and rebuild on file change
-s, --src [path_to_src]   The relative path to the source code in your *web* directory (default: src)
-d, --dist [path_to_dist] The relative path to the distribution code in your *web* directory (default: dist)
-p, --physical            Build the app onto a physical device

##Notes

- XCode Command line tools are required in order to build the script
- When building to a physical device the Provisioning Profile must be set in XCode before the app can build
- iOS Platform Version 4.3.1 is required to build onto the physical device
