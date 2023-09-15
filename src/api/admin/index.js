// 引入当前目录的所有的js文件
const files = require.context(".", false, /\.js$/);

// 存放当前目录的api
const list = {};

files.keys().forEach((key) => {
    if (key === "./index.js") return;

    const item = files(key).default;

    // 循环出来的api加入list
    Object.assign(list, item);
});

export default list;