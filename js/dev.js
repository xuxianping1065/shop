var fiexedprice;

var auctionTimer = null;
var auctionInterval = null;
var buyInterval = null;
var addr = document.location.href;
var started = false;
var uid = /[\d]{4,8}/.exec(addr)[0];

function init() {
	// fiexedprice
	fiexedprice = $("del").html();
	fiexedprice = parseInt(/\d+/.exec(fiexedprice));
	// user
	var initPrice = parseInt(fiexedprice * 0.6);
	var linkUser = $(".link-user").html();
	if (typeof (linkUser) == "undefined") {
		linkUser = "xuxianping1065";
	}
	if( linkUser.length > 12 ){
		linkUser = linkUser.substr(0,12);
	}
	
	// html
	var html = '<div class="form-inline">'
			+ '<div class="form-group"> '
			+ '<label for="max_price">最高价格</label><input type="text" class="form-control" id="max_price" value="' + initPrice + '" placeholder="最高价格">'
			+ '<label for="nick_name">用户昵称</label><input type="text" class="form-control" id="nick_name" value="' + linkUser + '" placeholder="用户昵称">'
			+ '<label for="raise_price">加价</label><input type="text" class="form-control" id="raise_price" value="2" placeholder="加价">'
			+ '<label for="get_price_time">拿价时间</label><input type="text" class="form-control" id="get_price_time" value="2000" placeholder="拿价时间">'
			+ '<label for="interval_time">拿价间隔时间</label><input type="text" class="form-control" id="interval_time" value="200" placeholder="拿价间隔时间">'
			+ '</div>'
			+ '<button type="button" class="btns btn-primary" id="btn_start">开始</button>'
			+ '<button type="button" class="btns btn-default" id="btn_cancel" style="display:none">取消</button>'
			+ '<div id="msgDiv"  class="form-group"></div></div>';
	$('body').prepend(html);

	// evet
	$("#btn_start").bind("click", startAuction);
	$("#btn_cancel").bind("click", stopAuction);

}

function startAuction(e) {
	$("#btn_start").hide();
	$("#btn_cancel").show();
	
	// start Auction Interval
	queryPrice();
	
	// strat Auction Timer
	stratAuctionTimer();
	started = true;
}

function stopAuction(e) {
	$("#btn_start").show();
	$("#btn_cancel").hide();
	$("#msgDiv").html('');
	stopBuy();

}

function stopBuy() {

	if (auctionTimer) {
		clearTimeout(auctionTimer);
	}
	
	if (buyInterval) {
		clearInterval(buyInterval);
	}
}

function queryPrice() {
	var currentPrice;
	var currentNickName;
	var nickname = $("#nick_name").val();
	var maxPrice = $("#max_price").val();
	var time = new Date().getTime();
	var queryUrl = "http://paimai.jd.com/json/current/englishquery?paimaiId="+ uid + "&skuId=0&start=0&end=1&t=" + time;
	
	$.get(queryUrl,function(data) {
			if (data){
						currentPrice = data.currentPrice * 1;
						currentNickName = data.currentUser;
		
						$("#msgDiv").html('<div class="alert alert-success" role="alert">当前价格：￥'
										+ currentPrice + '&emsp;出价人：'
										+ currentNickName + '</div>');
						console.log("time:" + data.remainTime + "  price:" + currentPrice+"  username:"+currentNickName);
						
						if( nickname.indexOf(currentNickName) != -1 ){
							// console.log("%c目前最高出价人还是你！", "color:red;");
							$("#msgDiv").html('<div class="alert alert-success" role="alert">目前最高出价人还是你!</div>');
						} else if( currentPrice > maxPrice ){
							// console.log("%c超出限定价格停止抢购！", "color:red;");
							$("#msgDiv").html('<div class="alert alert-danger" role="alert">超出限定价格停止抢购！</div>');
							started = false;
							stopBuy();
						}
						
					}

				});
	
}

function buyNow() {
	var price;
	var currentPrice;
	var currentNickName;
	var nickname = $("#nick_name").val();
	var maxPrice = $("#max_price").val();
	var time = new Date().getTime();
	
	var queryUrl = "http://paimai.jd.com/json/current/englishquery?paimaiId="+ uid + "&skuId=0&start=0&end=1&t=" + time;
	$.get(queryUrl, function(data) {
		currentPrice = data.currentPrice * 1;
		currentNickName = data.currentUser;
		
		console.log("time:" + data.remainTime + "  price:" + currentPrice+"  username:"+currentNickName);
		price = currentPrice + $("#raise_price").val();
		if (currentPrice <= maxPrice && nickname.indexOf(currentNickName) == -1 ) {
			var buyUrl = "http://paimai.jd.com/services/bid.action?t=" + time+ "&proxyFlag=0&bidSource=0&paimaiId=" + uid + "&price="+ price;
			$.get(buyUrl, function(data) {
				sayMsg(data, price);}, 'json');
		} else {
			console.log("%c超出限制价格,停止抢购！", "color:red;");
			console.log("time:" + data.remainTime + "  price:" + currentPrice+"  username:"+currentNickName);
			started = false;
			stopBuy();
		}
	});

}

function stratAuctionTimer() {
	var remainTime;
	var offset = $("#get_price_time").val();
	var intervalTime = $("#interval_time").val();

	var queryUrl = "http://paimai.jd.com/json/current/englishquery?paimaiId="+ uid + "&skuId=0&start=0&end=1&t=" + new Date().getTime();
	$.get(queryUrl, function(data) {
		remainTime = data.remainTime;
		var overtime = remainTime - offset;
		console.log("overtime:"+overtime);
		if(overtime>1){
			auctionTimer = setTimeout(function() {
				buyInterval = window.setInterval(function() {
					buyNow();
				}, intervalTime);
			}, overtime);
		}
		
		
	});
}


function sayMsg(data, price) {
	printMsg(data.message);
	if(data.result=="200"){
		stopBuy();
	}else{
		stopBuy();
	}
}

function printMsg(msg) {
	started = false;
	console.log(" %c " + msg, "color:red;")
	$("#msgDiv").html('<div class="alert alert-info role="alert">' + msg + '</div>');
}

$(document).ready(function() {
	init();
});