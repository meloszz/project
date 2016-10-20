var page = require('webpage').create(),
    system = require('system'),
    address = "https://www.douyu.com/directory/all";

var repeat = [];

var fs = require('fs');
function writeFile(d){
    for(var n = 0; n < repeat.length; n++) {
        if(d.href[0] == repeat[n]){
            console.log("repeat");
            return;
        }
    }
    repeat.push(d.href[0]);
    var file = "data/"+system.args[1];
    var str = "";
    for(var id = 0; id < d.title.length; id++){
        // str += "$"+id+ "num:"+d.num[id]+
        //     "!\n$"+id+"title:" + d.title[id] + "!\n$"+id+"name:"+d.name[id]
        //     + "!\n$"+id+"img:" + d.img[id] + "!\n$"+id+"href:" + d.href[id] + "!\n$"+id+"cate:"+d.cate[id]+"!\n";
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
page.viewportSize = { width: 1024, height: 20000};

// fs.exists("data/test.txt", function(exists) {
//     if(exists){
//         fs.remove("data/test.txt");
//     }
// });


// if(fs.exists("data/test.txt")){
//     fs.remove("data/test_douyu.txt");
// }

page.open(address, function (status) {
    var sum = [];
    for(var n = 0 ; n < 20; n++){
        (function(n){

            setTimeout(function () {
                var old = new Date();
                var data = page.evaluate(function() {
                    var title = [], name = [], num = [], img = [], href = [], cate = [];
                    var items = document.querySelectorAll("#live-list-contentbox a");
                    var items_title = document.querySelectorAll("#live-list-contentbox a");
                    var items_name = document.querySelectorAll("#live-list-contentbox a .dy-name");
                    var items_img = document.querySelectorAll("#live-list-contentbox a img");
                    var items_num = document.querySelectorAll("#live-list-contentbox a .dy-num");
                    var items_cate = document.querySelectorAll("#live-list-contentbox a .tag");
                    for(var n = 0; n < items.length; n++) {
                        title.push(items_title[n].title);
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
                        next: document.querySelector('#J-pager .shark-pager-next').getBoundingClientRect()
                    };
                });
                var rect = data.next;
                writeFile(data);
                console.log("********************");
                for(var i = 0; i < 10; i++){
                    console.log(data.num[i]);
                }
                console.log("-------------------");

                page.sendEvent('click', rect.left + rect.width / 2, rect.top + rect.height / 2);
                console.log("n:" + n);

                var now = new Date();
                console.log("time is :" + (now.getTime() - old.getTime()));

                if(n == 19) {
                    phantom.exit();
                }
            }, 400*n);
            //触发点击事件后，page需要一定的时间进行渲染，之间进行下一步，页面会没有变化
        })(n);
    }
});
