<template>
	<view>
		<u-calendar :show="show" @close="show = !show"></u-calendar>
		<u-button @click="show = true">打开</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
		}
	},
	onLoad() {

	},
	methods: {

	}
}
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin: 200rpx auto 50rpx auto;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
