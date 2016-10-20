var page = require('webpage').create(),
    system = require('system'),
    address = "http://www.huomao.com/channel/all";

page.onConsoleMessage = function (msg) {
    console.log('Page:' + msg);
};

var fs = require('fs');

function writeFile(d){
    var file = "data/"+system.args[1];
    var str = "";
    for(var id = 0; id < d.title.length; id++){
        str += "num:"+d.num[id]+
            "!\n"+"title:" + d.title[id] + "!\n"+"name:"+d.name[id]
            + "!\n"+"img:" + d.img[id] + "!\n"+"href:" + d.href[id] + "!\n"+"cate:"+d.cate[id]+"!\n";
    }
    var f = fs.open(file, "a");
    f.write(str);
    f.close();
}

page.settings = {
    javascriptEnabled: true,
    loadImages: true,
    userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) PhantomJS/19.0'
};

phantom.outputEncoding="gb2312";
page.viewportSize = { width: 1024, height: 1000};

//火猫的问题，如果人数过少，在目录上不显示人数，会导致data.num undefined
page.open(address, function (status) {
    for(var n = 0 ; n < 15; n++){
        (function(n){
            setTimeout(function () {
                var data = page.evaluate(function(n) {
                    console.log("n:"+n);
                    if(n != 14){
                        window.scrollTo(0, 100000);
                        return null;
                    }else{
                        var title = [], name = [], num = [], img = [], href = [], cate = [];
                        var items = document.querySelectorAll("#channellist .list-smallbox a");
                        var items_title = document.querySelectorAll("#channellist .list-smallbox .title em");
                        var items_name = document.querySelectorAll("#channellist .list-smallbox a>p>span");
                        var items_img = document.querySelectorAll("#channellist .list-smallbox img");
                        var items_num = document.querySelectorAll("#channellist .list-smallbox a>p .flr span");
                        var items_cate = document.querySelectorAll("#channellist .list-smallbox .tag");
                        for(var n = 0; n < items_num.length; n++) {
                            title.push(items_title[n].innerHTML);
                            name.push(items_name[n].innerHTML);
                            img.push(items_img[n].getAttribute("data-original"));
                            num.push(items_num[n].innerHTML);
                            href.push(items[n].href);
                            cate.push(items_cate[n].innerHTML);
                        }
                        return {
                            title : title,
                            name: name,
                            img: img,
                            num: num,
                            href: href,
                            cate: cate,
                            flag: n
                        };
                    }
                },n);
                if(n == 14) {
                    writeFile(data);
                    phantom.exit();
                }
            }, 1000*n);
            //触发点击事件后，page需要一定的时间进行渲染，之间进行下一步，页面会没有变化
        })(n);
    }
});
