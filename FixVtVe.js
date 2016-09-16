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
var vt, ve, id,target_imp= 0;
var image_url, click_url, target_view_url = "";

/**
 * Compile data from html form
 */
function getVtVe(){
    var x = document.getElementById("frm1");
    target_imp = x.target_imp.value ;
    //test for target imp
    if (target_imp<=0 )
        target_imp = parseInt(x.current_imp.value) + 1;

    if (target_imp<=x.current_imp.value){
        alert ("target_imp less than current_imp, wrong data.")
    } else {
        id = x.ad_slot_id.value;
        vt = x.target_vt.value * target_imp
            - x.current_vt.value * x.current_imp.value;
        ve = x.target_ve.value * target_imp
            - x.current_ve.value * x.current_imp.value;
        requestVeVt(id, vt, ve, target_imp);
    }
}

/**
 * Compile from local data.
 */
function getDataValue() {

    var output = JSON.parse(data);
    target_imp = output[0].target_imp;
    if (target_imp<=0 )
        target_imp = parseInt(output[0].current_imp) + 1;

    if (target_imp<=output[0].current_imp){
        alert ("target_imp less than current_imp, wrong data.")
    } else {
        id = output[0].ad_slot_id;
        vt = output[0].target_vt * target_imp 
            - output[0].current_vt * output[0].current_imp;
        ve = output[0].target_ve * target_imp 
            - output[0].current_ve * output[0].current_imp;
        requestVeVt(id , vt, ve, target_imp);
    }
}



/**
 * Validate ve && vt value, then start request.
 *
 * @param {int}   id    ad slot id
 * @param {int}   vt    calculated vt value
 * @param {int}   ve    calculated ve value
 */
function requestVeVt(id, vt, ve, target_imp){    
    console.log("id:",id ," vt:",vt, " ve:", ve);
    var error_message = "";

    if (id <=0 ){
        error_message = "id incorrect, Must have ad slot id.";
        alert (error_message);
    } else if (target_imp <=0){
        error_message= "Please corret your current impression value.\n";
        alert (error_message);
    } else if (vt<=100 || ve/target_imp>100 || ve/target_imp<=0){
        error_message = "vt value should not be less than 100ms.\n"
        +"ve value should be be >= 100 or <= 0";
        alert (error_message);
    } else {
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
            target_view_url = view_stat_url.replace("${VIEW_TIME}", vt);
            target_view_url = target_view_url.replace("${VIEW_EFFECTIVENESS}", ve);
            updateVtVe (target_view_url);
        }else{
            target_view_url= null;
            alert ("Null view_stat_url in response : ", view_stat_url);
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
function updateVtVe (url){
    var xhr2 =  createXHR(); 
    xhr2.open("GET",url);                 
    xhr2.send(null);     
    console.log(xhr2);   
    if (xhr2.readyState === 1){
        document.getElementById("demo").innerHTML = target_view_url;
        var message = "Sent vt = " + vt + "; ve = " + ve +
            "\nExpected value: vt= "+ vt/target_imp + "; ve = " + 
            ve/target_imp + ";  imp = " + target_imp;
        alert(message);
    }
}
