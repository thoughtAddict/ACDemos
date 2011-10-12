/**
 * @lends       WiziCore_Api_Config#
 */
var WiziCore_Api_Config = jQuery.Class.create({

    _currentApiAdapter : "Web",
    _needFlashVersion : "9.0.0",
    _clientApi : "http://thoughtaddict.applicationcraft.com/",
    _serverUrl : "http://thoughtaddict.applicationcraft.com/service/",
    _serverUploadUrl : "http://thoughtaddict.applicationcraft.com/service/",
    _uploadServerPath: "http://thoughtaddict.applicationcraft.com/uploads/",
    _formatApi : "json",
    _serverThemes: "themes/",
    _flashAdapterUrl : "wiziCore/api/server/adapter/WiziSendRequest.swf",
    _isDebugRequest : false,
    _facebookId : '1bdf8f6b982dc92691f9eb12fa97f713',
    _facebookAppName : 'swirl_dev',
    _googleApiKey: {
        "rows":[
            {
                "id":1,
                "data":["http://applicationcraft.com/","ABQIAAAACfMroKb5WzfdVTHbQi2OfRRGQFuqEDC-bwWLPZ60Ces-G56XXhTiOZYFBXlh0_EId2nXJCwq7iTNIg"],
                "ind":1
            }
        ]
    },
    
    /**
     * Description of constructor
     * @class       Some words about config class
     * @author      Dmitry Souchkov
     * @version     0.1
     * @constructs
     */
	init: function(){

	},

    uploadServerPath: function(){
        return this._uploadServerPath;
    },

    facebookName : function() {
        return this._facebookAppName;
    },

    facebookId : function() {
        return this._facebookId;
    },

    googleApiKey : function() {
        return this._googleApiKey;
    },

    isDebugRequest : function(){
        return this._isDebugRequest;
    },

    /*
     * @return {String} current api adapter
     */
    apiAdapter : function(){
        return this._currentApiAdapter;
    },

    /*
     * @return {String} need flash version
     */
    needFlashVersion : function(){
        return this._needFlashVersion;
    },

    /*
     * @return {String} current server api address
     */
    serverApi : function(){
        return this._serverUrl + this.formatApi();
    },

    /*
     * @return {String} current server api address
     */
    serverUrl : function(){
        return this._serverUrl;
    },

    /*
     * @return {String} current server api address
     */
    serverThemeUrl : function(){
        return this._serverUrl + this._serverThemes;
    },

    /*
     * @return {String} server URL
     */
    serverUploadUrl : function(){
        return this._serverUploadUrl;
    },
    /*
     * @return {String} current client api address
     */
    clientApi : function(){
        return this._clientApi;
    },

    /*
     * @return {String} current api data format
     */
    formatApi : function(){
        return this._formatApi;
    },

    /*
     * @return {String} flash adapter url
     */
    flashAdapterUrl : function(){
        return this.clientApi() + "/" + this._flashAdapterUrl;
    },

    themes : function(){
        var self = this;
        var ret = {
            app : { "":
                {
                    name: "Default",
                    id_theme : "_default",
                    imgPath: self.clientApi() + "/themes/app/_default/images",
                    css_path: self.clientApi() + "/themes/app/_default/theme.css",
                    draft_css_path: self.clientApi() + "/themes/app/_default/theme_draft.css"
                }
            },

            form : {
                "1" : {
                    name: "Default",
                    id_theme : "_default",
                    imgPath: self.clientApi() + "/themes/form/_default/images",
                    css_path: self.clientApi() + "/themes/form/_default/theme.css",
                    draft_css_path: self.clientApi() + "/themes/form/_default/theme_draft.css"
                }
            }
        };
        return ret;
    }

});
