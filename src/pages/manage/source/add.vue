<template>
    <view class="container">
        <u--form labelPosition="left" labelWidth="90" :model="Source" :rules="rules" ref="uForm">
            <u-form-item label="客户来源" prop="name" borderBottom>
                <u--input v-model="Source.name" border="none" placeholder="请输入客户来源"></u--input>
            </u-form-item>
        </u--form>
        <view style="margin-top: 25px;">
            <u-button type="warning" @click="submit">新增</u-button>
        </view>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>
<script>
export default {
    data() {
        return {
            Source: {
                name: ''
            },
            rules: {
                name: [{
                    require: true,
                    message: '请填写客户来源',
                    trigger: ['blur', 'change']
                }],
            },
            LoginAdmin: {}
        }
    },
    methods: {
        submit() {
            this.$refs.uForm.validate(async () => {
                let data = {
                    name: this.Source.name,
                    adminid: this.LoginAdmin.id
                }

                let result = await this.$u.api.manage.SourceAdd(data);

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
            }).catch(() => { });
        }
    },
    onShow() {
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};
    }
}
</script>