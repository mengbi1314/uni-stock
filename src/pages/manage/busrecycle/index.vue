<template>
    <view class="content">
        <u-cell-group>
            <u-cell :value="$u.timeFormat(item.deletetime, '删除时间：yyyy年mm月dd日 hh:MM')" v-for="item in highseaList"
                :key="item.id">
                <view slot="title" class="u-slot-title">
                    <view>
                        {{ item.nickname ? item.nickname : item.mobile }}
                    </view>
                </view>
                <view slot="label" class="u-slot-label">
                    <view style="color:#909193">
                        客户来源：{{ item.sourceid_text ? item.sourceid_text : '未知' }}
                    </view>
                    <view class="btn">
                        <u-button type="success" color="#33cc99" :customStyle="btnStyle" size="mini" text="还原"
                            @click="onRestore(item.id, 'res')"></u-button>
                        <u-button type="error" :customStyle="btnStyle" size="mini" text="删除"
                            @click="onDel(item.id, 'del')"></u-button>
                    </view>
                </view>
            </u-cell>
        </u-cell-group>

        <u-empty v-if="highseaList.length == 0" class="empty" mode="list"
            icon="https://cdn.uviewui.com/uview/empty/list.png" />
        <u-modal :show="show" :title="title" :content='content' :showCancelButton="true" @confirm="confirm"
            @cancel="show = false"></u-modal>
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
            highseaList: [],
            LoginAdmin: {},
            show: false,
            content: '是否确认删除该客户?',
            // 客户id
            busid: 0,
            action: 'del',
            title: '提示',
        }
    },
    methods: {
        async getData() {
            let data = {
                adminid: this.LoginAdmin.id
            }

            let result = await this.$u.api.manage.BusrecycleIndex(data);

            if (result.code === 0 && JSON.stringify(result.data) === '[]') {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500,
                    complete: () => {
                        this.$u.route({
                            type: 'navigateTo',
                            url: '/pages/manage/base/index'
                        });
                    }
                });

                return;
            }

            this.highseaList = result.data;
        },
        onRestore(busid, action) {
            this.show = true
            this.busid = busid
            this.title = "还原客户"
            this.content = '是否还原该客户?'
            this.action = action
        },
        onDel(busid, action) {
            this.show = true
            this.busid = busid
            this.title = "删除客户"
            this.content = '是否删除该客户?'
            this.action = action
        },
        async confirm() {
            this.show = false

            let result = null;

            if (this.action === 'res') {

                let data = {
                    busid: this.busid,
                    adminid: this.LoginAdmin.id,
                }

                result = await this.$u.api.manage.BusrecycleRestore(data)

            } else if (this.action === 'del') {

                let data = {
                    busid: this.busid,
                    adminid: this.LoginAdmin.id,
                }

                result = await this.$u.api.manage.BusrecycleDel(data)

            }

            if (result.code === 1) {
                this.$refs.uToast.show({
                    type: 'success',
                    message: result.msg,
                    duration: 1500,
                    complete: () => {
                        this.getData()
                    }
                })

                return
            } else {
                this.$refs.uToast.show({
                    type: 'error',
                    message: result.msg,
                    duration: 1500
                })

                return
            }
        }
    },
    onShow() {
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};

        this.getData();
    }
}
</script>

<style>
.empty {
    margin: auto;
}
</style>