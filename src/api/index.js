// 引入每个目录下的index.js
const files = require.context("./", true, /index.js$/);

// 存放api的集合
const modules = {};

files.keys().forEach((key) => {
    console.log(key);
    if (key === "./index.js") return;

    const item = files(key).default;

    var mod = {};

    // 替换路径
    var name = key.replace(/\.\/(.*)\/index.js/, "$1");

    mod[name] = item;

    Object.assign(modules, mod);
});

const install = (Vue, vm) => {
    //加载模块
    modules;

    //循环组合接口API
    let api = {};

    for (let ModeName in modules) {

        if (JSON.stringify(modules[ModeName]) === "{}") {
            continue;
        }

        for (let ApiName in modules[ModeName]) {
            let config = modules[ModeName][ApiName];
            config.name = ApiName;

            if (!config.name || !config.url) {
                continue;
            }

            if (!api[ModeName]) {
                api[ModeName] = {};
            }

            switch (config.method.toUpperCase()) {
                case "GET":
                    api[ModeName][config.name] = (data = {}) => {
                        return uni.$u.http.get(config.url, { params: data });
                    };
                    break;
                case "POST":
                    api[ModeName][config.name] = (data = {}) => {
                        return uni.$u.http.post(config.url, data);
                    };
                    break;
                case "UPLOAD":
                    api[ModeName][config.name] = (data = {}) => {
                        if (data.filePath) {
                            return uni.$u.http.upload(config.url, data);
                        } else {
                            return uni.$u.http.post(config.url, data);
                        }
                    };
                    break;
            }
        }
    }

    vm.$u.api = api;
};

export default {
    install,
};