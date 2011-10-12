var wiziLoadScripts = [];
var content = "";

function setScripts(scripts) {
    for (var i = 0, l = scripts.length; i < l; i ++) {
        if (!isScriptExist(scripts[i].source)) {
            wiziLoadScripts.push(scripts[i]);
        }
    }
}

function isScriptExist(src) {
    var length = wiziLoadScripts.length;
    for (var i = 0; i < length; i ++) {
        if (wiziLoadScripts[i].source == src) {
            return true;
        }
    }
    return false;
}

function checkEmbeddedScripts() {
    var result = true;
    var self = this;

    var callbackGenerator = function(obj) {
        return function() {
            obj.state = "loaded";
            draw();
        }
    };

    for (var i = 0;i < wiziLoadScripts.length; i++) {
        var scriptObj = wiziLoadScripts[i];
        if (scriptObj.state == "notLoaded") {

            jQuery.getScript(scriptObj.source, callbackGenerator(scriptObj));
//            loadScript(scriptObj.source);
//            callbackGenerator(scriptObj)();
            result = false;
        }
    }

    return result;
}

function loadScript(url) {
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", url);
    document.getElementsByTagName("head")[0].appendChild(script);
}

function draw() {

    if (!checkEmbeddedScripts()) {
        return;
    }

    jQuery(document.body).empty().css({padding: '0px', margin: '0px'});
    document.write(content);
    //jQuery(document.body).css({padding: '0px', margin: '0px'});
//    var _containerDiv = jQuery('<div>');
//    //_containerDiv.css({'width': '100%', 'height' : '100%'});
//    //_containerDiv.empty();
//    //var widgetContent = jQuery(content);
//    jQuery(document.body).append(_containerDiv);
//    _containerDiv.append(content);
}

function putContent(widgetContent) {
    content = widgetContent;
    draw();
}