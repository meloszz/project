# 视频直播收藏网站

就是一个为看直播的人提供各个直播平台实时信息的网站

实现：用爬虫实时抓取各大直播平台的在线数据，存储在Mysql中，供用户查询

架构：nodejs4 + express4 + phantomjs + mysql + jade

这个网站是我几个月前在学了Nodejs之后写的，比网上用nodejs+express搭建的博客demo要复杂许多，常见的模块用了不少，整个网站写下来，
对于nodejs的异步编程也有了一个清晰的认识，也有了一种新的编程思维

现在网上有不少nodejs的学习资料，不过很多都是用的早期的Nodejs版本，Nodejs在4的时候改了不少地方，所以很多资料都不能用了，我这个项目
用的是nodejs4.6,还算比较新

值得参考的几个地方：


1
异步
userDao.js中包含了网站的逻辑操作和数据库操作，涉及了大量异步行为，开始不了解的情况下，用计数器来解决异步问题，现在项目中使用的是
eventproxy，一个通过事件实现异步协作的工具
异步是Nodejs一个鲜明的特点，一开始写的时候很蛋疼，但掌握以后也收获了一种编程的思维

2
nodejs数据库的连接，操作
配置文件 conf/db.js
操作 dao/userDao.js   dao/userSqlMapping.js

3
spider文件夹中是爬虫文件
一开始我用的是superagent与cheerio来写爬虫，但发现爬下来的页面没有实时信息，才发现直播平台的数据都是用js异步加载的，显然superagent与cheerio只能解析静态网页，后来才知道有Phantomjs这么个东西,一个服务器端的 JavaScript API 的 WebKit，可以解析网页的js

这几个爬虫文件也是我花的时间最多的地方，因为一次只能爬取一张页面，所以爬虫文件还实现了按钮带点击，翻页，下拉等行为

4
express现在的模板引擎是jade，可以看看是怎么向jade传递数据的，有几种方法，我都在userDao.js和index.js中用过

















