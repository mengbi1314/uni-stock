<template>
	<view class="content">
		<u-cell-group>
			<u-cell title="客户头像">
				<!-- <view
                    slot="value"
                    class="avatar"
                > -->
				<u--image slot="right-icon" :src="info.avatar_cdn" width="80" height="80" shape="circle"></u--image>
				<!-- </view> -->
			</u-cell>
			<u-cell title="客户名称" :value="info.nickname ? info.nickname : '未设置昵称'"></u-cell>
			<u-cell title="性别" :value="info.gender_text"></u-cell>
			<u-cell title="手机号" :value="info.mobile_text"></u-cell>
			<u-cell title="邮箱" :value="info.email" v-if="info.email"></u-cell>
			<u-cell title="认证状态" :value="info.auth == 1 ? '已认证' : '未认证'"></u-cell>
			<u-cell title="客户来源" :value="info.source.name ? info.source.name : '未知来源'"></u-cell>
			<u-cell title="成交状态" :value="info.deal_text"></u-cell>
			<u-cell title="创建时间" :value="$u.timeFormat(info.createtime, 'yyyy年mm月dd日')"></u-cell>
			<u-cell title="地区" :value="info.region_text" v-if="info.region_text"></u-cell>
		</u-cell-group>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			businessid: 0,
			LoginAdmin: {},
			info: {}
		}
	},
	methods: {
		async getInfo() {
			let data = {
				businessid: this.businessid,
				adminid: this.LoginAdmin.id
			}

			let result = await this.$u.api.manage.HighseaInfo(data);

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
			}

			this.info = result.data;
		}
	},
	onLoad(options) {
		this.businessid = options.businessid ? options.businessid : 0;
	},
	onShow() {
		this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};

		this.getInfo();
	}
}
</script>