<template>
    <view class="content">
        <u--form labelPosition="left" labelWidth="70" :model="userInfo" ref="form1">
            <u-form-item label="分配人员:" prop="username" @click="show = true">
                <u--input v-model="userInfo.username" disabled disabledColor="#ffffff" placeholder="请选择"
                    suffixIcon="arrow-down">
                </u--input>
            </u-form-item>
            <u-form-item label="客户名称" prop="nickname">
                <u--input v-model="userInfo.nickname" readonly></u--input>
            </u-form-item>
        </u--form>
        <u-button @click="submit" color="#19BC9C">确认分配</u-button>
        <u-picker :show="show" :columns="adminlist" keyName="username" @cancel="show = false" @confirm="confirm"></u-picker>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    data() {
        return {
            userInfo: {
                id: 0,
                nickname: '',
                username: '',
                adminid: 0
            },
            adminlist: [],
            show: false,
            LoginAdmin: {}
        }
    },
    onLoad(option) {
        this.userInfo.id = option.id ? option.id : 0

        this.getInfoData()

        this.getAdminData()
    },
    methods: {
        async getInfoData() {
            let result = await this.$u.api.manage.HighseaInfo({ busid: this.userInfo.id })
            if (result.code === 0) {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500,
                    complete: () => {
                        this.$u.route({
                            type: 'back'
                        })
                    }
                })
            }

            this.userInfo.nickname = result.data.nickname
        },
        async getAdminData() {
            let result = await this.$u.api.manage.HighseaAdmin()

            if (result.code === 0) {
                this.adminlist.push({
                    id: 0,
                    username: "暂无管理员",
                })

                return
            }

            let data = []

            for (const item of result.data) {
                data.push({
                    id: item.id,
                    username: item.username,
                })
            }

            this.adminlist.push(data)
        },
        confirm(value) {
            let item = value.value[0] ? value.value[0] : {}

            this.userInfo.adminid = item.id

            this.userInfo.username = item.username

            this.show = false
        },
        async submit() {
            let data = {
                adminid: this.userInfo.adminid,
                busid: this.userInfo.id,
            }

            let result = await this.$u.api.manage.HighseaAllot(data)

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
            } else {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500,
                })
            }
        }
    },
}
</script>

<style>
.content {
    width: 90%;
    height: 100vh;
    margin: 0 auto;
}
</style>