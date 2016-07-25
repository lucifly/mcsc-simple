var express = require('express');
var router = express.Router();

serhtml = "<marquee  class='shadow' style='HEIGHT: 180px; padding:10px; border:1px solid #ddd' scrollamount='2' direction='up' ><h>2016年6月8日</h><p>北京 晴 30度</p><p>尾号限行4和9</p><p>天气炎热</p><p>小心中暑</p><p>应用接入数:1	服务调用次数:34</p></marquee>";


var ServLib = require('../model/serviceslib.json');
/* GET pizzahub page. */
router.get('/', function (req, res, next) {
    console.log("-[info] get pizzahub ");
    res.render('pizzahub', { title: 'PizzaHub', servlib: ServLib, servinfo: serhtml, layout: false });
});

/**get service info */
router.get('/service', function (req, res, next) {

    console.log("-[info] query services library and get service : " + req.query.servername);
    var widgetid = require('../action/subscribetable.js').add_unique_item(req.query.servername, req.query.servername);
	var optionresult = require('../action/idtoservice.js').additem(widgetid,req.query.servername);
	if(optionresult != 0){
		console.log("--[error] something wrong when add item to widgetid_service_table");
	}
	var serverinfo = require('../model/server.js').get_services_info_form_lib("name", req.query.servername);
	if (serverinfo == "404")
		res.render('notfind', { title: '404', layout: false });
    if (req.query.servername == "map") {
        res.render('mapapi', { title: 'mapapi', widgetid: widgetid, layout: false });
    }
    else {
		var datasource = require('../model/entity.js').find_entity_for_service(req.query.servername);
       	if (datasource.length == 0) 
			   console.log("no entities");
		else
			res.render('bindsrc', { title: 'bindsrc', info: serverinfo, datasource: datasource, widgetid: widgetid, layout: false });
    }
});

router.get('/bindsrc', function (req, res, next) {
    console.log("-[info] bind entity to widght ");
	var servername = require('../action/idtoservice.js').getitem(req.query.weight);
	var result = require('../action/subscribetable.js').modifyitem(req.query.weight, req.query.src);
 	res.render(servername, { title: servername, entity:req.query.src, layout: false });
});

router.get('/screensave', function (req, res, next) {
    console.log("-[info] get screen info");
	req.query.screenhtml =  (req.query.screenhtml).replace(/\n/g,""); 
	var result = require('../DAOfunction/screendata.js').additem(req.query.name, req.query.screenhtml);
	console.log(result);
 	res.end();
});

router.get('/screenload', function (req, res, next) {
    console.log("-[info] load screen info");
	var result = require('../DAOfunction/screendata.js').getitem(req.query.name);
	var data = {};
	data.code = 0;
	if( result < 0 ){data.code = 400;}
	else
	{
		data.code = 200;
		data.html = result;
	}
    var json_string = JSON.stringify(data);
 	res.end(json_string);
});

module.exports = router;
