// If your dizmo has a back side, include this function. Otherwise you
// can delete it!
function showBack() {
    dizmo.showBack();
}

// As soon as the dom is loaded, and the dizmo is ready, instantiate the main class
window.document.addEventListener('dizmoready', function() {

    dizmo.setAttribute("settings/usercontrols/allowResize", true);

    dizmo.subscribeToAttribute("geometry/width",function(p,v) {
    	document.getElementById('title').style.width=(dizmo.getAttribute("geometry/width")-30)+"px";
    	document.getElementById('config').style.width=(dizmo.getAttribute("geometry/width")-30)+"px";
        document.getElementById('ip').style.width=(dizmo.getAttribute("geometry/width")-30)+"px";
    });

    document.getElementById('title').style.width=(dizmo.getAttribute("geometry/width")-30)+"px";
    document.getElementById('config').style.width=(dizmo.getAttribute("geometry/width")-30)+"px";
    document.getElementById('ip').style.width=(dizmo.getAttribute("geometry/width")-30)+"px";

    // Your code should be in here so that it is secured that the dizmo is fully loaded
    document.getElementById('doneBtn').onclick = function() {

		var _title=document.getElementById('title').value;
        if (_title!=='') { dizmo.privateStorage.setProperty("title",_title); }
        var _config=document.getElementById('config').value;
        if (_config!=='') { dizmo.privateStorage.setProperty("config",_config); }
        var _ip=document.getElementById('ip').value;
        if (_ip!=='') { dizmo.privateStorage.setProperty("ip",_ip); }

        dizmo.showFront();
    };

    var title="Drinks";
    var config="";
    var ip="10.0.1.226";

       // try to get values from privateStorage
	var _title=dizmo.privateStorage.getProperty("title");
	var _config=dizmo.privateStorage.getProperty("config");
    var _ip=dizmo.privateStorage.getProperty("ip");

	if (_title) { title=_title; }
	if (_config) { config=_config; }
    if (_ip) { ip=_ip; }

	// set back side inputfield values
	document.getElementById('title').value=title;
	document.getElementById('config').value=config;
    document.getElementById('ip').value=ip;

	dizmo.setAttribute("settings/title",title);

    document.getElementById('front').onclick = function() {
    	console.log("sending ws data:"+config);
    	ws.send(config);
    	DizmoElements('#wait').dmask('show-wait');
    	var done=function() {
    		DizmoElements('#wait').dmask('hide-wait');
    	};
    	// default timeout 10s
    	//setTimeout(done,10000);

    };

    var ws = new WebSocket("ws://"+ip+":80/");

    ws.onmessage = function(evt) {
        window.console.log(evt.data);
        //document.getElementById("msg").innerHTML=evt.data;
        if (evt.data=='DONE') { DizmoElements('#wait').dmask('hide-wait'); }
    };
    ws.onerror = function(evt) {
        window.console.log(evt.data);
        DizmoElements('#wait').dmask('hide-wait');
        DizmoElements('#my-notification').dnotify('info', {
    		title: 'Connection error',      
    		text: 'There was a connection error:'+evt.data,              
		});
        //document.getElementById("msg").innerHTML="ERROR: "+evt.data;
    };
    ws.onclose = function() {
    	DizmoElements('#wait').dmask('hide-wait');
    	DizmoElements('#my-notification').dnotify('info', {
    		title: 'Connection closed',      
    		text: 'The connection was closed.',              
		});
        window.console.log("onclose called");
    };
    ws.onopen = function() {
        window.console.log("onopen called");
    };
});


