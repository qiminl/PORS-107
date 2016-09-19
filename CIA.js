data = '[{'+
            '"ad_slot_id"   :117,   '+
            '"current_imp"  :0,    '+
            '"target_imp"   :-1,    '+
            '"current_vt"   :0,     '+
            '"target_vt"    :2000,   '+
            '"current_ve"   :0,     '+
            '"target_ve"    :65     '+
        '}]';

//global variable constructed the request url.
var vt, ve, id= 0;
var image_url, click_url, target_view_url = "";


function getClickImpAcq(){
    var x = document.getElementById("frm1");
    var error_message = "";

    if (x.target_acq.value > x.target_click.value){
		error_message = "target acq is larger than click, which might not make sense.";
        alert (error_message);
    } else {
        id = x.ad_slot_id.value;
        click = x.target_click.value - x.current_click.value;
        imp = x.target_imp.value - x.current_imp.value;
        acq = x.target_acq.value - x.current_acq.value;
        requestImpClickAcq(id, imp, click, acq);
        
    }
}

/**
 * convert, calculate, and distribute task
 *
 * @param {int}   id    ad slot id
 * @param {int}   vt    calculated vt value
 * @param {int}   ve    calculated ve value
 */
function requestImpClickAcq(id, imp, click, acq){
    var error_message = "";
    var url = "http://adserver.vradx.com/sdk?p=" + id;
    if (id <=0 ){
        error_message = "id incorrect, Must have ad slot id.";
        alert (error_message);
    } else if (imp<0 || click <0 || acq < 0){
        error_message = "some value gone wrong, you have negative count right now.";
        alert (error_message);
    } else if (imp > 5000 || click >1000 || acq >1000){
        error_message = "For sercure reason, we should not generate more than imp5k/click1k/acq1k each time.";
        alert (error_message);
    } else {
    	getData(url,checkResponse, imp, click, acq);
	}

}
/**
 * Use url update vt & ve
 *
 * @param {string}   url        request url
 * @param {[Object]} callback   call back function
 */
function getData(url, callback, imp, click, acq){
    var xhr =  createXHR(); //新建一个XMLHttpRequest对象
    xhr.open("GET",url);      //打开一个请求
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && callback){
            callback(xhr, imp, click, acq);    //call back fucntion.
        }
    }
    xhr.send(null);           //send request
}
/**
 * Create XMLHttpRequest connection object.
 */
function createXHR(){
    if( typeof  XMLHttpRequest != "undefined"){
        return  new XMLHttpRequest();
    }
    if(typeof ActiveXobject == "undefined"){
        throw new Error(" not support, change browser maybe? Chrome for exmaple.");
    }
    return  new ActiveXobject(arguments.callee.activeString);
}

/**
 * Extract view_stat_url from server respond.
 *
 * @param {XMLHttpRequest}  res     response  
 */
function  checkResponse(res,imp, click, acq){

    if (res.status === 200){

        var inside = JSON.parse(res.response);
        var view_stat_url = inside[id].view_stat_url;
        if( view_stat_url != null){
            target_view_url = view_stat_url.replace("${VIEW_TIME}", vt);
            target_view_url = target_view_url.replace("${VIEW_EFFECTIVENESS}", ve);
        }else{
            target_view_url= null;
            alert ("Null view_stat_url in response : ", view_stat_url);
        }

        if (inside[id].click_url != null){
            click_url = inside[id].click_url;
        } else {
            click_url =null; console.log("no click_url");
        }
        
        if (inside[id].image_url != null){
            image_url = inside[id].image_url;
            for (var i=0; i<imp; i++){
                generateData(image_url);
            }
        } else{
            image_url = null; console.log("no image_url");
        }

        console.log(image_url, click_url, target_view_url);
        var url = "http://adserver.vradx.com/sdk?p=" + id;
        var i = 0;
        console.log("done: imp=",imp);
        for (i= 0; i< imp; i++){
            generateData(url);
        }
        
        for (i= 0; i< click; i++){
            generateData(click_url);
        }

        console.log("done: i=", i);

    }
    else{
        alert ("request faild, code = ", res.status);
    }
}


/**
 * use url update vt & ve
 *
 * @param {string} url   request url
 */
function generateData (url){
    var xhr2 =  createXHR(); 
    xhr2.open("GET",url);                 
    xhr2.send(null);     
}