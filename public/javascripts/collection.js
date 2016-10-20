
function $(e){
    return document.querySelector(e);
}

console.log($(".side-tools-bar").getAttribute("value"));

if(($(".side-tools-bar").getAttribute("value")) != 'undefined'){
    alert($(".side-tools-bar").getAttribute("value"));
}

if($(".side-tools-bar").value){
    console.log("1111");
    console.log($(".side-tools-bar").value);
    alert($(".side-tools-bar").value);
}



function post(URL, p) {
  var temp = document.createElement("form");
  temp.action = URL;
  temp.method = "post";
  temp.style.display = "none";
 
    var opt = document.createElement("textarea");
    opt.name = "url";
    opt.value = p;
    // alert(opt.name)
    temp.appendChild(opt);
 
  document.body.appendChild(temp);
  temp.submit();
  return temp;
}
        

var arr = document.querySelectorAll(".close_wrapper");
for(var n = 0; n < arr.length; n++){
    (function(n){
        arr[n].onclick = function(obj){
            var r = confirm('确定要取消对'+arr[n].nextElementSibling.lastElementChild.lastElementChild.firstElementChild.innerHTML+"的直播间的关注吗？");
            if(r){
                var a = arr[n].nextElementSibling;
                post("/deleteCollection", a.href);
            }
        }
    })(n);
}

