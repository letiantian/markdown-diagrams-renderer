$("#render_btn").click(function () {
    console.log('click test btn');
	chrome.tabs.executeScript(null, {file:"/jquery.js"});
    chrome.tabs.executeScript(null, {file:"/content.js"});

});