//Original code by Alex Marandon
//http://alexmarandon.com/articles/web_widget_jquery/

(function() {

var server = "localhost:3000";

// Localize jQuery variable
var jQuery;

// Load jQuery if not present 
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
  var script_tag = document.createElement('script');
  script_tag.setAttribute("type","text/javascript");
  script_tag.setAttribute("src",
    "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js");
  if (script_tag.readyState) {
    script_tag.onreadystatechange = function () { // For old IE
      if (this.readyState == 'complete' || this.readyState == 'loaded') {
        scriptLoadHandler();
      }
    };
  } else { // Other browsers
    script_tag.onload = scriptLoadHandler;
  }
  // Try to find the head, otherwise default to the documentElement
  (document.getElementsByTagName("head")[0] || 
    document.documentElement).appendChild(script_tag);
} else {
  // The jQuery version on the window is the one we want to use
  jQuery = window.jQuery;
  main();
}

/* Called once jQuery has loaded */
function scriptLoadHandler() {
  // Restore $ and window.jQuery to their previous values and store the
  // new jQuery in our local jQuery variable
  jQuery = window.jQuery.noConflict(true);
  main(); 
}

/******** Our main function ********/
function main() { 
window.wns = (window.wns || {});
  jQuery(document).ready(function($) { 
    var widgetAnchor = $('#example-widget-anchor');
    $(widgetAnchor).after('<div id="example-widget-container"></div>');
    var widgetContainer = $('#example-widget-container');
    widgetContainer.html('Server Script Loaded');
    
    wns.callbackFunction = function(data){
      widgetContainer.html('Waiting For JSONP Data To Load');
      widgetContainer.html(data.html);
    }
 
    function crossDomainGet(){
      var dataUrl = "http://" + server + "/javascripts/data.js?callback=callbackFunction";
      // $.getJSON(dataUrl, function(data){
        // widgetContainer.html('Server Data Loaded');
      // });
      $.ajax({
        url: dataUrl,
        dataType: "jsonp",
        type: "GET",
        cache: true,
        jsonp: false,
        jsonpCallback: "wns.callbackFunction"
      });
    }

    crossDomainGet();
  });
}

//Origninal code by Dan Fabulich
//http://stackoverflow.com/questions/298745/how-do-i-send-a-cross-domain-post-request-via-javascript
function crossDomainPost() {
  // Add the iframe with a unique name
  var iframe = document.createElement("iframe");
  var uniqueString = "CHANGE_THIS_TO_SOME_UNIQUE_STRING";
  document.body.appendChild(iframe);
  iframe.style.display = "none";
  iframe.contentWindow.name = uniqueString;

  // construct a form with hidden inputs, targeting the iframe
  var form = document.createElement("form");
  form.target = uniqueString;
  form.action = "http://INSERT_YOUR_URL_HERE";
  form.method = "POST";

  // repeat for each parameter
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "INSERT_YOUR_PARAMETER_NAME_HERE";
  input.value = "INSERT_YOUR_PARAMETER_VALUE_HERE";
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
}

})(); // We call our anonymous function immediately
