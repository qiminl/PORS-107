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
    alert ("waitttttttt, not done yet");
    var x = document.getElementById("frm1");

    if (x.target_acq.value > x.target_click.value){

    } else {
        var click = x.target_click.value - x.current_click.value;
        var imp = x.target_imp.value - x.current_imp.value;
        var acq = x.target_acq.value - x.current_acq.value;

        requestImpClickAcq(x.ad_slot_id.value, imp, click, acq)
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

    }
}