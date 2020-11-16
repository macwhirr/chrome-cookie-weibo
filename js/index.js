//var strcookie = document.cookie;
//alert('**' + strcookie )

var background = chrome.extension.getBackgroundPage();
var seturl = localStorage.getItem('seturl');

if(seturl){
	$('#seturl').val(seturl);
}

$('#submit').click(function () {
	var seturl = $('#seturl').val();
	if(seturl.indexOf('http://') != 0 && seturl.indexOf('https://') != 0 ){
		alert('URL有误');
		return;
	}

	localStorage.setItem('seturl', seturl);

    alert(  'ok'  );
	console.log('**22****')
});