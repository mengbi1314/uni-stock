<template>
    <view class="content">
        <u-cell-group>
            <!-- <u-cell title="客户头像">
                <u-avatar slot="right-icon" width="80" height="80" :src="info.avatar_cdn" shape="cycle"></u-avatar>
            </u-cell> -->
             <u-cell title="客户头像" >
                    <u--image slot="right-icon" :src="info.avatar_cdn" :fade="true" duration="500" width="80px" height="80px" shape="circle"></u--image>
                </u-cell>
            <u-cell title="客户名称" :value="info.nickname"></u-cell>
            <u-cell title="性别" :value="info.gender_text"></u-cell>
            <u-cell title="手机号码" :value="info.mobile_text"></u-cell>
            <u-cell title="邮箱" :value="info.email"></u-cell>
            <u-cell title="认证" :value="info.auth == 1 ? '已认证' : '未认证'"></u-cell>
            <u-cell title="客户来源" :value="info.source.name"></u-cell>
            <u-cell title="成交状态" :value="info.deal_text"></u-cell>
            <u-cell title="创建时间" :value="$u.timeFormat(info.createtime, 'yyyy年mm月dd日')"></u-cell>
            <u-cell title="地区" :value="info.region_text"></u-cell>
        </u-cell-group>

        <u-toast ref="uToast"></u-toast>
    </view>
</template>
<script>
export default {
    data() {
        return {
            info: {

            },
            LoginAdmin: {},
            busid: ''
        }
    },
    methods: {
        async getInfo() {
            let data = {
                busid: this.busid,
                adminid: this.LoginAdmin.id
            }
            let result = await this.$u.api.manage.PrivateInfo(data);
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
                return;
            }
            console.log(result.data);
            this.info = result.data;
        }
    },
    onLoad(options) {
        this.busid = options.busid ? options.busid : 0;
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ?? {};
        this.getInfo();
    }
}
</script>