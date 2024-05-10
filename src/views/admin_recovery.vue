<template>
	<div class="login-log">
		<div class="top-ins">
			<el-select v-model="value" placeholder="请选择" class="select">
				<el-option v-for="item in cities" :key="item.name" :label="item.name" :value="item.name">
					<span style="float: left">{{ item.datetime }}</span>
					<span style="float: right; color: #8492a6; font-size: 13px">{{ item.name}}</span>
				</el-option>
			</el-select>
			<el-button type="success" @click="downlog">获取</el-button>
			<el-input v-model="input" placeholder="请输入搜索内容" style="width: 200px;"></el-input>
			<!-- <el-button type="primary">搜索</el-button> -->
		</div>
		<el-table :data="tableData.filter(data => !input || data.name.toLowerCase().includes(input.toLowerCase()))"
			height="10" border style="width: 100%" :default-sort="{prop: 'dateTime', order: 'descending'}">
			<el-table-column prop="datetime" label="日期" sortable width="180">
			</el-table-column>
			<el-table-column prop="prop" label="物品" width="180" align="center">
			</el-table-column>
			<el-table-column prop="number" label="数量" width="180" align="center">
			</el-table-column>
			<el-table-column prop="operate" label="类型" width="180" align="center">
				<template slot-scope="scope">
					{{scope.row.operate=="sold"?"出售":"购买"}}
				</template>
			</el-table-column>
			<el-table-column prop="name" label="名字" width="180" align="center">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">
							{{scope.row.steamid}}<br />点击复制
						</div>
						<el-button @click="copyText(scope.row.steamid)">{{scope.row.name}}</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="价格" width="180" align="center">
			</el-table-column>

			<el-table-column prop="area" label="地区" width="200" align="center">
				<template slot-scope="scope">
					{{scope.row.area}}
				</template>
			</el-table-column>
			<el-table-column prop="fund" label="交易商资金" width="180">
			</el-table-column>
			<el-table-column prop="newfund" label="剩余资金">
			</el-table-column>

		</el-table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				cities: [],
				value: "",
				tableData: [],
				input: ""
			}
		},
		created() {
			this.$axios({
				url: "/admin/getlog?group=economy"
			}).then(({
				data
			}) => {
				console.log(data);
				this.$data.cities = data.data
			})
		},
		methods: {
			downlog() {
				if (this.$data.value == "") {
					this.$message("未选择日志")
					return
				}
				console.log(this.$data.value);
				this.$axios({
					url: "/admin/getlog?group=economy&name=" + this.$data.value
				}).then(({
					data
				}) => {
					console.log(data);
					// this.$data.cities = data.data
					if (data.code == 200) {
						this.$message(`获取成功大小${parseInt(data.data.size/1024)}kb,解析中。。。。`)
						this.handleLoginLog(data.data.text)
					} else {
						this.$message(`获取失败`)
					}
				})
			},
			copyText(e) {
				let text = `#teleport ${e.x} ${e.y} ${e.z}`;
				this.$copyText(text).then(
					e => {
						this.$message("复制成功")
					},
					e => {
						this.$message("复制失败")
					}
				)
			},
			handleLoginLog(text) {
				// console.log(text);
				let economy = []
				let arrays = text.split("\n")
				for (let str of arrays) {
					if (str.match(/Trade.*Tradeable/)) {
						let rex =
							/(\d{4}\.\d{2}\.\d{2}-\d{2}\.\d{2}\.\d{2}): \[Trade\] Tradeable \(([^\(]*) \(x(\d*)\)\) ([^\s]*) by ([^\s]*)\((\d*)\) for (\d*) .*trader ([^\s]*),.* (-\d*|[^\s]\d*), new amount is (-\d*|[^\s]\d*), and effective users online: (\d*)/
						const matches = str.match(rex);
						console.log(matches);
						if (matches) {
							let datetime = this.$moment.utc(`${matches[1]}`, 'YYYY.MM.DD-HH.mm.ss').utcOffset(8).format(
								'YYYY-MM-DD HH:mm:ss');
							let prop = matches[2]
							let number = matches[3]
							let operate = matches[4]
							let name = matches[5]
							let steamid = matches[6]
							let price = matches[7]
							let area = matches[8]
							let fund = matches[9]
							let newfund = matches[10]
							let online = matches[11]

							economy.push({
								datetime,
								prop,
								number,
								operate,
								name,
								steamid,
								price,
								area,
								fund,
								newfund,
								online
							})
						}
					}
				}
				this.$data.tableData = economy
			}
		}
	}
</script>

<style>
	.top-ins {
		display: flex;
		background-color: white;
	}

	.login-log {
		width: 100%;
		height: 95%;
		display: flex;
		flex-flow: column;
	}

	.select {
		width: 300px;
	}
</style>