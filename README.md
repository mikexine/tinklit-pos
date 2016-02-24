Working on Android. 
Working on iOS with ionic view (no real device test available yet..).

Run `gulp add-proxy` to run this app with `ionic serve` - but the QR Code reader doesn't work in this way (cordova issues).

Run `gulp remove-proxy` and then `ionic run android` (attach your phone in debugging mode + make sure you have adb & co) -> it takes more time than just reloading a page with `ionic serve` but the QR code reader works.  

Test apk: [click here.](release/tinkl.apk) Also on dropbox: https://www.dropbox.com/s/ayi4pzgm58tyv6t/tinkl.apk?dl=0

Please note: this app is not production-ready, and is not running on tinkl.it but on staging.tinkl.it!