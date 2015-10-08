// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var url;
var fixedprice;
var uid;

function queryCard(e) {
	$("#queryBtn").html("正在查询......");
	$("#queryBtn").addClass("disabled");
	$("#loader").show();
	chrome.tabs.getSelected(function(tabs){
		url=tabs.url;
		uid = /[\d]{4,8}/.exec(url)[0];
		chrome.extension.sendMessage({cmd: "getFixedPrice"},function(response) {
			if(response.fixedprice){
				fixedprice=response.fixedprice;
			}
		});
	});
}

function loadAuctionInfo(){
	var cardid=$("#cardid").val();
	var url = "http://auction.jd.com/json/paimai/bid_records?t=1423120170095&dealId=9675376&pageNo=1";
	    $.getJSON(url, {
	      pageSize:8
	      }).done(
	      function(data) {
			  
        });
}

function buildContent(data){
	var cardid=data.cid;
	var suc=data.suc;
	var cs=data.cs;
	var vip=data.vip;
	var multi=data.multi;
	var money=data.money;
	var cardtype=data.cardtype;
	var cardtypeinfo=data.cardtypeinfo;
	var overtime=data.overtime;
	var status=data.status;
	var cinfo=data.cinfo;
	var cdate=data.cdate;
	$("#cardDiv").html(cardid);
	loadAnimate();

}

function loadAnimate(){
		var $this = $("#container");
              if ($this.hasClass("open")) {
                     $('#queryDiv').animate({left: "0"});
                     $('#cardDiv').animate({left: "100%"});
                     $this.removeClass("open");
              }
              else {
                     $('#queryDiv').animate({left: "-100%"});
                     $('#cardDiv').animate({left: "0"});
                     $this.addClass("open");
              }
}

$(document).ready(function() {
	$("#queryBtn").bind("click",queryCard);
});

