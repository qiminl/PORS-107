data = '[{'+
            '"ad_slot_id"   :117,   '+
            '"current_view_count"  :0,'+
            '"current_vt"   :0,     '+
            '"target_vt"    :2000,   '+
            '"current_ve"   :0,     '+
            '"target_ve"    :65     '+
            '"target_view_count" : 0'+
        '}]';

//global variable constructed the request url.
var  id,target_imp, target_view_count, update_view_count, c= 0;
var image_url, click_url, target_view_url = "";

/**
 * Compile data from html form
 */
function getVtVe(){
    var x = document.getElementById("frm1");
    target_view_count = x.target_view_count.value;
    update_view_count = target_view_count - x.current_view_count.value;
    if (target_view_count == 0){
        target_view_count = parseInt(x.current_view_count.value) + 1;
        update_view_count = target_view_count - x.current_view_count.value;
    }
    else if(x.target_ve.value >=100 || x.target_ve.value <0){
        alert ("ve should be in range of [0,100]");
    }else {
        id = x.ad_slot_id.value;
        var vt = x.target_vt.value * target_view_count
            - x.current_vt.value *x.current_view_count.value;
        var ve = x.target_ve.value * target_view_count
            - x.current_ve.value *x.current_view_count.value;
        requestVeVt(id, vt, ve, target_view_count, update_view_count);
    }
}

/**
 * Compile from local data.

function getDataValue() {

    var output = JSON.parse(data);
    target_imp = output[0].target_view_count;
    if (target_view_count<=0 )
        target_view_count = parseInt(output[0].current_view_count) + 1;

    if (target_view_count<=output[0].current_view_count){
        alert ("target_view_count less than current_view_count, wrong data.")
    } else {
        id = output[0].ad_slot_id;
        vt = output[0].target_vt * target_view_count 
            - output[0].current_vt * output[0].current_view_count;
        ve = output[0].target_ve * target_view_count 
            - output[0].current_ve * output[0].current_view_count;
        requestVeVt(id , vt, ve, target_view_count);
    }
}
 */


/**
 * Validate ve && vt value, then start request.
 *
 * @param {int}   id    ad slot id
 * @param {int}   vt    calculated vt value
 * @param {int}   ve    calculated ve value
 */
function requestVeVt(id, vt, ve,target_view_count, update_view_count){    
    console.log("id:",id ," vt:",vt, " ve:", ve);
    var error_message = "";

    if (id <=0 ){
        error_message = "id incorrect, Must have ad slot id.";
        alert (error_message);
    } else if (update_view_count <=0){
        alert ("view count not correctly setted");
    } else if (vt<=100 || ve/target_view_count>100 || ve/target_view_count<=0){
        error_message = "vt value should not be less than 100ms.\n"
        +"ve value should be be >= 100 or <= 0";
        alert ("haha", vt, "hmm:", ve);
        console.log("haha", vt, "hmm:", ve);

    } else {
        var url = "http://adserver.vradx.com/sdk?p=" + id;
        getData(url,checkResponse, vt, ve, update_view_count);
        
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
        throw new Error(" not supportted, change browser maybe? Chrome for exmaple.");
    }
    return  new ActiveXobject(arguments.callee.activeString);
}

/**
 * Use url update vt & ve
 *
 * @param {string}   url        request url
 * @param {[Object]} callback   call back function
 */
function getData(url, callback, vt, ve, update_view_count){
    var xhr =  createXHR(); //新建一个XMLHttpRequest对象
    xhr.open("GET",url);      //打开一个请求
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && callback){
            callback(xhr, vt, ve, update_view_count);    //call back fucntion.
        }
    }
    xhr.send(null);           //send request
}

/**
 * Extract view_stat_url from server respond.
 *
 * @param {XMLHttpRequest}  res     response  
 */
function  checkResponse(res, vt, ve, update_view_count){

    if (res.status === 200){
        var inside = JSON.parse(res.response);
        var view_stat_url = inside[id].view_stat_url;
        if( view_stat_url != null){
            target_view_url = view_stat_url.replace("${VIEW_TIME}", vt/update_view_count);
            target_view_url = target_view_url.replace("${VIEW_EFFECTIVENESS}", ve/update_view_count);
            for (var i =0; i< update_view_count; i++){
                updateVtVe (target_view_url, vt, ve);
            }
        }else{
            target_view_url= null;
            alert ("Check your ID maybe? Null view_stat_url in response : ", view_stat_url);
        }

        if (inside[id].click_url != null){
            click_ulr = inside[id].click_url;
        } else {
            click_url =null; console.log("no click_url");
        }
        
        if (inside[id].image_url != null){
            image_url = inside[id].image_url;
        } else{
            image_url = null; console.log("no image_url");
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
function updateVtVe (url, vt, ve){
    var xhr2 =  createXHR(); 
    xhr2.open("GET",url);   

    if (xhr2.readyState === 1){
        var cc = document.getElementById('cc');
        var number = cc.innerHTML;
        number++;
        cc.innerHTML = number;
        /*
        document.getElementById("demo").innerHTML = target_view_url;
        var message = "Sent vt = " + vt + "; ve = " + ve +
            "\nExpected value: vt= "+ vt/target_view_count + "; ve = " + 
            ve/target_view_count + ";  imp = " + target_view_count;
        alert(message);
        */
    }              
    xhr2.send(null);     
    console.log(xhr2);   
}
