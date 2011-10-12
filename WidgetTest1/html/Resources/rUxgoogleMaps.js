/**
 * @lends       WiziCore_UI_GoogleMapsWidget#
 */
var WiziCore_UI_GoogleMapsWidget = WiziCore_Widget_Base.extend({
    triggerObject : {},
    _widgetClass : "WiziCore_UI_GoogleMapsWidget", //widget Class name
    _dataPropName : "latlong", //the method name, which is responsible for working with data
    _gMapDiv: null,//jQuery object
    _gMap: null,
    _mapCanIniting: null,
    _marker: null,
    _onClick: null,
    _loaded: false,

    /**
     * Description of constructor
     * @class  Some words about label widget class
     * @author      Dmitry Souchkov, Yuri Podoplelov
     * @version     0.2
     * @augments    WiziCore_UI_BaseWidget
     * @constructs
     */
    init: function() {
        this._super.apply(this, arguments);
    },

    /**
     * Building widget function
     */
    draw : function() {
        var self = this;
        if (typeof GMap2 != "function") {
            $(this.triggerObject).one(WiziCore_UI_GoogleMapsWidget.onApiLoaded, function(ev, data) {
                if (self._mapCanIniting !== null){
                    self.apiInited();
                }
                self._loaded = true;
                ev.stopPropagation();
            });
        }
        else {
            self._loaded = true;
        }
        var div = $("<div>");
        var tuid = "gmaps_" + this.htmlId();
        div.attr("id", tuid);
        div.css({width: "100%", height: "100%"});
        this.base().prepend(div);
        this._gMapDiv = div;
        this._super.apply(this, arguments);
    },

    onPageDrawn: function() {
        this._mapCanIniting = false;
        if (typeof GMap2 == "function") {
            this.apiInited();
        }
        this._super.apply(this, arguments);
    },

    _updateLayout: function(){
        this._super();
        this._gMapDiv.css({'min-width': this.width() + 'px', 'min-height' :this.height() + 'px'});
        if (this._gMap != null) {
            this._gMap.checkResize();
        }

        this.checkResize();
    },

    relativeResize: function() {
        this._super.apply(this);
        if (this._gMap != null) {
            this._gMap.checkResize();
        }

    },

    earlyLoad: function(callback) {
        if (!this._loaded) {
            var self = this;
            window.setTimeout(function(){self.earlyLoad(callback)}, 100);
            return;
        }
        if (callback) {
            callback();
        }
    },

    initProps: function() {
        this._super();
        this.shadow = this.themeProperty('shadow', this._shadow);
        this.border = this.themeProperty('border', this._border);
        this.bg = this.themeProperty('bgColor', this._bg);

        this.opacity = this.htmlProperty('opacity', this._opacity);
        //this.tabindex = this.htmlProperty('tabindex', this._tabindex);

        this.showMarker = this.normalProperty('showMarker', this.initMarker);
        this.googleBar = this.htmlProperty('googleBar', this._googleBar);
        this.googleKey = this.htmlProperty('googleKey', this._googleKey);
        this.aspectResize = this.htmlProperty('aspectResize', this._updateLayout);
    },

    initDomState : function () {
        this._super();
        this.initDomStatePos();
        this._googleKey(this.googleKey());
        this._googleBar(this.googleBar());
        this.initMarker();

        this._bg(this.bg());
        this._border(this.border());
        this._shadow(this.shadow());

        this._updateEnable();
        this._visible(this.visible());
        this._opacity(this.opacity());
        //this._tabindex(this.tabindex());

    },

    initGMaps: function(apiKey) {
        this.clearMap();
        if (typeof GMap2 != "function") {
            jQuery.getScript("http://maps.google.com/maps?file=api&v=2&sensor=true&async=2&key=" + apiKey + "&callback=gMapWidgetApiLoaded");
        }
    },

    apiInited: function() {
        this._mapCanIniting = true;
        acDebugger.systemLog("apiInited for ", this.widgetId());
        this.createGMap(this.zoomLevel());
    },

    clearMap: function() {
        if (typeof GMap2 == "function" && typeof GEvent == "object") {
            if (this._onClick != null) {
                GEvent.removeListener(this._onClick);
                delete this._onClick;
                this._onClick = null;
            }
        }
        if (typeof GUnload == "function") {
            //GUnload();
        }
        delete this._gMap;
        this._gMap = null;
    },

    createGMap: function(zoomLevel) {
        if (this._mapCanIniting === true) {
            //this._gMap = null;
            var map = this._gMap;
            var self = this;
            var tuid = this._gMapDiv.attr("id");
            if (GBrowserIsCompatible()) {
                if (zoomLevel == undefined){
                    if (map && typeof map['getZoom'] == "function"){
                        zoomLevel = map.getZoom();
                    } else {
                        zoomLevel = this.zoomLevel();
                    }
                }
                var mapType = undefined;
                if (map && typeof map['getCurrentMapType'] == "function"){
                    mapType = map.getCurrentMapType();
                }
                delete this._gMap;

                this._gMapDiv.empty();
                map = new GMap2(document.getElementById(tuid));
                this._gMap = map;

                mapType = (mapType == undefined) ? map.getCurrentMapType() : mapType;
                map.setMapType(mapType);

                map.setCenter(new GLatLng(this.latitude(), this.longitude(), false), zoomLevel);
                map.setUIToDefault();
                (this.googleBar()) ? map.enableGoogleBar() : map.disableGoogleBar();
                if (this._onClick != null) {
                    GEvent.removeListener(this._onClick);
                }
                this._onClick = GEvent.bind(map, "click", this, function(overlay, latlng) {
                    self.onClick(overlay, latlng);
                });
                this._gMap = map;
                this.initMarker();
            }
            this._gMapDiv.css("z-index", "");
            this._updateEnable();
        }
    },

    onClick: function(overlay, latlng) {
        if (this._gMap != null) {
            if (latlng) {
                var myHtml = "The GPoint value is: " + this._gMap.fromLatLngToDivPixel(latlng) + " at zoom level " + this._gMap.getZoom();
            }
            //alert(myHtml);
            var triggerEvent = new jQuery.Event(WiziCore_Widget_Base.onClick);
            $(this.object()).trigger(triggerEvent, [overlay, latlng]);
        }
    },
    remove: function() {
        this.clearMap();
        $(this.triggerObject).unbind(WiziCore_UI_GoogleMapsWidget.onApiLoaded);
        this._super();
    },

    destroy: function() {
        this._super();
    },

    _enable: function(flag){
        if (this._gMap != null){
            this.showEnableDiv(flag);
        } else if (this._gMapDiv != null) {
            (flag === false) ? this._gMapDiv.addClass('ui-state-disabled') : this._gMapDiv.removeClass('ui-state-disabled');
        }
    },

    _googleBar: function(val) {
        if (this._gMap != null) {
            if (val) {
                this._gMap.enableGoogleBar();
            } else {
                this._gMap.disableGoogleBar();
            }
        }
    },

    getDomain : function(url){
        if (typeof url != "string")
            return url;

        var startPos = url.indexOf("//");
        if (startPos == -1)
            startPos = 0;

        var endPos = url.indexOf("/", startPos + 2);
        if (endPos == -1)
            endPos = url.length;

        return url.substring(startPos + 2, endPos);
    },

    _googleKey: function(val) {
        if (val != undefined) {
            var self = this;
            var apiKey = null;
            var pathname = this.getCurrentPathName().toLowerCase();
            var locDomain = this.getDomain(pathname);
            if (locDomain == '' || locDomain == 'localhost') {
                apiKey = '';
            }
            else if (val.rows != undefined) {
                //get data from prefill dialog
                for (var i =0, l= val.rows.length; i < l; i++) {
                    var loc = val.rows[i].data[0].toLowerCase();
                    var loc = this.getDomain(loc);
                    if (pathname.indexOf(loc) >= 0) {
                        apiKey = val.rows[i].data[1];
                        break;
                    }
                }
            }

            if (apiKey === null) {
                //try to find in config
                try {
                    var wfApp = WiziCore_AppContext.getInstance();
                    if (wfApp != undefined) {

                        var key = wfApp.config().googleApiKey();
                        for (var i = 0, l = key.rows.length; i < l; i++) {
                            var loc = key.rows[i].data[0].toLowerCase();
                            var loc = this.getDomain(loc);
                            if (pathname.indexOf(loc) >= 0) {
                                apiKey = key.rows[i].data[1];
                                break;
                            }
                        }
                    }
                } catch(e) {
                }

            }

            if (apiKey !== null) {
//                apiKey = (apiKey == 'none')? '': apiKey;
                self.initGMaps(apiKey);
            } else {
                var noApiDiv = $("<div style='font: 14px normal; text-align: center; width : 100%; height:100%; background-color: #808080; color: white; display: table-caption;' ></div>")
                        .append("<span lang='lang-swirl_widget_gmap_noapikey'/><span><b>'"+ pathname +"'</b></span><br>")
                        .append("<span lang='lang-swirl_widget_gmap_edit_gapikeyprop'/>");

                self._gMap = null;
                self._gMapDiv.empty().append(noApiDiv);
            }
        }
    },

    googleMap: function(){
        return this._gMap;
    },

    getCurrentPathName : function() {
        return window.location.hostname;
    },

    latitude: function(val) {
        if (val != undefined) {
            val = (val > 90) ? val % 90 : val;
            val = (val < -90) ? val % -90 : val;
            this._project['latitude'] = val;
            var obj = {"latitude": this._project['latitude']};
            this.sendExecutor(obj);
            if (this._isDrawn) {
                this.createGMap();
            }
        }
        return this._project['latitude'];
    },

    longitude: function(val) {
        if (val != undefined) {
            val = (val > 180) ? val % 180 : val;
            val = (val < -180) ? val % -180 : val;
            this._project['longitude'] = val;
            var obj = {"longitude": this._project['longitude']};
            this.sendExecutor(obj);
            if (this._isDrawn) {
                this.createGMap();
            }
        }
        return this._project['longitude'];
    },

    initMarker: function() {
        if (this._gMap !== null) {
            //create marker, if not init
            var latlng = new GLatLng(this.latitude(), this.longitude());
            if (this._marker !== null) {
                this._gMap.removeOverlay(this._marker);
            }
            this._marker = new GMarker(latlng);
            this._gMap.addOverlay(this._marker);
        }

        if (this._marker !== null) {
            if (this.showMarker() == true) {
                this._marker.show()
            } else {
                this._marker.hide()
            }
        }
    },

    zoomLevel: function(val) {
        if (val != undefined) {
            this._project['zoomLevel'] = Math.round(val);
            var obj = {"zoomLevel": this._project['zoomLevel']};
            this.sendExecutor(obj);
            if (this._isDrawn && this._gMap != null) {
                this._gMap.setZoom(this._project['zoomLevel']);
            }
        }
        return this._project['zoomLevel'];
    },

    latlong: function(val) {
        if (val != undefined) {
            ret = [this.latitude(val[0]), this.longitude(val[1])];
        } else {
            var ret = [this.latitude(), this.longitude()];
        }
        return ret;
    },

    getDataModel: function() {
        return [
            {name: "swirl_widget_gmap_latitude", value: "", uid: "latuid"},
            {name: "swirl_widget_gmap_longitude", value: "", uid: "longuid"}
        ];
    }
});

var gMapWidgetApiLoaded = function() {
    $(WiziCore_UI_GoogleMapsWidget.prototype.triggerObject).trigger(WiziCore_UI_GoogleMapsWidget.onApiLoaded);
};

WiziCore_UI_GoogleMapsWidget.onApiLoaded = "Event#WiziCore_UI_GoogleMapsWidget#onApiLoaded";

WiziCore_UI_GoogleMapsWidget._props = [
    { name: WiziCore_PropertyGroups.group_names.general, props:[
        WiziCore_PropertyGroups.general.widgetClass,
        WiziCore_PropertyGroups.general.name,
        {name: "googleKey", type : "gmapkeysdata", get: "googleKey", set: "googleKey", alias : "swirl_widget_gmap_googlekey"},
        {name: "googleBar", type : "boolean", get: "googleBar", set: "googleBar", alias : "swirl_widget_gmap_googlebar"},
        {name: "latitude", type : "gmlatitude", get: "latitude", set: "latitude", alias : "swirl_widget_gmap_latitude"},
        {name: "longitude", type : "gmlongitude", get: "longitude", set: "longitude", alias : "swirl_widget_gmap_longitude"},
        {name: "showMarker", type : "boolean", get: "showMarker", set: "showMarker", alias : "swirl_widget_gmap_showmarker"},
        {name: "zoomLevel", type : "gmzoomlevel", get: "zoomLevel", set: "zoomLevel", alias : "swirl_widget_gmap_zoomlevel"}
    ]},
    { name: WiziCore_PropertyGroups.group_names.layout, props:[
        WiziCore_PropertyGroups.layout.aspectResize,
        WiziCore_PropertyGroups.layout.x,
        WiziCore_PropertyGroups.layout.y,
        WiziCore_PropertyGroups.layout.pWidth,
        WiziCore_PropertyGroups.layout.width,
        WiziCore_PropertyGroups.layout.height,
        WiziCore_PropertyGroups.layout.repeat,
        WiziCore_PropertyGroups.layout.zindex,
        WiziCore_PropertyGroups.layout.anchors,
        WiziCore_PropertyGroups.layout.alignInContainer
    ]},
    { name: WiziCore_PropertyGroups.group_names.behavior, props:[
        WiziCore_PropertyGroups.behavior.dragAndDrop,
        WiziCore_PropertyGroups.behavior.resizing,
        WiziCore_PropertyGroups.behavior.visible,
        WiziCore_PropertyGroups.behavior.enable
    ]},
    { name: WiziCore_PropertyGroups.group_names.data, props:[
        WiziCore_PropertyGroups.data.view,
        WiziCore_PropertyGroups.data.fields,
        WiziCore_PropertyGroups.data.groupby,
        WiziCore_PropertyGroups.data.orderby,
        WiziCore_PropertyGroups.data.filter,
        WiziCore_PropertyGroups.data.onview,
        WiziCore_PropertyGroups.data.applyview,
        WiziCore_PropertyGroups.data.listenview,
        WiziCore_PropertyGroups.data.resetfilter,
        WiziCore_PropertyGroups.data.autoLoad
    ]},
    { name: WiziCore_PropertyGroups.group_names.style, props:[
        WiziCore_PropertyGroups.behavior.opacity,
        WiziCore_PropertyGroups.style.border,
        WiziCore_PropertyGroups.style.shadow,
        WiziCore_PropertyGroups.style.margin,
        WiziCore_PropertyGroups.style.bgColor,
        WiziCore_PropertyGroups.style.widgetStyle
    ]}
];
/**
 * Return available widget prop
 * @return {Object} available property
 */
WiziCore_UI_GoogleMapsWidget.props = function() {
    return WiziCore_UI_GoogleMapsWidget._props;
};

/**
 * Return empty widget prop
 * @return {Object} default properties
 */
WiziCore_UI_GoogleMapsWidget.emptyProps = function() {
    return {};
};
/**
 * Return default widget prop
 * @return {Object} default properties
 */
WiziCore_UI_GoogleMapsWidget.inlineEditPropName = function() {
    return "latlong";
};

/**
 * Return default widget prop
 * @return {Object} default properties
 */
WiziCore_UI_GoogleMapsWidget.defaultProps = function() {
    var ret = {width: "200", height: "200", x : "100", y: "100", zindex : "auto",
        anchors : {left: true, top: true, bottom: false, right: false}, visible : true,
        opacity : 1, name: "googleMaps1", googleBar: false, latitude: "37.4419", longitude: "-122.1419",
        zoomLevel: 12, widgetStyle: "default", showMarker:false,
        googleKey : {}, enable: true,
        margin: "", alignInContainer: 'left',
        dragAndDrop: false,
        resizing: false,
        aspectResize: false
    };
    var wfApp = WiziCore_AppContext.getInstance();
    if (wfApp != undefined) {
        try {
            var key = wfApp.config().googleApiKey();
            if (key != undefined && key != null) {
                ret.googleKey = key;
            }
        } catch(e) {
        }
    }
    return ret;
};

/**
 * Return available widget actions
 * @return {Object} available actions
 */
WiziCore_UI_GoogleMapsWidget.actions = function() {
    var ret = {};
    // append base actions
    ret = jQuery.extend(WiziCore_Widget_Base.actions(), ret);
    if (ret.click != undefined){
        ret.click.params = "overlay, latlng";
    }
    return ret;
};

/* Register widget in the Designer */
WiziCore.Widgets().registerExWidget("WiziCore_UI_GoogleMapsWidget", "swirl_sections_extensible", "swirl_widget_name_gmap", "gmaps",
        "wiziCore/extWidgets/googleMaps/googleMaps.png");

/* Lang constants */
/**
 * Return available widget langs
 * @return {Object} available actions
 */
WiziCore_UI_GoogleMapsWidget.langs = function() {
    var ret = {"en" : {}};
    /* Lang constants */
    ret.en.swirl_widget_gmap_googlekey = "Google Api Key";
    ret.en.swirl_widget_name_gmap = "Google Maps";
    ret.en.swirl_widget_gmap_googlebar = "Google Bar";
    ret.en.swirl_widget_gmap_latitude = "Latitude";
    ret.en.swirl_widget_gmap_longitude = "Longitude";
    ret.en.swirl_widget_gmap_showmarker = "Show Marker";
    ret.en.swirl_widget_gmap_zoomlevel = "Zoom";
    ret.en.swirl_widget_gmap_hostname = "Host Name";
    ret.en.swirl_widget_gmap_apikey = "Google Map Key";
    ret.en.swirl_widget_gmap_apikeys = "Api Keys";
    ret.en.swirl_widget_gmap_noapikey = "Haven't Google Api Keys for this domain '";
    ret.en.swirl_widget_gmap_edit_gapikeyprop = "' please edit property 'Google Api Key'";
    return ret;
};

/* Types */

if (typeof eXcellBase == 'function') {
    /**
     * latitude
     */
    function eXcell_gmlatitude(cell) {
        if (cell) {                                                     //default pattern, just copy it
            this.cell = cell;
            this.grid = this.cell.parentNode.grid;
        }
        this._params = {
            min : -90,
            max: 90,
            isFloat: true
        };

    }

    eXcell_gmlatitude.prototype = new eXcell_basenumber;    // nest all other methods from base class


    /**
     * longtitude
     */
    function eXcell_gmlongitude(cell) {
        if (cell) {                                                     //default pattern, just copy it
            this.cell = cell;
            this.grid = this.cell.parentNode.grid;
        }
        this._params = {
            min : -180,
            max: 180,
            isFloat: true
        };

    }

    eXcell_gmlongitude.prototype = new eXcell_basenumber;    // nest all other methods from base class


    /**
     * zoom level
     */
    function eXcell_gmzoomlevel(cell) {                                    //excell name is defined here
        if (cell) {                                                     //default pattern, just copy it
            this.cell = cell;
            this.grid = this.cell.parentNode.grid;
        }

        this._prefix = "";
        this._maxValue = 20;
        this._minValue = 1;
        this._sliderStep = 1;

    }

    eXcell_gmzoomlevel.prototype = new eXcell_slidertype;    // nest all other methods from base class


    /**
     * google maps api key list data
     */
    function eXcell_gmapkeysdata(cell) {                                    //excell name is defined here
        if (cell) {                                                     //default pattern, just copy it
            this.cell = cell;
            this.grid = this.cell.parentNode.grid;
        }

        this._cellTitle = "swirl_widget_gmap_apikeys";
        this._appendText = "<a href='http://code.google.com/intl/en-EN/apis/maps/signup.html' target='_blank' style='color:#001aff;'>Sign Up to get Google Api Key</a>";
        this._props = {"height": 300};
        this._model = [
            {
                "title": $(WiziCore.lang().tr("swirl_widget_gmap_hostname")).text(),
                "width": 30,
                "align":"center",
                "type":"text"
            },

            {
                "title": $(WiziCore.lang().tr("swirl_widget_gmap_apikey")).text(),
                "width": 70,
                "align":"center",
                "type":"text"
            }
        ];

    }

    eXcell_gmapkeysdata.prototype = new eXcell_flist;    // nest all other methods from base class
}

if (!tick) {
    //google FIX
    var tick = function() {
    }
}
