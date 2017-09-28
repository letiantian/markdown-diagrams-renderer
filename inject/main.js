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
    // console.log('show_mermaid_diagram', pos, data);

    var element = document.querySelector("#__diagram_result_container_"+pos);
    
    var insertSvg = function(svgCode, bindFunctions){
        element.innerHTML = svgCode;
    };

    // var graphDefinition = 'graph TB\na-->b';
    var graphDefinition = data;
    var graph = mermaidAPI.render("__diagram_result_container_"+pos, graphDefinition, insertSvg);

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
        // show_mermaid_diagram(i);
    }
    
    // try{
    //     show_sequence_diagram(i);
    // } catch (err) {
    //     try {
    //         show_flowchart_diagram(i);
    //     } catch (err) {
    //         // show_mermaid_diagram(i);
    //     }

    // }
    
});

//// fullscreen

$('body').append("<div id='__diagram_fullscreen_container' class='__diagram_fullscreen_container_hide'><div id='__diagram_fullscreen_op_container'><button id='__diagram_fullscreen_close_btn'>Close</button></div><div id='__diagram_fullscreen_svg_container'></div></div>")

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
