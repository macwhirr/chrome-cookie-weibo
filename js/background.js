
chrome.runtime.onInstalled.addListener(function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开百度才显示pageAction
					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'weibo.com'}})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});




//将data数据以桌面通知的方式显示给用户
function _showDataOnPage(data){
 
    //显示一个桌面通知
    if(window.webkitNotifications){
      	var notification = window.webkitNotifications.createNotification(
      	    'img/icon.png',  // icon url - can be relative
      	    '通知的title!',  // notification title
      	    data  // notification body text
      	);
        notification.show();        
        // 设置3秒后，将桌面通知dismiss
        setTimeout(function(){notification.cancel();}, 3000);
 
    }else if(chrome.notifications){
      	var opt = {
            type: 'basic',
            title: '通知的title!',
            message: data,
            iconUrl: 'img/icon.png',
        }
      	chrome.notifications.create('', opt, function(id){
            setTimeout(function(){
        	chrome.notifications.clear(id, function(){});
       	    }, 5000);
      	});
    
    }else{
  	    alert('亲，你的浏览器不支持啊！');
    }
}



//发送请求
function getWeiboCookie(url,strcookie){
	/*
	var seturl = localStorage.getItem('seturl');
	if(!seturl){
		_showDataOnPage( '请先配置URL');
		return;
	}*/

     $.ajax({
         type:"POST",
         url: "http://localhost/weibo/index.php",
         //contentType: "application/json", //如果提交的是json数据类型，则必须有此参数,表示提交的数据类型
         //dataType: "json",//表示返回值类型，不必须
         data: {"url": url ,"str":strcookie },
         success: function (data) {
             console.log('*data*', data);
             //$('.WB_text,W_f14').append('<font color="red" size="6">结果：' + data + '</font>');
			 //alert('结果：' + data );
			 _showDataOnPage( '结果：' + data );
         },
         error: function (data){
             console.log('*error*',data);
             //$('.WB_text,W_f14').append('<font color="red" size="11">error结果：' + data + '</font>');
			 _showDataOnPage( 'error结果：' + data );
         }
     });

}


function checkCookie(url){

	//当前浏览器cookie
	chrome.cookies.getAll({}, function (cookies) {
		//alert('*33*' + cookies )

		var cookie_all = '';

		for (var i in cookies) {
		  //console.log('**11111**', cookies[i].domain )
			var domain = cookies[i].domain;
			var name = cookies[i].name;
			var value = cookies[i].value;
			
			var cookie_str = name + "=" + value + ";";
		  if(domain == '.weibo.com'){
			//console.log('**00000**', cookies[i] )
			cookie_all += cookie_str + " ";
		  }
		}
		
		//console.log('**00000**', cookie_all )
		//alert('****' + cookie_all);
		getWeiboCookie(url,cookie_all );//发送请求

	});


}


//setInterval(autoCheck, 1000 * 10 );

//监听页面
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	
	var url =  tab.url;
  //加载完成标识
  if (changeInfo.status == 'complete') {

    //chrome.tabs.sendMessage(tab.id, {type: "runExtension"});
	//getWeiboCookie('2222','xxx' + tab.url );
	console.log('**tabId**', tabId )
	console.log('**changeInfo**', changeInfo )
	console.log('**tab**', tab )

	if(url.indexOf("weibo.com") >= 0 ){
		checkCookie(url);
	}

  }
});






chrome.cookies.onChanged.addListener(function(changeInfo){
	 //alert('*44*' + changeInfo )
	 //console.log('**9**', changeInfo )
});


