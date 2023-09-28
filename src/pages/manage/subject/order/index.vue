<template>
    <view class="content">
        <u-list @scrolltolower="scrolltolower">
            <u-list-item v-for="item in orderlist" :key="item.id">
                <u-cell>
                    <view slot="value">

                        <view class="btn">
                            <u-button type="error" :customStyle="btnStyle" size="mini" text="删除"
                                @click="getdeldata(item, 'error')">
                            </u-button>
                        </view>
                    </view>
                    <view slot="title" class="u-slot-title">

                        <view style="padding-bottom: 5px;">
                            用户名：{{ item.business.nickname }}
                        </view>
                        <view style="padding-bottom: 5px;">
                            课程名称：{{ item.subject.title }}
                        </view>
                        <view style="padding-bottom: 8px;">
                            价格：￥{{ item.total }}元
                        </view>
                    </view>
                    <view slot="label" class="u-slot-label">
                        <view style="color:#909193">
                            订单号：{{ item.code }}
                        </view>
                    </view>
                </u-cell>
            </u-list-item>
        </u-list>
        <u-modal :show="show" :content='content' :showCancelButton="true" @confirm="confirm" @cancel="show = false">
        </u-modal>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    data() {
        return {
            btnStyle: {
                width: '10%',
                display: "inline-block",
                marginRight: '5px',
                marginTop: '10px',
                lineHeight: '20px'
            },
            orderlist: [],
            LoginUser: {},
            show: false,
            content: '确认是否删除当前用户?',
            id: 0,
            // error: 表示是调用删除确认框， warning：表示是调用申请确认框
            status: 'error'
        }
    },
    onLoad() {
        this.LoginUser = uni.getStorageSync('LoginUser') ? uni.getStorageSync('LoginUser') : {};
        this.$u.auth.check()
        this.getorderdata()
    },
    methods: {
        scrolltolower() {
            this.getorderdata()
        },
        async getorderdata() {
            let result = await this.$u.api.subject.orderIndex()
            if (result.code == 1) {
                this.orderlist = result.data
            }
        },
        getdeldata(val, status) {
            this.content = "确认是否删除当前订单?"
            this.show = true
            this.id = val.id
            this.status = status
        },
        async confirm() {
            this.show = false
            var result = {}
            if (this.status == "error") {
                result = await this.$u.api.subject.orderDel({
                    id: this.id
                })
            }
            if (result.code == 1) {
                this.$refs.uToast.show({
                    type: 'success',
                    message: result.msg,
                })
                this.getorderdata()
            } else {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg
                })
            }
        }
    }
}
</script>

<style>
.content {
    height: 100vh;
}

.btn {}
</style>
