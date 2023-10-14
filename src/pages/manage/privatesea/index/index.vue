<template>
    <view class="content">
        <u-cell-group>
            <u-cell :value="item.deal_text" v-for="item in privateseaList" :key="item.id">
                <view slot="title" class="u-slot-title">
                    <view>
                        {{ item.nickname ? item.nickname : item.mobile }}
                    </view>
                </view>
                <view slot="label" class="u-slot-label">
                    <view style="color:#909193">
                        客户来源：{{ item.source.name ? item.source.name : '未知' }}
                    </view>
                    <view class="btn">
                        <u-button type="primary" :customStyle="btnStyle" size="mini" text="详情"
                            @click="Toinfo(item.id)"></u-button>
                        <u-button type="success" color="#33cc99" :customStyle="btnStyle" size="mini" text="回收"
                            @click="onRecovery(item.id, 'recovery')"></u-button>
                        <u-button type="warning" :customStyle="btnStyle" size="mini" text="编辑"
                            @click="onEdit(item.id)"></u-button>
                        <u-button type="error" :customStyle="btnStyle" size="mini" text="删除"
                            @click="onDel(item.id, 'Del')"></u-button>
                    </view>
                </view>
            </u-cell>
        </u-cell-group>

        <u-modal :show="show" :content='content' :showCancelButton="true" @confirm="confirm"
            @cancel="show = false"></u-modal>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>
<script>
export default {
    data() {
        return {
            privateseaList: {},
            show: false,
            content: '',
            title: '',
            action: '',
            btnStyle: {
                width: '10%',
                display: "inline-block",
                marginRight: '5px',
                marginTop: '10px',
                lineHeight: '20px'
            },
            LoginAdmin: {}
        }
    },
    methods: {
        async getPrivatesea() {
            let data = {
                adminid: this.LoginAdmin.id
            }
            let result = await this.$u.api.manage.PrivateseaIndex(data);
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
            this.privateseaList = result.data;
        },
        Toinfo(busid) {
            this.$u.route({
                url: '/pages/manage/privatesea/info/info',
                params: {
                    busid
                }
            })
        },
        onEdit(busid) {
            this.$u.route({
                url: '/pages/manage/privatesea/edit/edit',
                params: {
                    busid
                }
            })
        },
        onRecovery(busid) {
            this.show = true;
            this.title = '回收';
            this.content = '确定要回收该私海客户吗？';
            this.busid = busid;
            this.action = 'recovery';
        },
        onDel(busid) {
            this.show = true;
            this.title = '删除';
            this.content = '确定要删除该私海客户吗?';
            this.busid = busid;
            this.action = 'del';
        },
        async confirm() {
            this.show = false;
            if (this.action === 'recovery') {
                let data = {
                    adminid: this.LoginAdmin.id,
                    busid: this.busid
                }
                let result = await this.$u.api.manage.PrivateseaRecovery(data);
                if (result.code === 0) {
                    this.$refs.uToast.show({
                        type: "error",
                        message: result.msg,
                        duration: 1500
                    })
                    return;
                } else {
                    this.$refs.uToast.show({
                        type: "success",
                        message: result.msg,
                        duration: 1500,
                        complete: () => {
                            this.getPrivatesea();
                        }
                    })
                    return;
                }
            } else {
                let data = {
                    adminid: this.LoginAdmin.id,
                    busid: this.busid
                }
                let result = await this.$u.api.manage.PrivateseaDel(data);
                if (result.code === 0) {
                    this.$refs.uToast.show({
                        type: "error",
                        message: result.msg,
                        duration: 1500
                    })
                    return;
                } else {
                    this.$refs.uToast.show({
                        type: 'success',
                        message: result.msg,
                        duration: 1500,
                        complete: () => {
                            this.getPrivatesea();
                        }
                    })
                    return;
                }
            }
        }
    },
    onShow() {
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};
        this.getPrivatesea();
    }
}
</script>
