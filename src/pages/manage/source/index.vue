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
            title: '删除客户来源',
            content: '是否确认删除该客户来源？',
            show: false,
            id: 0,// 客户来源id
        }
    },
    methods: {
        async confirm() {
            this.show = false;

            let data = {
                id: this.id,
                adminid: this.LoginAdmin.id
            }

            let result = await this.$u.api.manage.SourceDel(data);

            if (result.code === 0) {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg
                });

                return;
            } else {
                this.$refs.uToast.show({
                    type: 'success',
                    message: result.msg,
                    complete: () => {
                        this.getSourceData();
                    }
                });

                return;
            }
        },
        toAdd() {
            this.$u.route('pages/manage/source/add');
        },
        changeOperation(res) {
            let index = res.index;

            switch (index) {
                case 0:
                    this.$u.route({
                        url: 'pages/manage/source/edit',
                        params: {
                            id: res.name
                        }
                    });
                    break;

                case 1:
                    this.show = true;
                    this.id = res.name;
                    break;
            }
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