<template>
    <view class="content">
        <u--form labelPosition="left" labelWidth="70" :model="userInfo" :rules="rules" ref="uForm">
            <u-form-item label="回访客户" prop="nickname" @click="show = true">
                <u--input v-model="userInfo.business.nickname" disabled disabledColor="#ffffff" placeholder="请选择回访客户">
                </u--input>
            </u-form-item>
            <u-form-item label="回访内容" prop="content">
                <u--textarea v-model="userInfo.content" placeholder="请输入内容" count confirmType="done"></u--textarea>
            </u-form-item>
        </u--form>
        <u-button @click="submit" color="#19BC9C">修改回访内容</u-button>
        <!-- <u-picker :show="show" :columns="BusinessList" keyName="nickname" @cancel="show = false"
            @confirm="confirm"></u-picker> -->
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    data() {
        return {
            btnStyle: {
                width: '100%',
                position: 'fixed',
                bottom: '0px',
                zIndex: 99,
            },
            userInfo: {
                content: '',
                busid: null,
                nickname: ''
            },
            rules: {
                'content': {
                    type: 'string',
                    required: true,
                    message: '请填写回访内容',
                    trigger: ['blur', 'change']
                },
            },
            LoginAdmin: {},
            id: 0
        }
    },
    onLoad(option) {
        this.$refs.uForm.setRules(this.rules)
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {}
        this.id = option.id

        this.getVisitData()
    },
    methods: {
        async getVisitData() {
            let result = await this.$u.api.manage.VisitInfo({
                adminid: this.LoginAdmin.id,
                id: this.id
            })

            if (result.code === 0) {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500,
                    complete: () => {
                        this.$u.route({
                            type: 'back'
                        });
                    }
                });

                return;
            } else {
                this.userInfo = result.data
            }
        },
        submit() {

            this.$refs.uForm.validate().then(async () => {
                let data = {
                    busid: this.userInfo.busid,
                    adminid: this.LoginAdmin.id,
                    id: this.userInfo.id,
                    content: this.userInfo.content,
                }

                let result = await this.$u.api.manage.VisitEdit(data)

                if (result.code === 1) {
                    this.$refs.uToast.show({
                        type: 'success',
                        message: result.msg,
                        duration: 1500,
                        complete: () => {
                            this.$u.route({
                                type: 'back',
                            })
                        }
                    })

                    return false
                } else {
                    this.$refs.uToast.show({
                        type: 'error',
                        message: result.msg,
                        duration: 1500,
                    })

                    return false
                }

            }).catch(() => { })




        }
    },
}
</script>

<style>
.content {
    width: 90%;
    height: 100vh;
    margin: 0 auto 30px;
}
</style>