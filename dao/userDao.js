var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');
var fs = require("fs");
var cp = require("child_process");
var special = require("../modules/special");
var eventproxy = require("eventproxy");

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
    add: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            //本来是param.url，但是param并不能获得表单的数据，所以用了req.body.url
            connection.query($sql.queryAll, 'url_szz', function (err, result) {
                connection.query($sql.insert, ['url_szz', result.length, req.body.url], function (err2, result2) {
                    // 以json形式，把操作结果返回给前台页面
                    // jsonWrite(res, result);
                    // 释放连接
                    var arr = [];
                    for (var n = 0; n < result.length; n++) {
                        arr.push(result[n].url)
                    }
                    res.locals.data = arr;
                    if (result2) {//如果操作失败则没有result
                        arr.push(req.body.url);
                    }
                    res.render('index');
                    connection.release();

                });
            });
        });
    },
    delete: function (req, res, next) {
        // delete by Id
        pool.getConnection(function (err, connection) {
            var id = +req.query.id;
            connection.query($sql.delete, id, function (err, result) {
                if (result.affectedRows > 0) {
                    result = {
                        code: 200,
                        msg: '删除成功'
                    };
                } else {
                    result = void 0;
                }
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        // update by id
        // 为了简单，要求同时传name和age两个参数
        var param = req.body;
        if (param.name == null || param.age == null || param.id == null) {
            jsonWrite(res, undefined);
            return;
        }

        pool.getConnection(function (err, connection) {
            connection.query($sql.update, [param.name, param.age, +param.id], function (err, result) {
                // 使用页面进行跳转提示
                if (result.affectedRows > 0) {
                    res.render('suc', {
                        result: result
                    }); // 第二个参数可以直接在jade中使用
                } else {
                    res.render('fail', {
                        result: result
                    });
                }

                connection.release();
            });
        });
    },
    queryById: function (req, res, next) {
        var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryById, id, function (err, result) {
                jsonWrite(res, result);
                connection.release();
            });
        });
    },
    queryAll: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            res.locals.data = [];
            connection.query($sql.getCollections, req.cookies.username, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("result:" + result.length);
                    if (result.length <= 0) {
                        console.log("mycollections");
                        res.redirect('/mycollections');
                    } else {
                        var ep = new eventproxy();
                        for (var n = 0; n < result.length; n++) {
                            (function (n) {
                                connection.query($sql.isShow, result[n].href, function (err1, result1) {
                                    if (err1) {
                                        console.log(err1);
                                    } else {
                                        if (result1.length != 0) {
                                            if (result1[0].num != 0) {
                                                res.locals.data.push({
                                                    title: result1[0].title,
                                                    name: result1[0].name,
                                                    img: result1[0].img,
                                                    num: result1[0].num,
                                                    href: result1[0].href,
                                                    cate: result1[0].cate
                                                });
                                            }
                                        } else {
                                            //无记录
                                        }
                                    }
                                    ep.emit('done');
                                });
                            })(n);
                        }
                        ep.after('done', result.length, function () {
                            var pattern = /万/;
                            res.locals.data.sort(function (a, b) {
                                var c, d;
                                c = (pattern.test(a.num)) ? (parseFloat(a.num) * 10000) : parseFloat(a.num);
                                d = (pattern.test(b.num)) ? (parseFloat(b.num) * 10000) : parseFloat(b.num);
                                return d - c;
                            })
                            res.locals.selected = 1;
                            res.render("test");
                            connection.release();
                        });
                    }
                }
            });
        });
    },
    collections: function (req, res) {
        pool.getConnection(function (err, connection) {
            res.locals.data = [];
            connection.query($sql.getCollections, req.cookies.username, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result.length <= 0) {
                        res.locals.selected = 2;
                        res.render("collection");
                    } else {
                        var ep = new eventproxy();
                        for (var n = 0; n < result.length; n++) {
                            (function (n) {
                                connection.query($sql.isShow, result[n].href, function (err1, result1) {
                                    if (err1) {
                                        console.log(err1);
                                    } else {
                                        if (result1.length != 0) {
                                            res.locals.data.push({
                                                title: result1[0].title,
                                                name: result1[0].name,
                                                img: result1[0].img,
                                                num: result1[0].num,
                                                href: result1[0].href,
                                                cate: result1[0].cate
                                            });
                                        } else {
                                            //无记录
                                        }
                                    }
                                    ep.emit("done");
                                });
                            })(n);
                        }
                        ep.after("done", result.length, function () {
                            console.log("end");
                            var pattern = /万/;
                            res.locals.data.sort(function (a, b) {
                                var c, d;
                                c = (pattern.test(a.num)) ? (parseFloat(a.num) * 10000) : parseFloat(a.num);
                                d = (pattern.test(b.num)) ? (parseFloat(b.num) * 10000) : parseFloat(b.num);
                                return d - c;
                            })
                            res.locals.selected = 2;
                            res.render("collection");
                            connection.release();
                        });
                    }
                }
            });
        });
    },
    login: function (req, res) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryById, ['user', req.body.username, req.body.password], function (err, result) {
                if (result.length != 0) {
                    res.cookie('username', req.body.username, { maxAge: 7776000000, path: '/' });
                    username = req.body.username;
                    res.redirect("/");
                } else {
                    res.render("login");
                }
                connection.release();
            });
        });
    },
    signup: function (req, res) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.repeatUser, [req.body.username], function (err, result) {
                if (result.length > 0) {
                    res.render('login', { tip: '用户名已存在', cate: 'signup' });
                } else {
                    connection.query($sql.repeatEmail, [req.body.email], function (err, result) {
                        if (result.length > 0) {
                            res.render('login', { tip: '邮箱已注册', cate: 'signup' });
                        } else {
                            connection.query($sql.addUser, [req.body.username, req.body.password, req.body.email], function (err, result) {
                                if (err) {
                                    res.write("注册失败，请稍后重试");
                                } else {
                                    res.cookie('username', req.body.username, { maxAge: 7776000000, path: '/' });
                                    username = req.body.username;
                                    res.redirect("/");
                                }
                            });
                        }
                    });
                }
            });
        });
    },
    deleteCollection: function (req, res) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.deleteCollection, [req.cookies.username, req.body.url], function (err, result) {
                res.redirect("/mycollections");
            });
        });
    },
    addCollection: function (req, res) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.repeatCollection, [req.cookies.username, req.body.url], function (err, result) {
                if (result.length > 0) {
                    res.redirect("/mycollections");
                } else {
                    connection.query($sql.repeatActual, [req.body.url], function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (result.length > 0) {
                                connection.query($sql.addCollection, [req.cookies.username, req.body.url], function (err, result) {
                                    res.redirect("mycollections");
                                    connection.release();
                                })
                            } else {
                                //可能存在未收录和pandakill那样url不一样的情况
                                // res.redirect("/mycollections");
                                var s = special.transform(req.body.url);
                                if (s) {
                                    connection.query($sql.addCollection, [req.cookies.username, s], function (err, result) {
                                        res.redirect("mycollections");
                                        connection.release();
                                    })
                                } else {
                                    res.locals.data = [];
                                    connection.query($sql.getCollections, req.cookies.username, function (err, result) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var ep = new eventproxy();
                                            for (var n = 0; n < result.length; n++) {
                                                (function (n) {
                                                    connection.query($sql.isShow, result[n].href, function (err1, result1) {
                                                        if (err1) {
                                                            console.log(err1);
                                                        } else {
                                                            if (result1.length != 0) {
                                                                res.locals.data.push({
                                                                    title: result1[0].title,
                                                                    name: result1[0].name,
                                                                    img: result1[0].img,
                                                                    num: result1[0].num,
                                                                    href: result1[0].href,
                                                                    cate: result1[0].cate
                                                                });
                                                            } else {
                                                                //无记录
                                                            }
                                                        }
                                                        ep.emit("done");
                                                    });
                                                })(n);
                                            }
                                            ep.after('done', result.length, function () {
                                                console.log("end");
                                                var pattern = /万/;
                                                res.locals.data.sort(function (a, b) {
                                                    var c, d;
                                                    c = (pattern.test(a.num)) ? (parseFloat(a.num) * 10000) : parseFloat(a.num);
                                                    d = (pattern.test(b.num)) ? (parseFloat(b.num) * 10000) : parseFloat(b.num);
                                                    return d - c;
                                                })
                                                res.locals.selected = 2;
                                                res.render("collection", { tip: "请检查直播间地址是否正确，如果保证正确，可能尚未收录该直播间，如有需要，请给我发邮件" });
                                                connection.release();
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    })
                }
            });
        });
    },
    //update datatable and copy a datatable
    updateData: function (filename, tablename, num1) {
        fs.exists(filename, function (exists) {
            if (exists) {
                fs.readFile(filename, { flag: 'r+', encoding: 'utf8' }, function (err, data) {
                    if (err) {
                        console.error(err);
                        return;
                    } else {
                        fs.unlink(filename);
                        var insertnum = 0;
                        pool.getConnection(function (err, connection) {
                            var pattern_title = new RegExp("title\\:((.|\n)*?)\\!\\n", "g");
                            var pattern_name = new RegExp("name\\:((.|\n)*?)\\!\\n", "g");
                            var pattern_href = new RegExp("href\\:((.|\n)*?)\\!\\n", "g");
                            var pattern_num = new RegExp("num\\:((.|\n)*?)\\!\\n", "g");
                            var pattern_img = new RegExp("img\\:((.|\n)*?)\\!\\n", "g");
                            var pattern_cate = new RegExp("cate\\:((.|\n)*?)\\!\\n", "g");
                            var pattern_douyu = /www\.douyu/;
                            var pattern_panda = /www\.panda/;
                            var pattern_huomao = /www\.huomao/;
                            var pattern_huya = /www\.huya/;
                            var pattern_zhanqi = /www\.zhanqi/;
                            var sum = 0;
                            var douyu = pattern_douyu.test(data);
                            sum += (douyu) ? 1 : 0;
                            var panda = pattern_panda.test(data);
                            sum += (panda) ? 1 : 0;
                            var zhanqi = pattern_zhanqi.test(data);
                            sum += (zhanqi) ? 1 : 0;
                            var huomao = pattern_huomao.test(data);
                            sum += (huomao) ? 1 : 0;
                            var huya = pattern_huya.test(data);
                            sum += (huya) ? 1 : 0;
                            var a;
                            var name = [], title = [], href = [], num = [], img = [], cate = [];
                            while (a = pattern_title.exec(data)) {
                                title.push(a[1]);
                            }
                            while (a = pattern_name.exec(data)) {
                                name.push(a[1]);
                            }
                            while (a = pattern_href.exec(data)) {
                                href.push(a[1]);
                            }
                            while (a = pattern_num.exec(data)) {
                                num.push(a[1]);
                            }
                            while (a = pattern_img.exec(data)) {
                                img.push(a[1]);
                            }
                            while (a = pattern_cate.exec(data)) {
                                cate.push(a[1]);
                            }

                            function u() {
                                var i = 0;
                                for (var n = 0; n < img.length; n++) {
                                    (function (n) {
                                        connection.query($sql.updateData, [tablename, img[n], title[n], name[n], cate[n], num[n], href[n]], function (err, result) {
                                            if (err) {
                                                i++;
                                                // console.log("update data error");
                                                console.log(err);
                                            } else {
                                                if (result.changedRows == 0) {
                                                    var p = /www\.(.+?)\./;
                                                    var web = href[n].match(p)[1];
                                                    connection.query($sql.insertData, [tablename, href[n], img[n], title[n], name[n], cate[n], num[n], 0, web], function (err, result) {
                                                        if (err) {
                                                            // console.log("insert data error");
                                                            console.log(err);
                                                        } else {
                                                            console.log(title[n] + " inserted");
                                                            insertnum++;
                                                        }
                                                        i++;
                                                    })
                                                } else {
                                                    i++;
                                                }
                                            }
                                        });
                                    })(n);
                                    if (n == img.length - 1) {
                                        connection.query($sql.deleteTable, ["actual"], function (err, result) {
                                            connection.query($sql.alterTableName, [tablename, "actual"], function (err, result) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                console.log("change the table");
                                                connection.query($sql.copyTable, ["actual" + (num1 + 1), "actual"], function (err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        connection.query($sql.setKey, ["actual" + (num1 + 1)], function (err, result) {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            console.log(insertnum + "  inserted");
                                                            console.log("copy table " + "actual" + (num1 + 1));
                                                            connection.release;
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }
                            }

                            var flag = 0;
                            if (douyu) {
                                connection.query($sql.refresh, [tablename, 'douyu'], function (err, result) {
                                    if (++flag == sum) {
                                        u();
                                    }
                                });
                            }
                            if (zhanqi) {
                                connection.query($sql.refresh, [tablename, 'zhanqi'], function (err, result) {
                                    if (++flag == sum) {
                                        u();
                                    }
                                });
                            }
                            if (panda) {
                                connection.query($sql.refresh, [tablename, 'panda'], function (err, result) {
                                    if (++flag == sum) {
                                        u();
                                    }
                                });
                            }
                            if (huomao) {
                                connection.query($sql.refresh, [tablename, 'huomao'], function (err, result) {
                                    if (++flag == sum) {
                                        u();
                                    }
                                });
                            }
                            if (huya) {
                                connection.query($sql.refresh, [tablename, 'huya'], function (err, result) {
                                    if (++flag == sum) {
                                        u();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    copyTable: function (name) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.copyTable, [name, "actual"], function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    connection.query($sql.setKey, [name], function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        connection.release;
                    });
                }
            });
        });
    }
};















