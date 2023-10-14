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
						客户来源：{{ item.source.name ? item.source.name : '未知' }}
					</view>
					<view class="btn">
						<u-button type="primary" :customStyle="btnStyle" size="mini" text="详情"
							@click="getToinfo(item.id)"></u-button>
						<u-button type="success" :customStyle="btnStyle" size="mini" text="分配"
							@click="getToallot(item.id)"></u-button>
						<u-button type="warning" :customStyle="btnStyle" size="mini" text="申请"
							@click="getapplydata(item.id)"></u-button>
					</view>
				</view>
			</u-cell>
		</u-cell-group>

		<u-empty v-if="highseaList.length == 0" class="empty" mode="list"
			icon="https://cdn.uviewui.com/uview/empty/list.png" />
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
			id: 0,
		}
	},
	methods: {
		async getData() {
			let data = {
				adminid: this.LoginAdmin.id
			}

			let result = await this.$u.api.manage.HighseaIndex(data);

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
		getToinfo(busid) {
			this.$u.route({
				url: 'pages/manage/highsea/info?id=' + busid
			})
		},
		getToallot(busid) {
			this.$u.route({
				url: 'pages/manage/highsea/allot?id=' + busid
			})
		},
		getapplydata(id) {
			this.show = true

			this.id = id
		},
		async confirm() {
			this.show = false

			let data = {
				busid: this.id,
				adminid: this.LoginAdmin.id,
			}

			let result = await this.$u.api.manage.HighseaApply(data)

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