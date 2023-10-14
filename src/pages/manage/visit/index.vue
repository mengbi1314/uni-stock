<template>
    <view class="content">
        <u-cell-group>
            <u-swipe-action v-for="item in visitlist" :key="item.id" :autoClose="true">
                <u-swipe-action-item :options="options2" @click="changeOperation" :name="item.id">
                    <view class="swipe-action u-border-top u-border-bottom">
                        <view class="swipe-action__content">
                            <u-cell :title="item.content" :value="item.business.nickname"
                                :label="$u.timeFormat(item.createtime, 'yyyy年mm月dd日 hh:MM')" center></u-cell>
                        </view>
                    </view>
                </u-swipe-action-item>
            </u-swipe-action>
        </u-cell-group>
        <u-button @click="add" :customStyle="btnStyle" color="#19BC9C" type="success">添加回访记录</u-button>
        <u-modal :show="show" :content='content' :showCancelButton="true" @confirm="confirm"
            @cancel="show = false"></u-modal>
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
            visitlist: [],
            options2: [{
                text: '编辑',
                id: 'edit',
                style: {
                    backgroundColor: '#3c9cff'
                }
            },
            {
                text: '删除',
                id: 'del',
                style: {
                    backgroundColor: '#f56c6c'
                }
            }],
            LoginAdmin: {},
            show: false,
            content: '确认是否删除当前回访记录?',
            id: 0
        }
    },
    onShow() {
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {}

        this.getVisitData()
    },
    methods: {
        add() {
            this.$u.route({
                url: 'pages/manage/visit/add'
            })
        },
        async getVisitData() {
            let result = await this.$u.api.manage.VisitIndex({
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
                this.visitlist = result.data
            }


        },
        changeOperation(obj) {
            let index = obj.index ?? '';
            let id = obj.name ?? '';

            switch (index) {
                case 0:
                    this.$u.route({
                        url: 'pages/manage/visit/edit',
                        params: {
                            id
                        }
                    });
                    break;
                case 1:
                    this.show = true;
                    this.id = id;

                    break
            }
        },
        async confirm() {
            this.show = false;

            let result = await this.$u.api.manage.VisitDel({
                id: this.id,
                adminid: this.LoginAdmin.id
            })

            if (result.code === 0) {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500
                });

                return;
            } else {
                this.$refs.uToast.show({
                    type: 'success',
                    message: result.msg,
                    duration: 1500
                });

                this.getVisitData()

                return;
            }

        },
    },
}
</script>

<style>
.content {
    padding-bottom: 40px;
}
</style>