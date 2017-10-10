String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

mermaidAPI.initialize({
    startOnLoad:false
});
mermaid.parseError = function(err,hash){
    console.log('mermaid.parseError: ', err);
};
mermaidAPI.parseError = function(err,hash){
    console.log('mermaid.parseError: ', err);
};


var PRE_CONTENT_LIST = [];

//// function start

function show_sequence_diagram(pos) {
    var data = PRE_CONTENT_LIST[pos];
    // console.log('show_sequence_diagram', pos, data);
    var diagram = Diagram.parse(data);
    $("#__diagram_result_container_"+pos).html('');
    diagram.drawSVG("__diagram_result_container_"+pos, {theme: 'simple'});
}

function show_flowchart_diagram(pos) {
    var data = PRE_CONTENT_LIST[pos];
    // console.log('show_flowchart_diagram', pos, data);
    var diagram = flowchart.parse(data);
    $("#__diagram_result_container_"+pos).html('');
    diagram.drawSVG("__diagram_result_container_"+pos);
}

function show_mermaid_diagram(pos) {
    var data = PRE_CONTENT_LIST[pos];
    console.log('show_mermaid_diagram', pos, data);

    var element = document.querySelector("#__diagram_result_container_"+pos);
    
    var insertSvg = function(svgCode, bindFunctions){
        element.innerHTML = svgCode;
        console.log('show_mermaid_diagram result:', svgCode)
    };

    var graphDefinition = data;
    var graph = mermaidAPI.render("__diagram_mermaid_result_"+pos, graphDefinition, insertSvg); // 第一个参数是生成的svg的id
}

function dowbload_current_fullcreen_svg() {
    
    var svg = $('#__diagram_fullscreen_svg_container svg')[0];
    var width = parseInt(svg.width.baseVal.value);
    var height = parseInt(svg.height.baseVal.value);
    var xml = '<?xml version="1.0" encoding="utf-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"><svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" xmlns:xlink="http://www.w3.org/1999/xlink">' + svg.innerHTML + '</svg>';

    var a = document.createElement("a");
    a.download = "diagram.svg";
    a.href = "data:image/svg+xml," + encodeURIComponent(xml);
    a.click();
}

//// function end

$("pre").each(function(i,obj){
    var $pre = $(this);
    PRE_CONTENT_LIST.push($pre.text());
    // 添加div容器
    if ($('#__diagram_result_container_{0}'.format(i)).length == 0) {
        $pre.after("<div class='__diagram_result_container' id='__diagram_result_container_{0}' style='display:block; max-width:100%;overflow-x:auto;'></div>".format(i));
    }
    // console.log('class: ', $pre.attr('lang'));
    var lang = $pre.attr('lang');
    if (lang == 'sequence') {
        try{
            show_sequence_diagram(i);
        } catch (err) {
            console.log(err);
        }
    } else if (lang == 'flow') {
        try {
            show_flowchart_diagram(i);
        } catch (err) {
            console.log(err);
        }
    } else if (lang == 'mermaid') {
        show_mermaid_diagram(i);  // todo 需要调整css，否则会影响其他元素
    }
    
});

//// fullscreen

if ($('#__diagram_fullscreen_container').length == 0) {
    $('body').append("<div id='__diagram_fullscreen_container' class='__diagram_fullscreen_container_hide'><div id='__diagram_fullscreen_op_container'><button id='__diagram_fullscreen_download_btn'>Download</button><button id='__diagram_fullscreen_close_btn'>Close</button></div><div id='__diagram_fullscreen_svg_container'></div></div>")

    $('div .__diagram_result_container').dblclick(function(eve){
        console.log('dblclick');
        var svgCode = $(eve.currentTarget).html();
        console.log(svgCode);
        $('#__diagram_fullscreen_container').removeClass('__diagram_fullscreen_container_hide')
                                            .addClass('__diagram_fullscreen_container_show');
        $('#__diagram_fullscreen_svg_container').html(svgCode);
    });

    $('#__diagram_fullscreen_close_btn').click(function(eve){
        $('#__diagram_fullscreen_container').removeClass('__diagram_fullscreen_container_show')
        .addClass('__diagram_fullscreen_container_hide');
    });

    $('#__diagram_fullscreen_download_btn').click(function(eve){
        dowbload_current_fullcreen_svg();
    });
}
