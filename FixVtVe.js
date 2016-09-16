data = '[{'+
            '"ad_slot_id"   :117,   '+
            '"current_imp"  :1,    '+
            '"current_vt"   :0,     '+
            '"target_vt"    :500,   '+
            '"current_ve"   :0,     '+
            '"target_ve"    :40     '+
        '}]';

//global variable constructed the request url.
var vt, ve, id =0;
var target_url = "";

/**
 * Compile data from html form
 */
function getFormValue(){
    var x = document.getElementById("frm1");
    id = x.ad_slot_id.value;
    vt = x.target_vt.value * (x.current_imp.value+1) 
        - x.current_vt.value * x.current_imp.value;
    ve = x.target_ve.value * (x.current_imp.value+1) 
        - x.current_ve.value * x.current_imp.value;

    startRequest(id, vt, ve);
}

/**
 * Compile from local data.
 */
function getDataValue() {

    var output = JSON.parse(data);
    id = output[0].ad_slot_id;
    vt = output[0].target_vt * (output[0].current_imp+1) 
        - output[0].current_vt * output[0].current_imp;
    ve = output[0].target_ve * (output[0].current_imp+1) 
        - output[0].current_ve * output[0].current_imp;

    startRequest(id, vt, ve);
}
/**
 * Use url update vt & ve
 *
 * @param {int}   id    ad slot id
 * @param {int}   vt    calculated vt value
 * @param {int}   ve    calculated ve value
 */
function startRequest(id, vt, ve){    
    console.log("id:",id ," vt:",vt, " ve:", ve);
    if (vt<=100 || ve>100 || ve<=0){
        var error_message = "vt value should not be less than 100ms.\n"
        +"ve value should be be >= 100 or <= 0";
        alert (error_message);
    }
    else if (id <=0 ){
        var error_message = "id incorrect";
        alert (error_message);
    }
    else {
        var url = "http://adserver.vradx.com/sdk?p=" + id;
        getData(url,checkResponse);
    }
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
 * Use url update vt & ve
 *
 * @param {string}   url        request url
 * @param {[Object]} callback   call back function
 */
function getData(url, callback){
    var xhr =  createXHR(); //新建一个XMLHttpRequest对象
    xhr.open("GET",url);      //打开一个请求
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && callback){
            callback(xhr);    //call back fucntion.
        }
    }
    xhr.send(null);           //send request
}

/**
 * Extract view_stat_url from server respond.
 *
 * @param {XMLHttpRequest}  res     response  
 */
function  checkResponse(res){

    if (res.status === 200){
        var inside = JSON.parse(res.response);
        var view_stat_url = inside[id].view_stat_url;

        if( view_stat_url != null){
            target_url = view_stat_url.replace("${VIEW_TIME}", vt);
            target_url = target_url.replace("${VIEW_EFFECTIVENESS}", ve);
            document.getElementById("demo").innerHTML = target_url;
            updateVtVe (target_url);
        }else{
            alert ("Null view_stat_url in response : ", view_stat_url);
        }
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
function updateVtVe (url){
    var xhr =  createXHR(); 
    xhr.open("GET",url);      
    xhr.send(null);          
    console.log("xhr status: ", xhr.status);
}