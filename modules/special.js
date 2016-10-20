var arr1 = [
    "http://www.panda.tv/pandakill",
    "http://www.panda.tv/s6",
    "http://www.panda.tv/act/stormmusic20160627.html",
    "http://www.panda.tv/act/bananaow20160909.html",
    "http://www.panda.tv/act/baozoumanhua20160824.html",
    "http://www.panda.tv/act/cfpl20160818.html",
    "http://www.panda.tv/act/blizzardtv20160510.html?blizzardtv=1&",
    "http://stars.panda.tv/xroom",
    "http://www.panda.tv/hd/hct20160913.html",
    "http://www.panda.tv/act/stormmusic20160627.html?roomid=286463&",
    "http://www.panda.tv/act/wesg20160825.html?dvachannel=2&",
    "http://www.panda.tv/act/wesg20160825.html?dvachannel=3&",
    "http://www.panda.tv/act/wesg20160825.html?dvachannel=4&"
];

var arr2 = [
    "http://www.panda.tv/430909",
    "http://www.panda.tv/371037",
    "http://www.panda.tv/5000",
    "http://www.panda.tv/401905",
    "http://www.panda.tv/491124",
    "http://www.panda.tv/448130",
    "http://www.panda.tv/97513",
    "http://www.panda.tv/485118",
    "http://www.panda.tv/526136",
    "http://www.panda.tv/286463",
    "http://www.panda.tv/507536",
    "http://www.panda.tv/507538",
    "http://www.panda.tv/507540"

];

function special(href){
    for(var n = 0; n < arr1.length; n++){
        if(arr1[n] == href){
            return arr2[n];
        }
    }
    return false;
}

exports.transform = special;











