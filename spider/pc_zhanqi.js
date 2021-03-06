var page = require('webpage').create(),
    system = require('system'),
    address = "https://www.zhanqi.tv/lives";

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

page.open(address, function (status) {
    for(var n = 0 ; n < 30; n++){
        (function(n){
            setTimeout(function () {
                var data = page.evaluate(function(n) {
                    console.log("n:"+n);
                    if(n != 29){
                        console.log("scroll");
                        window.scrollTo(0, 100000);
                        return null;
                    }else{
                        console.log("no scroll");
                        var title = [], name = [], num = [], img = [], href = [], cate = [];
                        var items = document.querySelectorAll("#hotList a");
                        var items_title = document.querySelectorAll("#hotList .name");
                        var items_name = document.querySelectorAll("#hotList span.anchor-to-cut");
                        var items_img = document.querySelectorAll("#hotList img");
                        var items_num = document.querySelectorAll("#hotList .views span.dv");
                        var items_cate = document.querySelectorAll("#hotList .game-name");
                        for(var n = 0; n < items.length; n++) {
                            title.push(items_title[n].innerHTML);
                            name.push(items_name[n].innerHTML);
                            img.push(items_img[n].getAttribute("src"));
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

                
                if(n == 29){
                    console.log("nnnn:"+n);
                    console.log("data.title:"+data.title[1]);
                    console.log(data.n);
                    writeFile(data);
                    // console.log("********************");
                    // for(var i = 0; i < 10; i++){
                    //     console.log(data.num[i]);
                    // }
                    // console.log("-------------------");
                }
                console.log("n:" + n);
                // var now = new Date();
                // console.log("time is :" + (now.getTime() - old.getTime()));
                if(n == 29) {
                    phantom.exit();
                }
            }, 1000*n);
            //触发点击事件后，page需要一定的时间进行渲染，之间进行下一步，页面会没有变化
        })(n);
    }
});
