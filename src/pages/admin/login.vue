<template>
    <view>
        <view class="avatar">
            <u-avatar src="/static/avatar.jpg" size="100"></u-avatar>
        </view>

        <view class="title">
            <text>帐号登陆</text>
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
                            <navigator class="url" url="/pages/admin/agreement/agreement">用户服务协议、隐私政策</navigator>
                        </u-checkbox-group>
                    </view>
                </u-form-item>
            </u--form>
        </view>

        <u-button type="warning" icon="pushpin-fill" @click="onLogin">登陆</u-button>
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
    methods: {
        onLogin() {
            this.$refs.uForm.validate().then(() => {

            }).catch(() => { });
        }
    },
    onReady() {
        // onReady 为uni-app支持的生命周期之一
        this.$refs.uForm.setRules(this.rules);
    },
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
.u-form .u-form-item__body__right__message {
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