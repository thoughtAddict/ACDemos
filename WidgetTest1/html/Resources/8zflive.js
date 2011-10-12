$(document).ready(function() {
    WiziCore_OnErrorEvent.initOnError();
    /*
     * Build live mode dom
     */
    //create session
    setInputParameters();
    WiziCore.lang(SwirlLangTr.ENGLISH).lang(SwirlLangObjectEn);
    var session = WiziCore_AppContext.getInstance().getSession();
    var wndLive = $("#wiziLiveMode");
    if (window['PhoneGap']) { // loadNative app after device ready
        document.addEventListener("deviceready", function(){ login(session); }, false);
    }
    else {
        login(session);
    }
    var currentRuntime = null;

    function setInputParameters(){
        //get params into array
        parseURLstring(window.location.search.substring(1), parseParameters);
    }

    function parseParameters(item){
        var iParams = WiziCore_AppContext.getInstance().inputParameters();
        var addFieldsToParameters = function(item){
                                        var k2 = item[0];
                                        var v2 = item[1];
                                        if (iParams[ k2 ] != undefined ){
                                            //convert to array
                                            if (!(iParams[ k2 ] instanceof Array)){
                                                iParams[ k2 ] = [iParams[ k2 ]];
                                            }
                                            iParams[ k2 ].push(v2);
                                        } else {
                                            iParams[ k2 ] = v2;
                                        }
                                    };
        var key = item[0];
        var value = item[1];
        if (value == undefined){
            addFieldsToParameters([key]);
        } else
        if (key != "" && value != ""){
            try{
                if (key == "inputParams"){
                    value = unescape(value);
                    value = JSON.parse(value);
                    //if not JSON - parse inputParams string from userlive
                    if (typeof value == "string"){
                        parseURLstring(value, parseParameters);
                    }
                }
                if (typeof value == "object"){
                    //if object
                    for (var i in value){
                        addFieldsToParameters([i, value[i]]);
                    }
                } else {
                    addFieldsToParameters(item);
                }
            } catch (er){
                //the object is not json object
                acDebugger.systemLog("setInputParameters error", er);
                addFieldsToParameters([key, value]);
            }
        }
    }

    function parseURLstring(url, callback){
        var pArr = url.split( "&" );
        for (var i = 0, l = pArr.length; i < l; i++){
            //collect params to object
            var item = pArr[i].split( "=" );
            if (callback(item) === true){
                break;
            }
        }
    }

    function getSession() {
        var sessionId = null;
        try{
            //embed mode
            if (parent.Swirl_WiziCore_ParentAppSession) {
                sessionId = parent.Swirl_WiziCore_ParentAppSession;
            }
        }
        catch(e) {}

        if (!sessionId) {
            sessionId = WiziCore.cookie().cookie("swirlSession");
        }

        return sessionId;
    }

    // return session
    function login(session) {
        if (window.formObject) {  //prefill form
            var data =  {error:false,
                         object: {"result": window.formObject}};
            onLogin(data);
            return;
        }
        var self = this;
        var sessionId = getSession();
        var formInstanceId = getParam("instanceId");
        var formId = (window.WiziFormId)?window.WiziFormId:getParam("formId");
        var context = WiziCore_AppContext.getInstance();

        var onSessionFullLogin = function(fullLogin, defaultFormId, parentFormId){
            //bind for signIn btn click event
            if (fullLogin.sessionId != undefined) {
                try {
                    if (currentRuntime != null) {
                        currentRuntime.stop();
                    }

                    //check deafultForm Existance
                    var localFormId = formId;
                    if (parentFormId == localFormId) {
                        localFormId = (defaultFormId != undefined && defaultFormId != "") ? defaultFormId : localFormId;
                    }
                    //after populate login info, loading full form info and populate too
                    session.loadFullForm(fullLogin.sessionId, localFormId, formInstanceId, function(fullFormRes) {
                        if (fullFormRes.error == false) {
                            context.forms()._populateFormResult(fullFormRes.object.result, liveShowCallback);
                        } else {
                            WiziCore_Helper.enableInterface();
                            var msg = WiziCore.lang().tr("swirl_live_load_error");
                            showErrorAndClose(WiziCore.lang().tr("swirl_live_create_sess"), msg, 18);
                        }
                    });
                } catch(e) {
                    acDebugger.systemLog1("onSessionFullLogin :: error", e);
                }
            } else {
                WiziCore_Helper.enableInterface();
                var msg = WiziCore.lang().tr("swirl_live_create_sess_error");
                showErrorAndClose(WiziCore.lang().tr("swirl_live_create_sess"), msg, 19);
            }
        };

        $(session).bind(WiziCore_Api_SessionRequester.onLiveLogin, function(ev, fullLogin, defaultFormId, parentFormId) {
                onSessionFullLogin(fullLogin, defaultFormId, parentFormId);
        });

        if (sessionId == undefined || sessionId == null) {
            //user not logged in login as anonymous
            anonymousLogin(formId, formInstanceId);
        } else {
            session.loginAndLoadFormWithSession(sessionId, formId, formInstanceId, function(result) {
                var error = result.error;
                if (!error) {
                    onLogin(result);
                } else {
                    //if session expired, trying to anonumous login
                    anonymousLogin(formId, formInstanceId);
                }
            });
        }
    }

    function anonymousLogin(formId, formInstanceId) {
        session.loginAndLoadForm(null, null, formId, formInstanceId, function(result) {
            onLogin(result);
        });
    }

    function onLogin(result) {
        var error = result.error;
        var object = result.object.result;
        if (error) {
            wndLive.empty();
            var msg = WiziCore.lang().tr("swirl_live_create_sess_error");
            msg += (result.object.message != undefined) ? "<br>" + result.object.message : "";
            showErrorAndClose(WiziCore.lang().tr("swirl_live_create_sess"), msg, 20);
        } else {
            //populate form info and login info
            var loginResult = object.loginResult;
            session._populateLoginResult(loginResult);
            var context = WiziCore_AppContext.getInstance();

            var formResult = object.formResult;
            var forms = context.forms();
            forms._populateFormResult(formResult, liveShowCallback);
        }
    }

    /**
     * Return param from URL by name
     * @param {String} paramName
     * @return {String} result
     */
    function getParam(paramName) {
        //get params into array
        var params = window.location.search.substring(1).split("&");
        var result = null;
        for (var i =0, l = params.length; i < l; i++){
            var item = params[i].split("=");
            if (item[0] == paramName) {
                if (item.length > 1) {
                    result = item[1];
                }
            }
        }
        return result;
    }

    function liveShowCallback(error, msg, form, inst) {
        //alert(error);
        if (!error) {
            showForm(form, inst);
        } else {
            wndLive.empty();
            showErrorAndClose(WiziCore.lang().tr("swirl_live_load_inst"), msg, 17);
        }
    }

    function showErrorAndClose(fmsg, msg, code) {
        var dlg = WiziCore_Helper.showError(fmsg, msg, code);
        $(dlg).one(WiziCore_UI_MessageBoxWidget.onDialogClose, function(ev, retid) {
            switch (retid) {
                case WiziCore_UI_MessageBoxWidget.IDOK:
                    setTimeout(function() {
                        //window.close();
                    }, 200);
                    break;
            }
        });
    }

    /**
     * Handler for show form
     */
    function showForm(form, instanceProj) {
        //block autoopen swirlDebugger in live mode
        if (window.swirlDebugger != undefined && typeof window.swirlDebugger.openMode == "function") {
            swirlDebugger.openMode(WiziCore_Api_Debugger.MODE_USER_OPEN);
        }

        wndLive.empty();
        var params = {session: session, pageId: getParam("pageId")};


        var runtime = new WiziCore_UI_FormRuntime(WiziCore_UI_FormRuntime.LIVE_MODE);
        runtime.show(form, instanceProj, wndLive, params);
        WiziCore_Helper.enableInterface();
        currentRuntime = runtime;
    }
});


