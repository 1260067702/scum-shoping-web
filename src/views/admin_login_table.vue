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
			<el-table-column prop="userid" label="用户ID" width="50">
			</el-table-column>
			<el-table-column prop="dateTime" label="日期" sortable width="180">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="180">
			</el-table-column>
			<el-table-column prop="steamid" label="SteamID" width="180">
			</el-table-column>
			<el-table-column prop="action" label="类型">
				<template slot-scope="scope">
					<el-tag :type="scope.row.action=='上线'?'success':'danger'">{{scope.row.action}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="ip" label="登录IP">
			</el-table-column>
			<el-table-column label="位置" width="100">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">x:{{scope.row.x }} y:{{ scope.row.y}} z:{{scope.row.z}}<br />点击复制传送代码
						</div>
						<el-button @click="copyText({x:scope.row.x,y:scope.row.y,z:scope.row.z})">查看</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="x" label="X" >
			</el-table-column>
			<el-table-column prop="y" label="Y">
			</el-table-column>
			<el-table-column prop="z" label="Z" >
			</el-table-column> -->
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
				url: "/admin/getlog?group=login"
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
					url: "/admin/getlog?group=login&name=" + this.$data.value
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
			handleLoginLog(text) {
				// console.log(text);
				let logins = []
				let arrays = text.split("\n")
				// console.log(arrays);
				let regex =
					/(\d{4}\.\d{2}\.\d{2}-\d{2}\.\d{2}\.\d{2}): '(\d+\.\d+\.\d+\.\d+) (\d{17}):([^(]+)\((\d+)\)\' logged (in|out) at: X=(-*\d+\.\d+) Y=(-*\d+\.\d+) Z=(-*\d+\.\d+)/;
				for (let str of arrays) {
					let matches = str.match(regex)
					// console.log(matches);
					// console.log(this.$moment);
					if (matches) {
						let dateTime = this.$moment.utc(`${matches[1]}`, 'YYYY.MM.DD-HH.mm.ss').utcOffset(8).format(
							'YYYY-MM-DD HH:mm:ss');;
						// console.log(dateTime);
						const ip = matches[2]
						let steamid = matches[3]
						const name = matches[4];
						let userid = matches[5]
						const action = matches[6] == "in" ? "上线" : "下线";
						const x = matches[7];
						const y = matches[8];
						const z = matches[9];
						logins.push({
							dateTime,
							ip,
							name,
							steamid,
							userid,
							action,
							x,
							y,
							z
						})
					}
				}

				this.$data.tableData = logins
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