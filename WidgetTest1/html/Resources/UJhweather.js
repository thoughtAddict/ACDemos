/**
 * @lends       WiziCore_UI_WeatherWidget#
 */
var WiziCore_UI_WeatherWidget = WiziCore_Widget_Base.extend({
    _widgetClass : "WiziCore_UI_WeatherWidget", //widget Class name
    _dataPropName : "zipCode", //the method name, which is responsible for working with data
    _weatherDiv: null,//jQuery object
    _wBtn : null,

    _run: null,

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

    draw: function() {
        this._input = $('<input type="text" class="input clear-input-border" style="width:100%; height:100%"/>');
        var div = $("<div>");
        div.css({position: "relative", width: "100%", height:"100%"});
        this._weatherDiv = div;
        this._wBtn = $("<input type='button' class='input' style='height:100%'>")
                .css({
                         "position": "absolute",
                         "right": "0px",
                         "cursor": "pointer",
                         "top": "0px",
                         "background-color": "#f7f7f7",
                         "border": "1px solid gray"
                     });

        div.append(this._input);
        div.append(this._wBtn);
        this.base().prepend(div);

        var self = this;
        $(self._input).bind("change.custom", {self : self}, self.onChangeText);
        $(self._input).bind("keydown.custom", {self : self}, self.onKeyDown);
        $(self._wBtn).bind("click.custom", {self: self}, self.onWBtnClick);
        /*
         var text = initialObject.prop(this._dataPropName);
         if (text != undefined){
         initialObject.value( text );
         }
         */
        this._super.apply(this, arguments);
    },


    initProps: function() {
        this._super();

        this.font = this.themeProperty('font', this._font);
        this.border = this.themeProperty('border', this._border);
        this.fontColor = this.themeProperty('fontColor', this._fontColor);
        this.bg = this.themeProperty('bgColor', this._bg);

        this.btnText = this.htmlProperty('btnText', this._btnText);
        this.opacity = this.htmlProperty('opacity', this._opacity);
        this.tabindex = this.htmlProperty('tabindex', this._tabindex);

        this.showBtn = this.htmlProperty('showBtn', this._showBtn);
        this.gridField = this.normalProperty('gridField');
        this.failText = this.normalProperty('failText');
        this.zipCode = this.htmlProperty('zipCode', this._zipCode);
    },

    initDomState : function () {
        this._super();
        this.initDomStatePos();
        this._bg(this.bg());
        this._font(this.font());
        this._fontColor(this.fontColor());
        this._border(this.border());

        this._updateEnable();
        this._visible(this.visible());
        this._opacity(this.opacity());
        this._tabindex(this.tabindex());

        this._btnText(this.btnText());
        this._showBtn(this.showBtn());
        this._zipCode(this.zipCode());
    },

    destroy: function() {
        $(this._input).unbind("keydown.custom");
        $(this._input).unbind("change.custom");
        $(this._wBtn).unbind("click.custom");
        this._super();
    },

    setFocus: function(){
        if (this._isDrawn && this.mode() != WiziCore_Visualizer.EDITOR_MODE){
            this._input.focus();
        }
    },

    onWBtnClick: function(ev) {
        if (ev != undefined) {
            var self = ev.data.self;
        } else {
            self = this;
        }
        var form = self.form();
        var weatherClient = form.weatherClient;

        var fail = form.find(self.failField());
        var city = form.find(self.cityField());
        var state = form.find(self.stateField());
        var grid = null;
        var zip = self.zipCode();
        var colModel = null;
        var gridField = self.gridField();
        if (typeof gridField == "object" && gridField != null) {
            if (gridField.gridUid != undefined) {
                grid = form.find(gridField.gridUid);
            }

            if (gridField.colValue != undefined) {
                colModel = gridField.colValue;
            }
        }
        weatherClient.WeatherForecast(zip, fail, function(result, error) {
            if (error === true) {
                self.onError(result);
            } else {
                if (result.Success == "false") {
                    self.onFail(result);
                } else {
                    self.onSuccess(result);
                }
            }
        }, state, city, grid, colModel);
        self.setGMapPosition();
    },

    setGMapPosition: function() {
        if (this.gMap() != null) {
            //call googleMap widget
            var form = this.object().form();
            var gMap = form.find(this.gMap());
            if (gMap != null) {
                var webClient = form.context().webClient();
                webClient.httpRequest("http://maps.google.com/maps/api/geocode/json",
                        "GET", function(data, error) {
                    if (error === false && data.results[0] !== undefined) {
                        gMap.prop("longitude", data.results[0].geometry.location.lng);
                        gMap.prop("latitude", data.results[0].geometry.location.lat);
                    }
                }, {address: this.zipCode(), sensor:"false"}, "json");
            }
        }
    },

    onSuccess: function(json) {
        var triggerEvent = new jQuery.Event(WiziCore_UI_WeatherWidget.onSuccess);
        $(this.object()).trigger(triggerEvent, [json]);
        return !triggerEvent.isPropagationStopped();
    },

    onFail: function(result) {
        WiziCore_Helper.showWarning("", result.ResponseText);
        var triggerEvent = new jQuery.Event(WiziCore_UI_WeatherWidget.onFail);
        $(this.object()).trigger(triggerEvent, [result]);
        return !triggerEvent.isPropagationStopped();
    },

    onError: function(result) {
        WiziCore_Helper.showError(WiziCore.lang().tr("swirl_widget_ext_weather_error"), this.failText(), 1332);
        var triggerEvent = new jQuery.Event(WiziCore_UI_WeatherWidget.onError);
        $(this.object()).trigger(triggerEvent, [result]);
        return !triggerEvent.isPropagationStopped();
    },

    onChangeText: function(ev) {
        var self = ev.data.self;
        self.zipCode($(self._input).val());
    },

    onKeyDown: function(ev) {
        var self = ev.data.self;
        if (ev.keyCode == 13) {
            self.zipCode($(self._input).val());
            self.onWBtnClick();
        }
    },

    _enable: function(flag){
        this._super(flag, this._input);
        this._super(flag, this._wBtn);
        (flag === false) ? this._input.addClass('ui-state-disabled') : this._input.removeClass('ui-state-disabled');
        (flag === false) ? this._wBtn.addClass('ui-state-disabled') : this._wBtn.removeClass('ui-state-disabled');
    },

    _zipCode: function(text) {
        this.base().find("input:eq(0):text").attr("value", text);
    },

    failField: function(val) {
        if (val != undefined) {
            this._project['failField'] = this.getUidWidgetFromObjectChooser(val);
            var obj = {"failField": this._project['failField']};
            this.sendExecutor(obj);
        }
        return this._project['failField'];
    },

    _showBtn: function(val) {
        if (val != undefined) {
            if (val == true) {
                $(this._wBtn).show();
            } else {
                $(this._wBtn).hide();
            }
        }
    },

    gMap: function(val) {
        if (val != undefined) {
            this._project['gMap'] = this.getUidWidgetFromObjectChooser(val);
            var obj = {"gMap": this._project['gMap']};
            this.sendExecutor(obj);
        }
        return this._project['gMap'];
    },

    cityField: function(val) {
        if (val != undefined) {
            this._project['cityField'] = this.getUidWidgetFromObjectChooser(val);
            var obj = {"cityField": this._project['cityField']};
            this.sendExecutor(obj);
        }
        return this._project['cityField'];
    },

    stateField: function(val) {
        if (val != undefined) {
            this._project['stateField'] = this.getUidWidgetFromObjectChooser(val);
            var obj = {"stateField": this._project['stateField']};
            this.sendExecutor(obj);
        }
        return this._project['stateField']
    },

    run: function(val) {
        if (val != undefined) {
            this._run = val;
            this.onWBtnClick();
        }
        return this._run;
    },

    _fontColor : function(val) {
        this._super(val);
        this._super(val, this.base().find("input:eq(0)"));
        this._super("", this.base().find("input:eq(1)"));
    },

    _font : function(val) {
        this._super(val);
        this._super(val, this.base().find("input:eq(0)"));
        this._super("", this.base().find("input:eq(1)"));
    },

    /*calculateHeight: function(height) {
        this._super(height);
        this._wBtn.css("width", this.height());
    },*/

    _updateLayout: function(){
        this._super();
        //this._weatherDiv.width(this.width())
        this._weatherDiv.height(this.height());
        this._input.width(this.width())
                   .height(this.height());
        this._wBtn.width(this.height())
                  .height(this.height());
    },

    _btnText: function(val) {
        $(this._wBtn).val(val);
    },

    /**
     * Return widget data model
     */
    getDataModel: function() {
        var values = [
            {name: "swirl_widget_ext_weather", value: "", uid: "exampleuid"}
        ];
        return values;
    }
});

WiziCore_UI_WeatherWidget._props = [
    { name: WiziCore_PropertyGroups.group_names.general, props:[
        WiziCore_PropertyGroups.general.widgetClass,
        WiziCore_PropertyGroups.general.name,
        WiziCore_PropertyGroups.general.btnText
    ]},
    { name: WiziCore_PropertyGroups.group_names.database, props:[
        WiziCore_PropertyGroups.database.isIncludedInSchema,
        WiziCore_PropertyGroups.database.dataType,
        WiziCore_PropertyGroups.database.isUnique,
        WiziCore_PropertyGroups.database.mandatoryHighlight,
        WiziCore_PropertyGroups.database.mandatory
    ]},
    { name: WiziCore_PropertyGroups.group_names.layout, props:[
        WiziCore_PropertyGroups.layout.x,
        WiziCore_PropertyGroups.layout.y,
        WiziCore_PropertyGroups.layout.pWidthHidden,
        WiziCore_PropertyGroups.layout.widthHidden,
        WiziCore_PropertyGroups.layout.heightHidden,
        WiziCore_PropertyGroups.layout.sizes,
        WiziCore_PropertyGroups.layout.minWidth,
        WiziCore_PropertyGroups.layout.maxWidth,
        WiziCore_PropertyGroups.layout.maxHeight,
        WiziCore_PropertyGroups.layout.zindex,
        WiziCore_PropertyGroups.layout.tabindex,
        WiziCore_PropertyGroups.layout.tabStop,
        WiziCore_PropertyGroups.layout.anchors,
        WiziCore_PropertyGroups.layout.repeat,
        WiziCore_PropertyGroups.layout.alignInContainer
    ]},
    { name: WiziCore_PropertyGroups.group_names.behavior, props:[
        WiziCore_PropertyGroups.behavior.dragAndDrop,
        WiziCore_PropertyGroups.behavior.resizing,
        WiziCore_PropertyGroups.behavior.visible,
        WiziCore_PropertyGroups.behavior.enable
    ]},
    { name: WiziCore_PropertyGroups.group_names.data, props:[
        {name: "showBtn", type : "boolean", set:"showBtn", get:"showBtn", alias : "swirl_widget_ext_weather_prop_showbtn"},
        {name: "zipCode", type : "text", set:"zipCode", get:"zipCode", alias : "swirl_widget_ext_weather_prop_zipcode"},
        {name: "failField", type : "widgetlist", set:"failField", get:"failField", alias : "swirl_widget_ext_weather_prop_failfield"},
        {name: "cityField", type : "widgetlist", set:"cityField", get:"cityField", alias : "swirl_widget_ext_weather_prop_cityfield"},
        {name: "stateField", type : "widgetlist", set:"stateField", get:"stateField", alias : "swirl_widget_ext_weather_prop_statefield"},
        {name: "gridField", type : "weathergridcolumn", set:"gridField", get:"gridField", alias : "swirl_widget_ext_weather_prop_gridfield"},
        {name: "gMap", type : "gmapswidgetlist", set:"gMap", get:"gMap", alias : "swirl_widget_ext_weather_prop_gmap"},
        {name: "failText", type : "text", set:"failText", get:"failText", alias : "swirl_widget_ext_weather_prop_failtext"}
    ]},
    { name: WiziCore_PropertyGroups.group_names.style, props:[
        WiziCore_PropertyGroups.behavior.opacity,
        WiziCore_PropertyGroups.style.font,
        WiziCore_PropertyGroups.style.fontColor,
        WiziCore_PropertyGroups.style.margin,
        WiziCore_PropertyGroups.style.border,
        WiziCore_PropertyGroups.style.borderRadius,
        WiziCore_PropertyGroups.style.bgColor,
        WiziCore_PropertyGroups.style.widgetStyle
    ]}
];
/**
 * Return available widget prop
 * @return {Object} available property
 */
WiziCore_UI_WeatherWidget.props = function() {
    return WiziCore_UI_WeatherWidget._props;
};

/**
 * Return empty widget prop
 * @return {Object} default properties
 */
WiziCore_UI_WeatherWidget.emptyProps = function() {
    var ret = {};
    return ret;
};

/**
 * Return widget inline edit prop name
 * @return {String} default properties
 */
WiziCore_UI_WeatherWidget.inlineEditPropName = function() {
    return "zipCode";
};

/**
 * Return default widget prop
 * @return {Object} default properties
 */
WiziCore_UI_WeatherWidget.defaultProps = function() {
    var ret = {valName : "currText", width: "100", height: "20", x : "100", y: "100", zindex : "auto",
        anchors : {left: true, top: true, bottom: false, right: false}, visible : true, enable : true, widgetStyle: "default",
        opacity : 1, name: "Weather1", textAlign: "Left", showBtn: true, margin: "", alignInContainer: 'left', pWidth: "", tabStop: true,
        dragAndDrop: false,
        resizing: false
    };
    return ret;
};

WiziCore_UI_WeatherWidget.onSuccess = "Event#WiziCore_UI_WeatherWidget#onSuccess";
WiziCore_UI_WeatherWidget.onFail = "Event#WiziCore_UI_WeatherWidget#onFail";
WiziCore_UI_WeatherWidget.onError = "Event#WiziCore_UI_WeatherWidget#onError";
/**
 * Return available widget actions
 * @return {Object} available actions
 */
WiziCore_UI_WeatherWidget.actions = function() {
    var ret = {
        onSuccess : {alias : "swirl_widget_ext_weather_event_onsuccess", funcview : "onSuccess", action : "WiziCore_UI_WeatherWidget.onSuccess", params : "json", group : "swirl_widget_ext_weather_event_group"},
        onFail : {alias : "swirl_widget_ext_weather_event_onfail", funcview : "onFail", action : "WiziCore_UI_WeatherWidget.onFail", params : "json", group : "swirl_widget_ext_weather_event_group"},
        onError : {alias : "swirl_widget_ext_weather_event_onerror", funcview : "onError", action : "WiziCore_UI_WeatherWidget.onError", params : "json", group : "swirl_widget_ext_weather_event_group"}
    };
    // append base actions
    //ret = jQuery.extend(WiziCore_Widget_Base.actions(), ret);
    return ret;
};


/* Lang constants */
/**
 * Return available widget langs
 * @return {Object} available actions
 */
WiziCore_UI_WeatherWidget.langs = function() {
    var ret = {"en" : {}};
    /* Lang constants */
    ret.en.swirl_widget_ext_weather = "Weather";
    ret.en.swirl_widget_ext_name_weather = "Weather";
    ret.en.swirl_widget_ext_weather_type = "Example Type";
    ret.en.swirl_widget_ext_weather_dlg_type_title = "Example Dialog Type";
    ret.en.swirl_widget_ext_weather_prop_failfield = "Fail Field";
    ret.en.swirl_widget_ext_weather_prop_zipcode = "Zip Code";
    ret.en.swirl_widget_ext_weather_prop_cityfield = "City Field";
    ret.en.swirl_widget_ext_weather_prop_statefield = "State Field";
    ret.en.swirl_widget_ext_weather_prop_gridfield = "Grid Field";
    ret.en.swirl_widget_ext_weather_prop_call = "Call";
    ret.en.swirl_widget_ext_weather_prop_showbtn = "Show Button";
    ret.en.swirl_widget_ext_weather_prop_btntext = "Button Text";

    ret.en.swirl_widget_ext_weather_prop_date = "Date";
    ret.en.swirl_widget_ext_weather_prop_desc = "Description";
    ret.en.swirl_widget_ext_weather_prop_low = "Low";
    ret.en.swirl_widget_ext_weather_prop_high = "High";
    ret.en.swirl_widget_ext_weather_prop_icon = "Icon";
    ret.en.swirl_widget_ext_weather_prop_precip = "Precip";

    ret.en.swirl_widget_ext_weather_prop_dlg_grids_title = "Select Grids";
    ret.en.swirl_widget_ext_weather_prop_dlg_grids = "Grids";
    ret.en.swirl_widget_ext_weather_prop_dlg_columns = "Columns";
    ret.en.swirl_widget_ext_weather_prop_dlg_column_name = "Column Name";
    ret.en.swirl_widget_ext_weather_prop_dlg_column_value = "Field";
    ret.en.swirl_widget_ext_weather_prop_gmap = "Google Maps";

    ret.en.swirl_widget_ext_weather_event_group = "Weather Events";
    ret.en.swirl_widget_ext_weather_event_onsuccess = "On Success";
    ret.en.swirl_widget_ext_weather_event_onfail = "On Fail";
    ret.en.swirl_widget_ext_weather_event_onerror = "On Error";
    ret.en.swirl_widget_ext_weather_prop_failtext = "Fail Text";
    ret.en.swirl_widget_ext_weather_error = "Weather Error";
    ret.en.swirl_widget_ext_weather_fail = "Weather Warning";

    return ret;
};

/* Register widget in the Designer */
WiziCore.Widgets().registerExWidget("WiziCore_UI_WeatherWidget", "swirl_sections_extensible", "swirl_widget_ext_name_weather", "example",
        "wiziCore/extWidgets/weather/weather.png");
if (typeof eXcellBase == 'function') {
    /**
     * resource grid type
     */
    function eXcell_weathergridcolumn(cell) {

        if (cell) {
            //this IF must be in code
            this.cell = cell;
            this.grid = this.cell.parentNode.grid;
        }

        this._exampleDialog = null;
        this._template = '<div style=\"position: relative\">\n    <table style=\"position: absolute; width: 100%; height: 100%;\">\n        <tr valign=\"top\">\n            <td  style=\"width:200px; padding: 0 2px;\">\n                <span class=\"wa-ui-dialog-c-title\">\n                    <span lang=\"lang-swirl_widget_ext_weather_prop_dlg_grids\"><\/span>\n                <\/span>\n                <br>\n                <div class=\"wa-ui-dialog-content\">\n                    <div id=\"waWeatherGridDlgList\" ><\/div>\n                <\/div>\n            <\/td>\n            <td  style=\"padding: 0 2px;\">\n                <span class=\"wa-ui-dialog-c-title\">\n                    <span lang=\"lang-swirl_widget_ext_weather_prop_dlg_columns\"><\/span>\n                <\/span>\n                <br>\n                <div class=\"wa-ui-dialog-content\">\n                    <div id=\"waWeatherGridDlgColumn\" ><\/div>\n                <\/div>\n            <\/td>\n        <\/tr>\n    <\/table>\n<\/div>';

        //buffer value
        this._value = null;
        this._input = null;
        this._gridList = {};

        this.setValue = function(val) {
            //this method must be in code
            var viewVal = "";
            if (typeof val == "object" && val != null && val.gridName != undefined) {
                viewVal = val.gridName;
            }
            $(this.cell).empty().append(viewVal);
            //current value
            this.cell.cvalue = val;
        };

        this.getValue = function() {
            //this method must be in code
            return this.cell.cvalue;//return value
        };

        this.edit = function() {
            //this method must be in code

            this._value = this.getValue();
            var value = this.getValue();
            this.val = this.getValue();
            var self = this;
            var context = this.context();
            var editor = this.getEditor();

            var gridDlg = $(this._template);
            $(document.body).append(gridDlg);
            this._exampleDialog = gridDlg;

            var title = $(WiziCore.lang().tr("swirl_widget_ext_weather_prop_dlg_grids_title")).text();
            var ok = $(WiziCore.lang().tr("swirl_dialog_button_ok")).text();
            var cancel = $(WiziCore.lang().tr("swirl_dialog_button_cancel")).text();

            var btn = {};
            btn[cancel] = function() {
                $(this).dialog('destroy');
                gridDlg.remove();
            };

            btn[ok] = function() {
                self.saveValue();
                $(this).dialog('destroy');
                gridDlg.remove();
            };

            var props = jQuery.extend({
                modal : true,
                height: 315,
                width: 426,
                resizable : false,
                title : title,
                buttons: btn,
                close: function(event, ui) {
                    $(this).dialog('destroy');
                    gridDlg.remove();
                },
                dialogClass: "wa-system-dialog wa-system-style"
            }, {});

            gridDlg.dialog(props);
            gridDlg.parent().click(function(ev) {
                //set stop propagation for any click by parent of dialog
                ev.stopPropagation();
            });
            gridDlg.css("opacity", "0.9");

            var treeClient = new WiziCore_Api_ClientBase(null, this, {widgetClass : "WiziCore_UI_TreeWidget", width : 200, height : 200});
            var tree = new WiziCore_UI_TreeWidget(treeClient, $("#waWeatherGridDlgList"));
            tree.base().css("position", "");
            this._queriesTree = tree;
            var currApp = editor.form();
            this.buildTree(0, currApp);

            $(treeClient).bind(WiziCore_UI_TreeWidget.onSelect, function(ev, id) {
                self.updateColModel(id);
            });

            var model = [
                {"title": $(WiziCore.lang().tr("swirl_widget_ext_weather_prop_dlg_column_name")).text(), "width": 50, "align":"center", "type":"ed"},
                {"title": $(WiziCore.lang().tr("swirl_widget_ext_weather_prop_dlg_column_value")).text(), "width": 50, "align":"center", "type":"weathergridfield"}
            ];

            var colModelGrid = new WiziCore_Api_ClientBase(null, this, {widgetClass : "WiziCore_UI_GridWidgetOld",
                width : 200,
                height : 200,
                colmodel : model
            }
                    );

            var datatable = new WiziCore_UI_GridWidgetOld(colModelGrid, gridDlg.find("#waWeatherGridDlgColumn"));
            datatable.lightNavigation(true);
            datatable.enableDragAndDrop(false);
            this._datatable = datatable;
            datatable.base().css("position", "");

            $(colModelGrid).bind(WiziCore_UI_GridWidgetOld.onEditCell, function(ev, cn, rId, cInd, nValue) {
                var selGridUid = self._queriesTree.getSelectedItemId();
                var gridData = self._gridList[selGridUid];
                if (gridData == undefined) {
                    self._gridList[selGridUid] = {};
                }
                self._gridList[selGridUid][rId] = nValue;
            });

            if (typeof value == "object" && value !== null && value.gridUid !== undefined) {
                if (value.colData != undefined) {
                    this._gridList[value.gridUid] = value.colData;
                }
                tree.selectItem(value.gridUid, true);
            }
        };

        this.updateColModel = function(id) {
            var editor = this.getEditor();
            var form = editor.form();
            var widget = form.find(id);
            if (widget && widget.widgetClass() == "WiziCore_UI_GridWidget") {
                var colmodel = widget.prop("colmodel");
            }
            var db = this._datatable;
            var data = this._gridList[id];
            if (data == undefined) {
                this._gridList[id] = {};
                data = this._gridList[id];
            }
            if (db != undefined) {
                db.clear();
                var cnt = 0;
                for (var i in colmodel) {
                    cnt++;
                    var col = colmodel[i];
                    var value = (data != undefined && data[col.colUid] != undefined) ? data[col.colUid] : "none";
                    db.addRow({id : col.colUid, data : [col.title, value], ind: cnt});
                    data[col.colUid] = value;
                }
            }
        };

        this.buildTree = function(parent, object) {
            var tree = this._queriesTree;
            var wClass = object.prop("widgetClass");
            var wContainerType = WiziCore.Widgets().getContainerType(wClass);
            if ((wClass == "WiziCore_UI_GridWidgetOld") || (wContainerType != WiziCore_Widget_Base.CASE_TYPE_ITEM)) {
                var name = object.prop("name");
                var id = object.prop("id");
                var curr = tree.addNode({text : name, id : id}, parent);
                tree.setUserData(curr.id, "uid", id);

                for (var i in object.children()) {
                    this.buildTree(curr.id, object.children()[i]);
                }
            }
        }

        this.detach = function() {
            //this method must be in code
            return false;
        };

        this.saveValue = function() {
            var self = this;
            var selGridUid = self._queriesTree.getSelectedItemId();
            var gridData = self._gridList[selGridUid];
            var editor = this.getEditor();
            var form = editor.form();
            var widget = form.find(selGridUid);
            var value = null;
            if (widget && widget.widgetClass() == "WiziCore_UI_GridWidget") {
                var gridName = widget.name();
                var colModel = widget.colmodel();
                var colArr = "";
                for (var i in colModel) {
                    if (colArr != "") {
                        colArr += ",";
                    }
                    colArr += gridData[colModel[i].colUid];
                }
                value = {gridUid : selGridUid, colValue : colArr, gridName: gridName, colData: gridData};
            }

            //saving new value
            this.grid.callEvent("onEditCell", [2, this.cell.parentNode.idd, this.cell._cellIndex, value, this.val]);
        }
    }

    eXcell_weathergridcolumn.prototype = new eXcellBase;


    /**
     * weatherGridField list
     */
    makeCellList('eXcell_weathergridfield', {
        _defOpt: "none",
        langOpt: {
            "none" : "",
            "date" : "swirl_widget_ext_weather_prop_date",
            "desc" : "swirl_widget_ext_weather_prop_desc",
            "low" : "swirl_widget_ext_weather_prop_low",
            "high": "swirl_widget_ext_weather_prop_high",
            "icon" : "swirl_widget_ext_weather_prop_icon",
            "precip" : "swirl_widget_ext_weather_prop_precip"
        }
    });

    /**
     * weatherGridField list
     */
    function eXcell_gmapswidgetlist(cell) {
        if (cell) {                                                     //default pattern, just copy it
            this.cell = cell;
            this.grid = this.cell.parentNode.grid;
        }

        this._filter = "WiziCore_UI_GoogleMapsWidget";
    }

    eXcell_gmapswidgetlist.prototype = new eXcell_widgetlist;    // nest all other methods from base class
}