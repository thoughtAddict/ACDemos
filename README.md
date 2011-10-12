
ACDemos - Application Craft Demos
===

Each application in this repository will demonstrate certain features of the Application Craft's online, cloud-based IDE.  Each app's goal is to provide a simple example of a single -- or small group of -- AC IDE features. In many of the examples I'll incorporate other libraries or projects such as jQuery, jQuery Mobile, and PhoneGap.  These apps are by no means perfect and are available for you to improve upon, learn from, and take apart.  If you find a bit of code that is incorrect, or not working for you, please let me know and I can take a look.  

Of course, if you find a better way to code something in one of the demos, please let me know. I'm *always* open to learning how to improve upon my code.

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
        * Browser-based [demo](http://acft.ws/euc) - [http://acft.ws/euc](http://acft.ws/euc)   
            - the lock/unlock slider will popup an error due to the "vibrate()" function not being availbe in a browser
        * I've included the HTML, Android APK, Symbian WGZ, WebOS IPK, and BlackBerry OTA files as well.
            - I've only tested the APK however, as I only have a DroidX
            
[Online Demo](http://acft.ws/euc)


Resources and Credits
---
  - [Application Craft](http://applicationcraft.com/)    
  - [Application Craft User Guide](http://www.applicationcraft.com/revisions/current/docs/user-guide/index.html)    
  - [PhoneGap](http://www.phonegap.com/) 
  - [jQuery](http://jquery.com/)    
  
  
  
  