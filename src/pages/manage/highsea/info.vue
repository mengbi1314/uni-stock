<template>
    <view class="content">
        <u-cell-group>
            <u-cell title="客户头像">
                <!-- <u--image slot="right-icon" :src="info.avatar_cdn" :fade="true" duration="500" width="80px" height="80px" shape="circle"></u--image> -->
                <u--image slot="right-icon" :src="info.avatar_cdn" :fade="true" duration="500" width="80px" height="80px"
                    shape="circle"></u--image>
            </u-cell>
            <u-cell title="客户名称" :value="info.nickname"></u-cell>
            <u-cell title="性别" :value="info.gender_text"></u-cell>
            <u-cell title="手机号" :value="info.mobile_text"></u-cell>
            <u-cell title="邮箱" :value="info.email ? info.email : '暂未绑定邮箱'"></u-cell>
            <u-cell title="认证状态" :value="info.auth == 0 ? '未认证' : '已认证'"></u-cell>
            <u-cell title="客户来源" :value="info.sourceid_text"></u-cell>
            <u-cell title="成交状态" :value="info.deal_text"></u-cell>
            <u-cell title="创建时间" :value="info.createtime_text"></u-cell>
            <u-cell title="地区" :value="info.region.province + ' ' + info.region.city + ' ' + info.region.district"></u-cell>
        </u-cell-group>

        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    data() {
        return {
            info: {
                source: {}
            },
            id: 0,
        }
    },
    onLoad(option) {
        this.id = option.id ? option.id : 0

        this.getInfoData()
    },
    methods: {
        async getInfoData() {
            let result = await this.$u.api.manage.HighseaInfo({ busid: this.id })

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
                this.info = result.data
            }
        }
    }
}

</script>

<style>
.content {
    width: 90%;
    height: 100vh;
    margin: 0 auto;
}
</style>