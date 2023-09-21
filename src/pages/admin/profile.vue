<template>
    <view class="container">
        <view class="avatar">
            <!-- 上传组件 -->
            <u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="avatar" width="100" height="100"
                style="border-radius: 100%;" :maxCount="1"></u-upload>
        </view>

        <!-- 表单内容 -->
        <u--form labelPosition="left" :model="LoginAdmin" :rules="rules" ref="uForm">
            <u-form-item label="昵称" prop="nickname" borderBottom>
                <u--input v-model="LoginAdmin.nickname" border="none" placeholder="请输入昵称"></u--input>
            </u-form-item>
            <u-form-item label="手机" prop="mobile" borderBottom>
                <u--input v-model="LoginAdmin.mobile" border="none" placeholder="请输入手机号"></u--input>
            </u-form-item>
            <u-form-item label="邮箱" prop="email" borderBottom>
                <u--input v-model="LoginAdmin.email" border="none" placeholder="请输入邮箱"></u--input>
            </u-form-item>
            <u-form-item label="密码" prop="password" borderBottom>
                <u--input type="password" v-model="LoginAdmin.password" border="none" placeholder="登录密码为空即不修改密码"></u--input>
            </u-form-item>
        </u--form>
        <view style="margin-top: 25px;">
            <u-button type="warning" @click="submit">修改资料</u-button>
        </view>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>
<script>
export default {
    data() {
        return {
            rules: {
                mobile: [
                    {
                        // 自定义验证函数，见上说明
                        validator: (rule, value, callback) => {
                            // 上面有说，返回true表示校验通过，返回false表示不通过
                            // uni.$u.test.mobile()就是返回true或者false的
                            if (value) {
                                return uni.$u.test.mobile(value);
                            } else {
                                return true
                            }
                        },
                        message: '手机号码不正确',
                        // 触发器可以同时用blur和change
                        trigger: ['change', 'blur'],
                    }],
                email: [{
                    type: 'email',
                    required: false,
                    message: '请填正确的邮箱',
                    trigger: ['blur', 'change']
                }],
                password: [{
                    min: 6,
                    max: 14,
                    message: '密码长度在6-14个字符之间',
                    trigger: ['blur', 'change']
                },]
            },
            LoginAdmin: {},
            fileList: []
        }
    },
    methods: {
        deletePic() {
            this.fileList = [];
        },
        async afterRead(files) {
            let file = files.file ?? '';

            if (file) {
                let data = {
                    filePath: file.url,
                    formData: {
                        adminid: this.LoginAdmin.id
                    },
                    name: 'avatar'
                }

                let result = await this.$u.api.admin.AvatarUpload(data);

                if (result.code === 0) {
                    this.$refs, uToast.show({
                        type: 'error',
                        message: result.msg,
                    });

                    return;
                } else {
                    this.$refs.uToast.show({
                        type: 'success',
                        message: result.msg,
                        complete: () => {
                            uni.setStorageSync('LoginAdmin', result.data);

                            this.fileList = [
                                {
                                    url: result.data.avatar_cdn
                                }
                            ];
                        }
                    });

                    return;
                }
            }

        }
    },
    onReady() {
        // 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
        this.$refs.uForm.setRules(this.rules)
    },
    onShow() {
        // 获取到登录信息
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};

        if (this.LoginAdmin.avatar) {
            this.fileList = [
                {
                    url: this.LoginAdmin.avatar_cdn
                }
            ]
        }
    }
}
</script>

<style>
.container {
    height: 100%;
    margin: 0 50rpx;
    box-sizing: border-box;
}

.avatar {
    text-align: center;
}

.u-avatar {
    margin: 80rpx auto 40rpx;
}

.xcx {
    width: 200rpx;
    height: 200rpx;
    margin: 80rpx auto 40rpx;
    border-radius: 100%;
    overflow: hidden;
}

.nickname {
    font-size: 14px;
    text-align: center;
}

.title {
    text-align: center;
    margin: 40rpx 0;
    font-size: 14rpx;
}

.avatar .u-upload {
    justify-content: center;
    align-items: center;
    margin: 3em auto;

}
</style>