function get(URL) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "get";
    temp.style.display = "none";
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}

document.querySelector(".quit").onclick = function () {
    var r = confirm("确定要退出？");
    if (r) {
        get("/quit");
    }
}
