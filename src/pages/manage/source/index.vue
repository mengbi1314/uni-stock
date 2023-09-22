<template>
    <view class="content">
        <u-cell-group>
            <u-swipe-action v-for="item in sourceList" :key="item.id" :autoClose="true">
                <u-swipe-action-item :options="options2" @click="changeOperation" :name="item.id">
                    <view class="swipe-action u-border-top u-border-bottom">
                        <view class="swipe-action__content">
                            <u-cell :title="item.name" center></u-cell>
                        </view>
                    </view>
                </u-swipe-action-item>
            </u-swipe-action>
        </u-cell-group>
        <u-button @click="toAdd" :customStyle="btnStyle" color="#19BC9C" type="success">添加</u-button>
        <u-modal :show="show" :title="title" :content='content' :showCancelButton="true" @confirm="confirm"
            @cancel="show = false"></u-modal>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>

<script>
export default {
    data() {
        return {
            sourceList: [],
            options2: [{
                text: '编辑',
                id: 'edit',
                style: {
                    backgroundColor: '#3c9cff'
                }
            }, {
                text: '删除',
                id: 'del',
                style: {
                    backgroundColor: '#f56c6c'
                }
            }],
            btnStyle: {
                width: '100%',
                position: 'fixed',
                bottom: '0px'
            },
            LoginAdmin: {},
            title: '',
            content: '',
            show: false
        }
    },
    methods: {
        confirm() {

        },
        toAdd() {
            this.$u.route('pages/manage/source/add');
        },
        changeOperation() {

        },
        async getSourceData() {
            let result = await this.$u.api.manage.SourceIndex({ adminid: this.LoginAdmin.id });

            if (result.code === 0) {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg,
                    complete: () => {

                        if (result.msg.indexOf('当前管理员账号') !== -1) {
                            uni.removeStorageSync('LoginAdmin');

                            this.$u.route({
                                url: 'pages/admin/index',
                                type: 'switchTab'
                            });

                            return;
                        }
                    }
                });

                return;
            }

            this.sourceList = result.data;
        }
    },
    onShow() {
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};

        this.getSourceData();
    }
}
</script>