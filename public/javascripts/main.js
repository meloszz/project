function $(e) {
    return document.querySelectorAll(e);
}

var img_arr = $(".video-img");

function changeImgWidth() {
    var img_width = (document.body.scrollWidth - 320) / 4;
    for (var n = 0; n < img_arr.length; n++) {
        img_arr[n].style.width = img_width + "px";
        img_arr[n].style.height = img_width / 1.5 + "px";
    }
}

changeImgWidth();

window.onresize = function () {
    changeImgWidth();
    console.log("change");
}


