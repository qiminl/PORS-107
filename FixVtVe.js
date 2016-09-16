data = '[{'+
            '"ad_slot_id"   :117,   '+
            '"current_imp"  :1,    '+
            '"current_vt"   :0,     '+
            '"target_vt"    :500,   '+
            '"current_ve"   :0,     '+
            '"target_ve"    :40     '+
        '}]';

//global variable constructed the request url.
var vt, ve, target_url, id = "";

/**
 * Compile data from html form
 */
function getFormValue(){

    var x = document.getElementById("frm1");
    var i;
    var text="";
    for (i = 0; i < x.length ;i++) {
        text += x.elements[i].value;
    }

    document.getElementById("demo").innerHTML = x.ad_slot_id.value;
}

/**
 * Compile data from data locally.
 */
function getDataValue() {

    var output = JSON.parse(data);
    id = output[0].ad_slot_id;

    vt = output[0].target_vt * (output[0].current_imp+1) 
        - output[0].current_vt * output[0].current_imp;
    ve = output[0].target_ve * (output[0].current_imp+1) 
        - output[0].current_ve * output[0].current_imp;

    console.log("vt:",vt, "ve:", ve);
    var url = "http://adserver.vradx.com/sdk?p=" + id;
    startRequest(url);
}

function startRequest(url){
    getData(url,checkResponse);
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
            console.log(target_url);
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
 * @param {string}   url        request url
 */
function updateVtVe (url){
    console.log(url);
    var xhr =  createXHR(); 
    xhr.open("GET",url);      
    xhr.send(null);          
    console.log(xhr.status);
}