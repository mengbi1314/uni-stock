<template>
    <view class="container">
        <u--form labelPosition="left" labelWidth="90" :model="Source" :rules="rules" ref="uForm">
            <u-form-item label="客户来源" prop="name" borderBottom>
                <u--input v-model="Source.name" border="none" placeholder="请输入客户来源"></u--input>
            </u-form-item>
        </u--form>
        <view style="margin-top: 25px;">
            <u-button type="warning" @click="submit">编辑</u-button>
        </view>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>
<script>
export default {
    data() {
        return {
            Source: {
                id: 0,
                name: ''
            },
            rules: {
                name: [{
                    required: true,
                    message: '请填客户来源',
                    trigger: ['blur', 'change']
                }],
            },
            LoginAdmin: {}
        }
    },
    methods: {
        submit() {
            this.$refs.uForm.validate().then(async (res) => {
                let data = {
                    id: this.Source.id,
                    name: this.Source.name,
                    adminid: this.LoginAdmin.id
                }

                let result = await this.$u.api.manage.SourceEdit(data);

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
                                type: 'back'
                            });
                        }
                    });

                    return;
                }
            }).catch((error) => {
                console.log(error)
            });
        },
        async getInfo() {
            let data = {
                id: this.Source.id,
                adminid: this.LoginAdmin.id
            }

            let result = await this.$u.api.manage.SourceInfo(data);

            if (result.code === 0) {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg,
                    complete: () => {
                        this.$u.route({
                            type: 'back'
                        });
                    }
                });

                return;
            }


            this.Source = result.data;

        }
    },
    onShow() {
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};

        this.getInfo();
    },
    onReady() {
        // 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
        this.$refs.uForm.setRules(this.rules);
    },
    onLoad(options) {
        this.Source.id = options.id ? options.id : 0;
    }
}
</script>