<template>
    <view class="content">
        <u-cell-group>
            <u-swipe-action v-for="item in receivelist" :key="item.id" :autoClose="false">
                <view class="swipe-action u-border-top u-border-bottom">
                    <view class="swipe-action__content">
                        <u-cell :title="item.business.nickname" :value="item.status_text"
                            :label="$u.timeFormat(item.applytime, 'yyyy年mm月dd日 hh:MM')" center></u-cell>
                    </view>
                </view>
            </u-swipe-action>
        </u-cell-group>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    data() {
        return {
            receivelist: [],
            LoginAdmin: {},
            show: false,
            id: 0
        }
    },
    onShow() {
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {}

        this.getReceiveData()
    },
    methods: {
        async getReceiveData() {
            let result = await this.$u.api.manage.ReceiveIndex({
                adminid: this.LoginAdmin.id
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
                this.receivelist = result.data
            }


        },
    },
}
</script>
