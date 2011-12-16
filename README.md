
ACDemos - Application Craft Demos
===

Each application in this repository will demonstrate certain features of the Application Craft's online, cloud-based IDE.  Each app's goal is to provide a simple example of a single -- or small group of -- AC IDE features. In many of the examples I'll incorporate other libraries or projects such as jQuery, jQuery Mobile, and PhoneGap.  These apps are by no means perfect and are available for you to improve upon, learn from, and take apart.  If you find a bit of code that is incorrect, or not working for you, please let me know and I can take a look.  

Of course, if you find a better way to code something in one of the demos, please let me know. I'm *always* open to learning how to improve upon my code.


### GPSLocation:  Demo of how the AC IDE can use Phonegap "Geolocation" API calls.

    Examples of-

        AC IDE:
            onClick()
            setValue()
            
        PhoneGap:
            navigator.geolocation.getCurrentPosition()
            navigator.geolocation.watchPosition()
            navigator.geolocation.clearWatch()
            
        Javascript:
            setInterval()
            clearInterval()
            
    Notes-
    
        * Keep in mind that this has been designed on an Android DroidX, with a screen resolution of 320x544 
            - (Android version 2.3.3)
        * It was also designed to be in Portrait mode, but can work fine in Landscape.      
        * On my DroidX, the "Accuracy" ranged from values of 900 to 2500 meters.  Ouch.
            
[Online Demo](http://acft.ws/dta)


### GoogleMapsV2 (#1): Distance between two Lat/Long coordinates

    Examples of-

        Google Maps API (Version 2):
            google.maps.LatLng()
            
        AC IDE:
            onAppStarted()
            getValue()
            getProperty()
            setProperty()
            Event onClick()
            HttpRequest to Google API, returning JSON
            
    Notes-
    
        * Keep in mind that this has been designed on an Android DroidX, with a screen resolution of 320x544 
            - (Android version 2.3.3)
        * It was also designed to be in Portrait mode, but can work fine in Landscape.      
            
[Online Demo](http://acft.ws/avpr)


### GoogleMapsV2 (#2): Various, basic, Google Maps API (Version 2) functions

    Examples of-

        Google Maps API (Version 2):
            GLatLng()
            GPolyline()
            Example of "overlay"
            Custom Google Map "marker" icon
            
        AC IDE:
            setProperty()
            Event onClick()
            
    Notes-
    
        * Keep in mind that this has been designed on an Android DroidX, with a screen resolution of 320x544 
            - (Android version 2.3.3)
        * It was also designed to be in Portrait mode, but can work fine in Landscape.      
            
[Online Demo](http://acft.ws/xhh)


### I18N (MultiLang1): Very basic language detection.  Change onscreen labels accordingly

    Examples of-

        "Navigator" Object:
            navigator.language
            navigator.browserLanguage
            navigator.systemLanguage
            navigator.userLanguage

        AC IDE:
            onAppStarted()
            setProperty()
            
    Notes-
    
        * Keep in mind that this has been designed on an Android DroidX, with a screen resolution of 320x544 
            - (Android version 2.3.3)
        * It was also designed to be in Portrait mode, but can work fine in Landscape.      
        * While this doesn't show that much in the way of AC functionality, I wanted to include it to show use of 
        Navigator within the IDE.
            
[Online Demo](http://acft.ws/xfy)


### ImageFromCameraOrGallery:  Demo of how the AC IDE can use Phonegap "Camera" API calls.

    Examples of-

        AC IDE:
            onClick()
            setValue()
            
        PhoneGap:
            navigator.camera.PictureSourceType
            navigator.camera.DestinationType
            navigator.camera.getPicture()            
            
    Notes-
    
        * Keep in mind that this has been designed on an Android DroidX, with a screen resolution of 320x544 
            - (Android version 2.3.3)
        * It was also designed to be in Portrait mode, but can work fine in Landscape.      
        * On my DroidX, when attempting to take a picture and capture an image, it would restart my app.
            - I'll look further into this and update this repo        
            
[Online Demo](http://acft.ws/dtq)  (Keep in mind that this app is for a mobile device.)


### RSSFeeder:  Quick example of how an AC app can consume a RSS Feed and display the data in a three-panel Accordion.

    Examples of-

        AC IDE:
        	populateWidget()
            onAppStarted()
            HttpRequest to CNN RSS News Feeds, returning XML
            
    Notes-
    
        * Keep in mind that this has been designed on an Android DroidX, with a screen resolution of 320x544 
            - (Android version 2.3.3)
        * It was also designed to be in Portrait mode, but can work fine in Landscape.      
            
[Online Demo](http://acft.ws/vbt)


### WidgetTest1: 

    Examples of-

        jQuery:
            fadeOut()
            fadeIn()
            animate()
            animation easing ('in' and 'out', 32 possible values for each)

        AC IDE:
            onAppStarted()
            getValue()
            setValue()
            getProperty()
            setProperty()
            WYSIWYG Editor (for short paragraph of instructions)
            dynamically changing the image of an ImgWidget
            isNativeApp()
            
        PhoneGap:
            Notification Vibrate(milliseconds)
            
        Javascript:
            Math.random() 
            Math.floor()
            
    Notes-
    
        * Keep in mind that this has been designed on an Android DroidX, with a screen resolution of 320x544 
            - (Android version 2.3.3)
        * It was also designed to be in Portrait mode, but can work fine in Landscape.      
        * Eventually, I'll incorporate the lock/unlock slider in another WidgetTest
            - which tests the AC IDE's "Adaptive Layout" functionality
        * Comments are at the beginning of each Javascript function
        * I've included the HTML, Android APK, Symbian WGZ, WebOS IPK, and BlackBerry OTA files as well.
            - I've only tested the APK however, as I only have a DroidX
            
[Online Demo](http://acft.ws/euc)


Resources and Credits
---
  - [Application Craft](http://applicationcraft.com/)    
  - [Application Craft User Guide](http://www.applicationcraft.com/revisions/current/docs/user-guide/index.html)    
  - [PhoneGap](http://www.phonegap.com/) 
  - [jQuery](http://jquery.com/)    
  
  
  
  