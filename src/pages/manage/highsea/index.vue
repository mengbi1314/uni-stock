<template>
	<view class="content">
		<u-cell-group>
			<u-cell :value="item.deal_text" v-for="item in highseaList" :key="item.id">
				<view slot="title" class="u-slot-title">
					<view>
						{{ item.nickname ? item.nickname : item.mobile }}
					</view>
				</view>
				<view slot="label" class="u-slot-label">
					<view style="color:#909193">
						<!-- 客户来源：{{ item.source.name ? item.source.name : '未知' }} -->
					</view>
					<view class="btn">
						<u-button type="primary" :customStyle="btnStyle" size="mini" text="详情"
							@click="Toinfo(item.id)"></u-button>
						<u-button type="success" :customStyle="btnStyle" size="mini" text="分配"
							@click="Toallot(item)"></u-button>
						<u-button type="warning" :customStyle="btnStyle" size="mini" text="申请"
							@click="onApply(item.id)"></u-button>
					</view>
				</view>
			</u-cell>
		</u-cell-group>

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
			content: '是否确认申请该客户?',
			// 客户id
			busid: 0,
			title: '申请'
		}
	},
	methods: {
		async getData() {
			let data = {
				adminid: this.LoginAdmin.id
			}

			let result = await this.$u.api.manage.HighseaIndex(data);

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

			this.highseaList = result.data;
		},
		Toinfo(businessid) {
			this.$u.route({
				url: 'pages/manage/highsea/info',
				params: {
					businessid
				}
			});
		},
		onApply(businessid) {

		},
		async confirm() {

		}
	},
	onShow() {
		this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};

		this.getData();
	}
}
</script>