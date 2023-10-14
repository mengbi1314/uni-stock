<template>
    <view class="content">
        <u--form labelPosition="left" labelWidth="70" :model="userInfo" :rules="rules" ref="uForm">
            <u-form-item label="回访客户" prop="nickname" @click="show = true">
                <u--input v-model="userInfo.nickname" disabled disabledColor="#ffffff" placeholder="请选择回访客户"
                    suffixIcon="arrow-down">
                </u--input>
            </u-form-item>
            <u-form-item label="回访内容" prop="content">
                <u--textarea v-model="userInfo.content" placeholder="请输入内容" count confirmType="done"></u--textarea>
            </u-form-item>
        </u--form>
        <u-button @click="submit" color="#19BC9C">添加回访内容</u-button>
        <u-picker :show="show" :columns="BusinessList" keyName="nickname" @cancel="show = false"
            @confirm="confirm"></u-picker>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    data() {
        return {
            show: false,
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
                'nickname': {
                    type: 'string',
                    required: true,
                    message: '请选择回访客户',
                    trigger: ['blur', 'change']
                },
            },
            LoginAdmin: {},
            BusinessList: []
        }
    },
    onReady() {
        this.$refs.uForm.setRules(this.rules)
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {}

        this.getBusinessData()

    },
    onShow() {

    },
    methods: {
        async getBusinessData() {
            let data = {
                adminid: this.LoginAdmin.id
            }

            let result = await this.$u.api.manage.VisitBusiness(data)

            if (result.code === 0) {
                this.BusinessList.push([{
                    id: 0,
                    nickname: '暂无用户，请先领取'
                }])

                return false
            }

            let BusinessData = []

            for (let item of result.data) {
                BusinessData.push({
                    id: item.id,
                    nickname: item.nickname
                })
            }

            this.BusinessList.push(BusinessData)
        },
        confirm(item) {
            let value = item.value[0]

            if (!value.id || JSON.stringify(value) === '{}') {
                this.$refs.uToast.show({
                    type: 'error',
                    message: '请选择需要回访客户'
                })

                return false
            }

            this.show = false

            this.userInfo.busid = value.id

            this.userInfo.nickname = value.nickname
        },
        submit() {
            this.$refs.uForm.validate().then(async () => {
                let data = {
                    adminid: this.LoginAdmin.id,
                    busid: this.userInfo.busid,
                    content: this.userInfo.content
                }

                let result = await this.$u.api.manage.VisitAdd(data)

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
            }).catch((error) => {

            })
        }
    }
}
</script>

<style>
.content {
    width: 90%;
    height: 100vh;
    margin: 0 auto 30px;
}
</style>