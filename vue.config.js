module.exports = {
    transpileDependencies: ['uview-ui'],
    devServer: {
        proxy: {
            "/stock": {
                // target: 'http://www.fastadmin.com', // 本地
                target: "http://www.fastadmin.com", //本地开发
                // 如果接口跨域，需要进行这个参数配置
                changeOrigin: true,
                pathRewrite: {
                    "^stock": "",
                }
            },
        },
    },
};