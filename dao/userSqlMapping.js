var user = {
    insert:'INSERT INTO ??(id, url) VALUES(?,?)',
    update:'update user set name=?, age=? where id=?',
    delete: 'delete from user where id=?',
    getCollections: "select href from collection where name = ?",
    queryById: 'select * from ?? where username=? and password = ?',
    queryAll: 'select * from ??',
    test: 'insert into ?? values(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?)',
    truncate: 'truncate table ??',
    isShow: 'select * from actual where href = ?',
    updateData: 'update ?? set img = ?, title = ?, name = ?, cate = ?,num=? where href = ? limit 1',
    insertData: 'insert into ?? values(?,?,?,?,?,?,?,?)',
    refresh: 'update ?? set num = 0 where web = ?',
    repeatEmail: 'select * from user where email = ?',
    repeatUser: 'select * from user where username = ?',
    addUser: 'insert into user values(?,?,?)',
    repeatCollection: 'select * from collection where name = ? and href = ?',
    repeatActual: 'select * from actual where href = ?',
    addCollection: 'insert into collection values(?,?)',
    deleteCollection: 'delete from collection where name = ? and href = ?',
    alterTableName: 'alter table ?? rename to ??',
    copyTable: 'create table ?? select * from ??',
    repeatTable: 'select * from ??',
    deleteTable: 'drop table ??',
    setKey: 'alter table ?? add primary key(href)'
};

module.exports = user;