<template>
    <view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="avatar xcx">
            <open-data type="userAvatarUrl"></open-data>
        </view>
        <view class="nickname">
            <open-data type="userNickName" class="nickname"></open-data>
        </view>
        <!-- #endif -->

        <!-- H5和APP端 -->
        <!--  #ifdef H5 || APP-PLUS -->
        <view class="avatar">
            <u-avatar src="/static/avatar.jpg" size="100"></u-avatar>
        </view>
        <!-- #endif -->

        <view class="title">
            <text>请验证并绑定你的账号</text>
        </view>

        <view style="width: 90%;">
            <u--form labelWidth="90" labelAlign="center" :model="userInfo" :rules="rules" ref="uForm">
                <u-form-item label="用户名" prop="username" class="item">
                    <u--input v-model="userInfo.username"></u--input>
                </u-form-item>
                <u-form-item label="密码" prop="password" class="item">
                    <u--input v-model="userInfo.password" password></u--input>
                </u-form-item>
                <!-- 用户协议 -->
                <u-form-item label=" " prop="agreement" class="item">
                    <view class="agreement">
                        <u-checkbox-group v-model="userInfo.agreement">
                            <u-checkbox name="agreement" label="我已阅读并同意" />
                            <navigator class="url" url="/pages/index/agreement">用户服务协议、隐私政策</navigator>
                        </u-checkbox-group>
                    </view>
                </u-form-item>
            </u--form>
        </view>

        <u-button type="warning" icon="pushpin-fill" @click="onBind">绑定帐号</u-button>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    data() {
        return {
            userInfo: {
                username: '',
                password: '',
                openid: '',
                arguments: []
            },
            rules: {
                'username': {
                    type: 'string',
                    required: true,
                    message: '请填写用户名',
                    trigger: ['blur', 'change']
                },
                'password': {
                    type: 'string',
                    required: true,
                    message: '请填写密码',
                    trigger: ['blur', 'change']
                },
                'agreement': {
                    type: 'array',
                    required: true,
                    message: '请阅读用户协议',
                    trigger: ['blur', 'change']
                }
            },
        }
    },

    // 事件
    methods: {
        onBind() {
            this.$refs.uForm.validate().then(async () => {
                let data = {
                    username: this.userInfo.username,
                    password: this.userInfo.password,
                    openid: this.userInfo.openid
                }

                let result = await this.$u.api.admin.bind(data);

                if (result.code === 0) {
                    this.$refs.uToast.show({
                        type: 'error',
                        message: result.msg,
                    });

                    return;
                } else {
                    this.$refs.uToast.show({
                        type: 'success',
                        message: result.msg,
                        complete: () => {

                            this.$u.route({
                                type: 'switchTab',
                                url: 'pages/admin/index'
                            });
                        }
                    });

                    return;
                }

            }).catch(() => {

            })
        }
    },

    // 监听页面初次渲染完成
    onReady() {
        // onReady 为uni-app支持的生命周期之一
        this.$refs.uForm.setRules(this.rules);
    },

    // 监听页面加载，其参数为上个页面传递的数据
    onLoad(option) {
        this.userInfo.openid = option.openid;
    }
}
</script>

<style>
.container {
    height: 100%;
    margin: 0 80rpx;
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
    font-size: 20px;
}

.img-captcha {
    display: block !important;
}

.btn-submit {
    margin-top: 40rpx !important;
}

.href-bindmobile {
    margin-top: 40rpx;
    text-align: center;
    font-size: 14px;
    color: var(--color-primary);
}

.u-form .u-form-item__body__right__message {
    margin-left: 0px !important;
}

/* #ifdef MP-WEIXIN  */
/deep/.u-form .u-form-item__body__right__message {
    margin-left: 90px !important;
}

/* #endif    */

.agreement {
    margin-top: .7em;
    display: flex;
}

.agreement .url {
    color: #3c9cff;
    margin-left: 2px;
}
</style>