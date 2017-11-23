

var express = require('express'),
	http = require('http'),
    app = express();


app.set('port', 8080);
app.use(express.static('./'));

http.createServer(app).listen(app.get('port'), function () {
	console.info("start");
});



app.get('/data',function(req, res, next) {



	var current_page   = getParam(req.url,"current_page") || 1,
		limit  = getParam(req.url,"limit") || 10,
		type   = getParam(req.url,"type") || "top",
		app_code = "d8a532efc8c84e29bf3ce9dc0e99dd6b",
		url    = "http://toutiao-ali.juheapi.com/toutiao/index?type="+type+"&AppCode="+app_code,
	 	header = {
	 		hostname: "toutiao-ali.juheapi.com",
			port: 80,
			path: url,
			method: "get",
			headers: { 
				"Content-Type":  "application/json;charset=UTF-8",
				"Authorization": "APPCODE "+app_code

			}
	 	},
	    req = http.request(header, function (_res) {

			_res.setEncoding('utf-8');
			var resdata  = "" ;
			_res.on('data', function (ret) {
				resdata+=ret;
			});
			_res.on('end', function () {
				end(res,resdata);
			});

		}), 
		end = function(_res , resdata) {



			try {

				 

				var json = JSON.parse(resdata),
					total_count = json.result.data.length,
					ret  = {
						error_code: 0,
						reason: "成功的返回",
						result: {
							state: 1,
							data: [],
							pagination : {
								current_page: current_page,
								limit: limit,
								total_count: total_count,
								total_page:  Math.ceil(total_count / limit )
							}

						}

					}

				json.result.data.map(function(d,i){
					if(i+1 > (current_page-1) *limit  &&  i+1 <= limit*current_page ){
						ret.result.data.push(d);
					}
				});

		    	_res.writeHead(200, {
					"Content-Type": "application/json;charset=utf-8"
				});
				_res.end(JSON.stringify(ret));
			
			} catch (e) {

				_res.end("err");
			}
		
		};
		req.on('error', function (e) {
			
			_res.end("err");

		});
		req.end();
	



});


var getParam =function(url,name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		if(url.split("?").length>1){
			url = url.split("?")[1];
			var r = url.match(reg);
			if (r!=null) return unescape(r[2]); return null;
		}
		return null;
}