if (window.waInitParametrsObject === undefined){
    window.waInitParametrsObject = { forms : [], clientUrl : acGetLiveUrl(), userPathParams: {} };
}

function acGetLiveUrl(){
    var scripts = document.getElementsByTagName("script");
    var src = scripts[scripts.length-1].src;
    src = src.replace('wiziCore/helpers/userlive.js', 'live.php');
    src = src.replace('live/userlive.js', 'live.php');
    return src;

}

function acGetPathParams(){
    return window.waInitParametrsObject.userPathParams;
}

function acPrefetchScripts(){
    var prefIframe = document.createElement('iframe');
    prefIframe.setAttribute("frameBorder", 0);
    prefIframe.setAttribute("width", 0);
    prefIframe.setAttribute("height", 0);
    var url = (window.waInitParametrsObject.clientUrl).replace("live.php", "prefill.php?trsdf") ;
    url = (url.indexOf("?") > 0) ? url.slice(0, url.indexOf("?")): url;
    prefIframe.setAttribute("src", url);
    prefIframe.style.display = "none";
    prefIframe.style.visibility = "hidden";
    document.body.appendChild(prefIframe);
}

/**
 * Init wiziApp form
 * @param {String} formId formIdFor show
 * @param {Number} width reserwe width
 * @param {Number} height reserve height
 */
function waInitForm(formId, width, height, qParams, htmlContainerId, debugMode){
    if (height == undefined){
        height = "100%";
    }
    if (width == undefined){
        width = "100%";
    }

    //calc params
    var params = {};
    var len = arguments.length;
    for (var i = 4; i < len; i++){
        params["arg" + (i - 4)] = arguments[i];
    }

    //get params into array
    var paramString = window.location.search.substring(1).split( "&" );
    var length = paramString.length;
    for (var i = 0; i < length; i++){
        var item = paramString[i].split( "=" );
        params[ item[0] ] = item[1];
    }

    //convert qParams items from obj to json
    if (qParams != undefined){
        try{
            var newParam = JSON.stringify(qParams);
            newParam = escape(newParam);
            params['inputParams'] = newParam;
        } catch (er){
            acDebugger.systemLog("convert userLive input params error", er);
        }
    }
    var duplicateCounter = 0;
    var frameId = "waInitFormiFramePlace_" + formId;
    var findDuplicate = false;

    do{
        findDuplicate = false;
        frameId = "waInitFormiFramePlace_" + formId + ( (duplicateCounter == 0) ? "" : duplicateCounter );

        for (var i in window.waInitParametrsObject.forms){
            if (window.waInitParametrsObject.forms[i].frameId == frameId){
                findDuplicate = true;
                break;
            }
        }

        duplicateCounter++;

    } while (findDuplicate === true);

    var iframeStr = '<iframe id="' + frameId + '" name="' + frameId + '"  scrolling="auto" frameBorder="0" hspace="0" vspace="0" align="top" width="' + width + '" height="' + height +
            '" allowtransparency="true" style="background-color:transparent">Browser not support iframes</iframe>';

    if (htmlContainerId == undefined){
        //for single application
        document.write(iframeStr);
    } else {
        //for application in application (embeddedApp widget)
        var iFrame = document.createElement('iframe');
        iFrame.setAttribute("frameBorder", 0);
        iFrame.setAttribute("allowTransparency", true);
        iFrame.setAttribute("id", frameId);
        iFrame.setAttribute("name", frameId);
        iFrame.setAttribute("scrolling", "auto");
        iFrame.setAttribute("hspace", 0);
        iFrame.setAttribute("vspace", 0);
        iFrame.setAttribute("align", "top");
        iFrame.setAttribute("width", width);
        iFrame.setAttribute("height", height);
        iFrame.style.backgroundColor = "transparent";

        var htmlContainer = document.getElementById(htmlContainerId);
        if (htmlContainer != null){
            while(htmlContainer.childNodes.length) {
                //clear htmlContainer
                htmlContainer.removeChild( htmlContainer.firstChild );
            }
            htmlContainer.appendChild(iFrame);
        } else {
            acDebugger.systemLog("can't detect htmlContainerId", htmlContainerId);
        }
        /*
        var iframeDoc = iFrame.contentDocument;
        if (iframeDoc == undefined || iframeDoc == null && iFrame.contentWindow != null){
            iframeDoc = iFrame.contentWindow.document;
        }
        if (iframeDoc != undefined && iframeDoc != null){
            iframeDoc.write("Browser not support iframes");
        }
        */

    }

    if (debugMode) {
        params['debug'] = true;
    }

    window.waInitParametrsObject.forms.push( {formId : formId, frameId : frameId, width : width, height : height} );

    if ( document.readyState === "complete" ) {
        waConstructForm(formId, width, height, params, frameId);
    } 
    else if ( document.readyState === "loaded" ) {
        //for Chrome
        waConstructForm(formId, width, height, params, frameId);
    }
    // Mozilla, Opera and webkit nightlies currently support this event
    else if ( document.addEventListener ) {
        // Use the handy event callback
        document.addEventListener( "DOMContentLoaded", function(){
            waConstructForm(formId, width, height, params, frameId);
        }, false );
    // If IE event model is used
    } else if ( document.attachEvent ) {
        // ensure firing before onload,
        // maybe late but safe also for iframes
        document.attachEvent("onreadystatechange", function(){
            waConstructForm(formId, width, height, params, frameId);
        });
    }
    return iFrame;
}

/**
 * Construct form
 * @private
 * @param {String} formId formIdFor show
 * @param {Number} width reserve width
 * @param {Number} height reserve height
 */
function waConstructForm(formId, width, height, params, frameId){

    var el = document.getElementById( frameId );
    if (el != null){
        // set parametes to iframe from parent window
        el.waInitParametrsObject = window.waInitParametrsObject;

        var url = window.waInitParametrsObject.clientUrl;

        url += (url.indexOf("?") == -1) ? "?" : "&";
        url +=  "formId=" + formId;

        for (var i in params){
            if ((params[i]) && (i != "formId"))
                url += "&" + i + "=" + params[i];
        }
        el.setAttribute("src", url);
    }

}