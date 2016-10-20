function $(e) {
    return document.querySelector(e);
}
function toggle(obj) {
    var a = obj.childNodes;
    for (var n = 0; n < a.length; n++) {
        if (a[n].nodeName == "SPAN") {
            if (a[n].id == 'login') {
                document.querySelector("#login").className = "head_button selected";
                document.querySelector("#signup").className = "head_button";
                document.querySelector("#form_login").className = "";
                document.querySelector("#form_signup").className = "hidden";
            } else {
                document.querySelector("#login").className = "head_button";
                document.querySelector("#signup").className = "head_button selected";
                document.querySelector("#form_login").className = "hidden";
                document.querySelector("#form_signup").className = "";
            }
        }
    }
}

$(".btn_signup").onclick = function(){
    



}