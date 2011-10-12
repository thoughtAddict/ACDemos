var WiziCore770bcd0d28944f4b8381826f90c42bc4 = WiziCore_Widget_Base.extend({
    _widgetClass : "WiziCore770bcd0d28944f4b8381826f90c42bc4",
    _dataPropName : "data",
    _containerDiv: null,
    _isBuild : false,
    _scripts : null,
    _frameDrawn: false,

    _template : "<script type=\"text/javascript\" src=\"http://code.jquery.com/jquery-1.6.2.min.js\"></script><script type=\"text/javascript\" src=\"wiziCore/widgetframe.js\"></script> <style>body{margin:0px;padding: 0px;}</style><object width=\"100%\"  height=\"100%\">\
<param name=\"movie\" value=\"http://www.youtube.com/v/[*VideoID*]?fs=1&amp;hl=en_US\"></param>\
<param name=\"wmode\" value=\"opaque\" /><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowscriptaccess\" value=\"always\"></param><embed src=\"http://www.youtube.com/v/[*VideoID*]?fs=1&amp;hl=en_US\" type=\"application/x-shockwave-flash\" allowscriptaccess=\"always\" allowfullscreen=\"true\" width=\"100%\" wmode=\"opaque\" height=\"100%\"></embed></object>",

    init: function() {
        this._super.apply(this, arguments);
        this._scripts = [

        ];
    },
    initProps: function() {
        this._super();
        this.aspectResize = this.htmlProperty('aspectResize', this._updateLayout);
    },
    replaceAll : function(source, stringToFind, stringToReplace) {
        var temp = source;
        var index = temp.indexOf(stringToFind);
        while (index != -1) {
            temp = temp.replace(stringToFind, stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
    },

    _updateLayout: function() {
        this._super();
        if (this._cDiv != null) {
            $(this._cDiv).width("100%").height(this.height());
            if (this._frameDrawn){
                clearInterval(this._drawInterval);
                var self = this;
                this._drawInterval = setInterval(function(){
                    clearInterval(self._drawInterval);
                    self.drawFrame();
                }, 20);
            }
        }
        this.checkResize();
    },

    draw : function() {
        this._cDiv = $("<iframe>");
        this._cDiv[0].setAttribute("frameBorder", 0);
        this._cDiv[0].setAttribute("scrolling", "auto");
        this._cDiv[0].setAttribute("hspace", 0);
        this._cDiv[0].setAttribute("vspace", 0);
        this._cDiv.css({"width": "100%", "height": this.height(), "border" : "none"});
        this.base().prepend(this._cDiv);
        var self = this;
        this.tableBase().resize(function(){
//            self._cDiv.css({width: '', height: ''});
//            setTimeout(function(){
            self._cDiv.css({"height": self.tableBase().height() - 5});
            if (WiziCore_Helper.isMobile()) {
                setTimeout(function() {
                    self.drawFrame();
                }, 1);
            }
//            },1);

        });
        this._super.apply(this, arguments);
    },

    onPageDrawn: function() {
        var self = this;
        this._super.apply(this, arguments);
        this._cDiv.attr('src', 'widgetframe.html');
        this._cDiv.load(function() {
            self.drawFrame();
        });
        this._super.apply(this, arguments);
    },

    initDomState: function() {
        this._super();
        this.initDomStatePos();
        this._visible(this.visible());
    },

    _refreshObj: function() {
        this.drawFrame();
    },

    drawFrame : function() {
        var template = this._template;
        var pGroups = window[this._widgetClass].props();
        for (var i = 0, l = pGroups.length; i < l; i ++) {
            for (var j = 0, lj = pGroups[i].props.length; j < lj; j ++) {
                var propName = pGroups[i].props[j].name;
                var value = this.prop(propName);
                value = (value == undefined) ? '' : value;
                template = this.replaceAll(template, '[*' + propName + '*]', value);
            }
        }
        if (this._cDiv[0].contentWindow != null){
            this._cDiv[0].contentWindow.setScripts(this._scripts);
            this._cDiv[0].contentWindow.putContent(template);
            this._frameDrawn = true;
        }
    }

    ,VideoID:function(){return this.htmlProperty('VideoID', this._refreshObj).apply(this, arguments);}

});

WiziCore770bcd0d28944f4b8381826f90c42bc4.props = function(){
    var ret = [
        { name: WiziCore_PropertyGroups.group_names.general, props:[
            WiziCore_PropertyGroups.general.widgetClass,
            WiziCore_PropertyGroups.general.name
        ]},

        { name: WiziCore_PropertyGroups.group_names.layout, props:[
            WiziCore_PropertyGroups.layout.aspectResize,
            WiziCore_PropertyGroups.layout.pWidth,
            WiziCore_PropertyGroups.layout.width,
            WiziCore_PropertyGroups.layout.height,
            WiziCore_PropertyGroups.layout.x,
            WiziCore_PropertyGroups.layout.y,
            WiziCore_PropertyGroups.layout.tabindex,
            WiziCore_PropertyGroups.layout.zindex,
            WiziCore_PropertyGroups.layout.anchors
        ]},

        { name: WiziCore_PropertyGroups.group_names.layout, props:[
            WiziCore_PropertyGroups.behavior.visible
        ]},

        { name: WiziCore_PropertyGroups.group_names.style, props:[
            WiziCore_PropertyGroups.behavior.opacity,
            WiziCore_PropertyGroups.style.margin,
            WiziCore_PropertyGroups.style.widgetStyle
        ]}

    ];

    WiziCore770bcd0d28944f4b8381826f90c42bc4._addProperties(ret, [['VideoID','YouTube','text','false','VideoID','VideoID']]);
    return ret;
};

WiziCore770bcd0d28944f4b8381826f90c42bc4._addProperties = function(list, props) {
    for (var i = 0, l = props.length; i < l; i++ ) {
        WiziCore770bcd0d28944f4b8381826f90c42bc4._addProperty(list, props[i][0], props[i][1], props[i][2], props[i][3], props[i][4], props[i][5]);
    }
};

WiziCore770bcd0d28944f4b8381826f90c42bc4._addProperty = function(props, name, group, type, inTheme, accessor, alias) {
    var isGroupExist = false;
    var propObj = {name: name, type : type, get: accessor, set: accessor, alias: alias, inTheme: inTheme};
    for (var i = 0, l = props.length; i < l; ++i) {
        if (props[i].name == group) {
            props[i].props.push(propObj);
            isGroupExist = true;
            break;
        }
    }
    if (!isGroupExist) {
        props.push({name: group, props: [propObj]});
    }
};

WiziCore770bcd0d28944f4b8381826f90c42bc4.emptyProps = function(){
    return {};
};

/**
 * Return widget inline edit prop name
 * @return {String} default properties
 */
WiziCore770bcd0d28944f4b8381826f90c42bc4.inlineEditPropName = function(){
    return null;
};

/**
 * Return default widget prop
 * @return {Object} default properties
 */
WiziCore770bcd0d28944f4b8381826f90c42bc4.defaultProps = function(){
    return {VideoID:'sfBxbLb62-Q',width: 200,height:200, x : "100", y: "100", zindex : "auto",
        anchors : {left: true, top: true, bottom: false, right: false}, visible : true,
        opacity : 1, name: "YouTube1", margin : ""
    };
};

WiziCore770bcd0d28944f4b8381826f90c42bc4.emptyProps = function(){
    return {};
};



/**
 * Return widget data model
 * @return {Object} default properties
 */
WiziCore770bcd0d28944f4b8381826f90c42bc4.widgetDataModel = function(){
    return [];
};

/**
 * Return available widget actions
 * @return {Object} available actions
 */
WiziCore770bcd0d28944f4b8381826f90c42bc4.actions = function(){
    var ret = {};
    // append base actions
    ret = jQuery.extend(WiziCore_UI_BaseWidget.actions(), ret);
    return ret;
};


/* Lang constants */
/**
 * Return available widget langs
 * @return {Object} available actions
 */
WiziCore770bcd0d28944f4b8381826f90c42bc4.langs = function(){
    return { "en" : {} };
};

/* Register widget in the Designer */
WiziCore.Widgets().registerExWidget("WiziCore770bcd0d28944f4b8381826f90c42bc4", "swirl_widget_cat_common", "YouTube", "YouTube",
    "wiziCore/extWidgets/widget-cog.png");
