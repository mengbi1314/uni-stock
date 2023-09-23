<template>
	<view class="container">
		<view class="title">数量统计</view>
		<view class="achieve">
			<view class="order bg-abstract">
				<view class="label">
					<u-icon class="icon" size="30" color="#fff" name="order" />总订单数
				</view>
				<view class="count">{{ total.OrderCount }} 单</view>
			</view>
			<view class="sale bg-abstract">
				<view class="label">
					<u-icon class="icon" size="30" color="#fff" name="shopping-cart" />总销售额
				</view>
				<view class="money">{{ total.OrderMoney }} 元</view>
			</view>
			<view class="profit bg-abstract">
				<view class="label">
					<u-icon class="icon" size="30" color="#fff" name="man-add" />总客户量
				</view>
				<view class="count">{{ total.BusinessCount }} 个</view>
			</view>
		</view>

		<view class="title">客户分析</view>
		<view class="ChartsBox">
			<qiun-data-charts type="column" :opts="Businessopts" :chartData="BusinessData" />
		</view>

		<view class="title">回访分析</view>
		<view class="ChartsBox">
			<qiun-data-charts type="line" :opts="VisitOpts" :chartData="VisitData" />
		</view>
		<view class="title">领取分析</view>
		<view class="ChartsBox">
			<qiun-data-charts type="line" :opts="ReceiveOpts" :chartData="ReceiveData" />
		</view>
		<view class="title">订单分析</view>
		<view class="ChartsBox">
			<qiun-data-charts type="mount" :opts="OrderOpts" :chartData="OrderData" />
		</view>
		<view class="title">来源分析</view>
		<view class="ChartsBox">
			<qiun-data-charts type="pie" :opts="SourceOpts" :chartData="SourceData" />
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			total: {
				OrderCount: 0,
				OrderMoney: 0,
				BusinessCount: 0
			},
			BusinessData: {},
			Businessopts: {
				color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
				padding: [15, 15, 0, 5],
				enableScroll: false,
				legend: {},
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					data: [
						{
							min: 0
						}
					]
				},
				extra: {
					column: {
						type: "group",
						width: 30,
						activeBgColor: "#000000",
						activeBgOpacity: 0.08
					}
				}
			},
			month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			VisitData: {},
			VisitOpts: {
				color: ["#EE6666"],
				padding: [15, 10, 0, 15],
				legend: {},
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					// 横向向网格线型：虚线
					gridType: "dash",
					// 横向网格为虚线时，单段虚线长度
					dashLength: 2
				},
				extra: {
					line: {
						// 尖角折线模
						type: "straight",
						// 折线的宽度
						width: 2,
						// 激活指示点类型：空心点模式
						activeType: "hollow"
					}
				}
			},
			ReceiveOpts: {
				color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
					"#ea7ccc"
				],
				padding: [15, 10, 0, 15],
				legend: {},
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					gridType: "dash",
					dashLength: 2
				},
				extra: {
					line: {
						type: "straight",
						width: 2,
						activeType: "hollow"
					}
				}
			},
			ReceiveData: {},
			OrderOpts: {
				color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
					"#ea7ccc"
				],
				padding: [15, 15, 0, 5],
				legend: {},
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					data: [{
						min: 0
					}]
				},
				extra: {
					// 山峰图
					mount: {
						// 山峰类型：圆角
						type: "mount",
						// 山峰图每个山峰的图形宽度比例 0 - 2之间
						widthRatio: 1.5
					}
				}
			},
			OrderData: {},
			SourceOpts: {
				color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
					"#ea7ccc"
				],
				padding: [5, 5, 5, 5],
				extra: {
					pie: {
						// 启用Tooltip点击时，突出部分的透明度
						activeOpacity: 0.5,
						// 启用Tooltip点击时，突出部分的宽度（最大值不得超过labelWidth）
						activeRadius: 10,
						// 起始角度偏移度数，顺时针方向，起点为3点钟位置为0度
						offsetAngle: 0,
						// 数据标签到饼图外圆连线的长度
						labelWidth: 15,
						// 是否绘制各类别中间的分割线
						border: false,
						// 分割线的宽度
						borderWidth: 3,
						// 分割线的颜色
						borderColor: "#FFFFFF"
					}
				}
			},
			SourceData: {},
		}
	},
	onShow() {
		this.getTotalData();
		this.getBusinessData();
		this.getVisitData();
	},
	methods: {
		async getTotalData() {
			let result = await this.$u.api.controller.ControllerTotal();

			this.total = result.data;
		},
		async getBusinessData() {

			let result = await this.$u.api.controller.ControllerBusiness();

			//模拟从服务器获取数据时的延时
			setTimeout(() => {
				//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				let res = {
					categories: this.month,
					series: [
						{
							name: "未认证",
							data: result.data.noCertified
						},
						{
							name: "已认证",
							data: result.data.Certified
						}
					]
				};
				this.BusinessData = JSON.parse(JSON.stringify(res));
			}, 500);
		},
		async getVisitData() {
			let result = await this.$u.api.controller.ControllerVisit();

			//模拟从服务器获取数据时的延时
			setTimeout(() => {
				//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				let res = {
					categories: this.month,
					series: [
						{
							name: "回访人数",
							data: result.data
						}
					]
				};
				this.VisitData = JSON.parse(JSON.stringify(res));
			}, 500);
		}
	}
}
</script>

<style>
.container {
	padding: 0px 10px;
}

.title {
	font-weight: bold;
	font-size: 15px;
	padding: 15px 0px;
}

.achieve {
	height: 100px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #fff;
}

.achieve .order,
.achieve .sale,
.achieve .profit,
.global .visitor,
.global .order,
.global .sale {
	position: relative;
	height: 100%;
	border-radius: 4px;
	width: 32%;
}

.achieve .order {
	background-color: #3c9cff;
}

.achieve .sale {
	background-color: #f9ae3d;
}

.achieve .profit {
	background-color: #5ac725;
}

.achieve .count,
.global .count {
	font-size: 14px;
	font-weight: bold;
	position: absolute;
	right: 10px;
	bottom: 10px;
}

.achieve .money,
.global .money {
	font-size: 14px;
	font-weight: bold;
	position: absolute;
	right: 10px;
	bottom: 10px;
}

.money::before {
	content: "¥";
	margin-right: 2px;
	font-weight: normal;
	font-size: 14px;
}

.achieve .label,
.global .label {
	font-size: 14px;
	position: absolute;
	top: 10px;
	left: 10px;
	text-align: center;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.achieve .label .icon,
.global .label .icon {
	margin-right: 4px;
}

.ChartsBox {
	width: 100%;
	height: 300px;
}
</style>