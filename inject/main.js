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
    $pre.after("<div id='__diagram_result_container_{0}' style='display:block; max-width:100%;overflow-x:auto;'></div>".format(i));
    // console.log('class: ', $pre.attr('lang'));
    var lang = $pre.attr('lang');
    if (lang == 'sequence') {
        try{
            show_sequence_diagram(i);
        } catch (err) {

        }
    } else if (lang == 'flow') {
        try {
            show_flowchart_diagram(i);
        } catch (err) {
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
