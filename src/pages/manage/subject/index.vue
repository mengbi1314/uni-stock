<template>
    <view class="content">
        <u-cell-group>
            <u-collapse accordion v-for="item in orderList" :key="item.id">

                <u-collapse-item :title="item.code" name="Variety components">
                    <text class="u-collapse-content">姓名： <text class="strong">{{ item.business.nickname }}</text></text>
                    <text class="u-collapse-content">课程名称：<text class="strong">{{ item.subject.title }}</text></text>
                    <text class="u-collapse-content">课程金额：<text class="strong">{{ item.total }}</text></text>
                    <text class="u-collapse-content">课程评价：<text class="strong">{{ item.comment ? item.comment :
                        '暂未评论' }}</text></text>
                    <text class="u-collapse-content">购买时间：<text class="strong">{{ item.createtime_text }}</text></text>
                    <view class="btn">
                        <u-button type="error" :customStyle="btnStyle" size="mini" text="删除订单"
                            @click="onDel(item.id)"></u-button>
                    </view>
                </u-collapse-item>
            </u-collapse>
        </u-cell-group>

        <u-modal :show="show" :content='content' :title="title" :showCancelButton="true" @confirm="confirm"
            @cancel="cancel"></u-modal>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>
           
<script>
export default {
    data() {
        return {
            btnStyle: {
                width: '16%',
                display: "inline-block",
                marginRight: '5px',
                marginTop: '10px',
                lineHeight: '20px',
            },
            orderList: [],
            LoginAdmin: {},
            show: false,
            title: '删除订单记录',
            content: '是否确认删除该订单?',
            // 订单id
            orderid: 0,
        }
    },
    onShow() {
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};

        this.getSubjectData();
    },
    methods: {
        async getSubjectData() {
            let result = await this.$u.api.manage.SubjectIndex({ adminid: this.LoginAdmin.id });
            console.log(result.data);
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
                this.orderList = result.data
            }
        },
        onDel(id) {
            this.show = true
            this.orderid = id
        },
        cancel() {
            this.show = false
        },
        async confirm() {
            this.show = false;

            let data = {
                adminid: this.LoginAdmin.id,
                orderid: this.orderid,
            }

            let result = await this.$u.api.manage.SubjectDel(data)

            if (result.code === 0) {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500,
                });

                return;
            } else {
                this.$refs.uToast.show({
                    type: 'success',
                    message: result.msg,
                    duration: 1500,
                });

                this.getSubjectData();

                return;
            }
        },
    },
}
</script>

<style>
.strong {
    font-size: 16px;
}
</style>