<template>
    <view class="container">
        <!-- 表单内容 -->
        <u--form labelPosition="left" :model="business" :rules="rules" ref="uForm">
            <u-form-item label="客户名称" prop="nickname" borderBottom>
                <u--input v-model="business.nickname" border="none" placeholder="请输入昵称"></u--input>
            </u-form-item>
            <u-form-item label="手机" prop="mobile" borderBottom>
                <u--input v-model="business.mobile" border="none" placeholder="请输入手机号"></u--input>
            </u-form-item>
            <u-form-item label="密码" prop="password" borderBottom>
                <u--input type="password" v-model="password" border="none" placeholder="登录密码为空即不修改密码"></u--input>
            </u-form-item>

            <u-form-item label="性别" prop="gender" borderBottom @click="show1 = true">
                <u--input type="text" v-model="business.gender_text" border="none" placeholder="请选择性别"></u--input>
            </u-form-item>
            <u-form-item label="客户来源" prop="sourceid" borderBottom @click="show2 = true">
                <u--input type="text" v-model="business.source.name" border="none" placeholder="请选择客户来源"></u--input>
                <u-icon slot="right" name="arrow-right"></u-icon>
            </u-form-item>
            <u-form-item label="成交状态" prop="deal_text" borderBottom @click="show3 = true">
                <u--input type="text" v-model="business.deal_text" border="none" placeholder="请选择成交状态"></u--input>
            </u-form-item>

            <u-form-item label='选择地区' prop='region_text' @click="RegionShow = true">
                <pick-regions :defaultRegion="business.region" @getRegion="handleGetRegion">
                    <u--input v-model="region_text" disabled disabledColor="#ffffff" placeholder="请选择地区" border="none">
                    </u--input>
                    <u-icon slot="right" name="arrow-right">
                    </u-icon>
                </pick-regions>
                <u-icon slot="right" name="arrow-right">
                </u-icon>
            </u-form-item>
        </u--form>
        <view style="margin-top: 25px;">
            <u-button type="warning" @click="submit">修改资料</u-button>
        </view>
        <u-picker :show="show1" :columns="columns" keyName="label" @confirm="onGender" @cancel="show1 = false"></u-picker>
        <u-picker :show="show2" :columns="sourceList" keyName="label" @confirm="onSource" @cancel="show2 = false"></u-picker>
        <u-picker :show="show3" :columns="dealList" keyName="label" @confirm="onDeal" @cancel="show3 = false"></u-picker>
        <u-toast ref="uToast"></u-toast>
    </view>
</template>
<script>
import pickRegions from "@/components/pick-regions/pick-regions.vue";
export default {
    components: {
        pickRegions
    },
    data() {
        return {
            business: {
                nickname: '',
                mobile: '',
                password: '',
                gender: '',
                auth: '',
                sourceid: '',
                region: ''
            },
            password: '',
            region_text: '',
            sourceList: [],
            LoginAdmin: {},
            fileList: [],
            showSex: false,
            busid: '',
            show1: false,
            show2: false,
            show3: false,
            columns: [
                [
                    {
                        label: '保密',
                        id: 0
                    },
                    {
                        label: '男',
                        id: 1
                    },
                    {
                        label: '女',
                        id: 2
                    }
                ]
            ],
            dealList: [
                [
                    {
                        label: '未成交',
                        id: 0
                    },
                    {
                        label: '已成交',
                        id: 1
                    }
                ]
            ],
            rules: {
                mobile: [
                    {
                        // 自定义验证函数，见上说明
                        validator: (rule, value, callback) => {
                            // 上面有说，返回true表示校验通过，返回false表示不通过
                            // uni.$u.test.mobile()就是返回true或者false的
                            if (value) {
                                return uni.$u.test.mobile(value);
                            } else {
                                return true
                            }
                        },
                        message: '手机号码不正确',
                        // 触发器可以同时用blur和change
                        trigger: ['change', 'blur'],
                    }],
                email: [{
                    type: 'email',
                    required: false,
                    message: '请填正确的邮箱',
                    trigger: ['blur', 'change']
                }],
                // gender: [{
                //     required: false,
                //     message: '请选择性别',
                //     trigger: ['blur', 'change']
                // }],
                // sourceid: [{
                //     required: false,
                //     message: '请选择客户来源',
                //     trigger: ['blur', 'change']
                // }],
                // auth: [{
                //     required: false,
                //     message: '请选择成交状态',
                //     trigger: ['blur', 'change']
                // }],
                // region: [{
                //     required: false,
                //     message: '请选择地区',
                //     trigger: ['blur', 'change']
                // }],
            },
        }
    },
    methods: {
        sexSelect(e) {
            console.log(e);
        },
        async getInfo() {
            let data = {
                busid: this.busid,
                adminid: this.LoginAdmin.id
            }
            let result = await this.$u.api.manage.PrivateInfo(data);
            if (result.code === 0) {
                this.$refs.uToast.show({
                    type: 'warning',
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
            this.business = result.data;
            let region = [];
            if (result.data.province) {
                region.push(result.data.province);
            }
            if (result.data.city) {
                region.push(result.data.city);
            }
            if (result.data.district) {
                region.push(result.data.district);
            }
            this.business.region = region;
            this.region_text = result.data.region_text;
            console.log(this.business.region);
        },
        onGender(e) {
            // console.log(e.value[0].label);
            this.business.gender = e.value[0].id;
            this.business.gender_text = e.value[0].label;
            this.show1 = false;
            // console.log(this.business);
        },
        onSource(e) {
            this.business.source.name = e.value[0].label;
            this.business.sourceid = e.value[0].id;
            this.show2 = false;
        },
        onDeal(e) {
            // console.log(e.value[0].label);
            this.business.deal_text = e.value[0].label;
            this.business.deal = e.value[0].id;
            this.show3 = false;
        },

        async getList() {
            let result = await this.$u.api.manage.PrivateSource();
            let List = [];
            for (let item of result.data) {
                List.push(
                    {
                        label: item.name,
                        id: item.id
                    }
                )
            }
            this.sourceList.push(List);
            // console.log(this.sourceList);
        },
        handleGetRegion(values) {
            let [province, city, district] = values;
            let region = [];
            if (province) {
                region.push(province.code);
                this.region_text = province.name;
            }
            if (city) {
                region.push(city.code);
                this.region_text += city.name;
            }
            if (district) {
                region.push(district.code);
                this.region_text += district.name
            }
            this.business.region = region;
        },
        submit() {
            this.$refs.uForm.validate().then(async () => {
                let data = {
                    id: this.busid,
                    nickname: this.business.nickname,
                    mobile: this.business.mobile,
                    gender: this.business.gender,
                    sourceid: this.business.sourceid,
                    auth: this.business.auth,
                    region: this.business.region
                }
                if (this.password) {
                    data.password = this.password;
                }
                let result = await this.$u.api.manage.PrivateseaEdit(data);
                if (result.code === 0) {
                    this.$refs.uToast.show({
                        type: 'error',
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
                            this.$u.route({
                                type: 'back'
                            })
                        }
                    })
                    return;
                }
            }).catch((err) => { })
        }

    },
    onLoad(options) {
        this.busid = options.busid ? options.busid : 0;
        this.LoginAdmin = uni.getStorageSync('LoginAdmin') ?? {};
        this.getInfo();
        this.getList();
    },
    onReady() {
        this.$refs.uForm.setRules(this.rules);
    }
}
</script>

<style>
.container {
    height: 100%;
    margin: 0 50rpx;
    box-sizing: border-box;
}

.avatar {
    text-align: center;
}

.u-avatar {
    margin: 80rpx auto 40rpx;
}

.xcx {
    width: 200rpx;
    height: 200rpx;
    margin: 80rpx auto 40rpx;
    border-radius: 100%;
    overflow: hidden;
}

.nickname {
    font-size: 14px;
    text-align: center;
}

.title {
    text-align: center;
    margin: 40rpx 0;
    font-size: 14rpx;
}

.avatar .u-upload {
    justify-content: center;
    align-items: center;
    margin: 3em auto;

}
</style>