Loader = (function() {
    
      var group_queue = [];      // group list
      var current_group_finished = 0;  
      var finish_callback;
      var finish_context;
    
      var loadFinished = function() {
        current_group_finished ++;
        if (current_group_finished == group_queue[0].length) {
          next_group();
          loadGroup();
        }
      };
    
      var next_group = function() {
        group_queue.shift();
      };
    
      var loadError = function(oError) {
        console.error("The script " + oError.target.src + " is not accessible.");
      };
    
      var loadScript = function(path) {
        console.log("load "+path);
        var script = document.createElement('script');
        script.type = "text/javascript";
    
        if (script.readyState){  //IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                    script.onreadystatechange = null;
                    loadFinished();
                }
            };
        } else {  //Others
            script.onload = function(){
                loadFinished();
            };
        }
    
        script.onerror = loadError;
    
        script.src = chrome.extension.getURL('inject/'+path)
        document.body.appendChild(script);
      };
    
      var loadGroup = function() {
        if (group_queue.length == 0) {
          finish_callback.call(finish_context);
          return;
        }
        current_group_finished = 0; 
        for (var idx=0; idx < group_queue[0].length; idx++) {
          loadScript(group_queue[0][idx]);
        }
      };
    
      var addGroup = function(url_array) {
        if (url_array.length > 0) {
          group_queue.push(url_array);
        }
      };
    
      var fire = function(callback, context) {
        finish_callback = callback || function() {};
        finish_context = context || {};
        loadGroup();
      };
    
      var instanceAPI = {
        load : function() {
          addGroup([].slice.call(arguments));
          return instanceAPI;
        },
    
        done : fire,
      };
    
      return instanceAPI;
    
    })();  // end Loader

// $('head').append($('<link>')
//     .attr("rel","stylesheet")
//     .attr("type","text/css")
//     .attr("href", chrome.extension.getURL('inject/mermaid.forest.min.css')));

Loader.load('jquery.js')
.load('mermaid.min.js')
.load('mermaidAPI.min.js')
.load('webfont.js')
.load('snap.svg-min.js')
.load('raphael.min.js')
.load('underscore-min.js')
.load('sequence-diagram-min.js')
.load('flowchart.js')

.load('main.js')
.done(function(){console.log(this.msg)}, {msg: 'finished'});