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
			<el-table-column label="被杀者" width="180" align="center">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">
							{{scope.row.Died}}<br />{{scope.row.DiedSteamId}}<br />{{scope.row.DiedPos}}<br />点击复制传送代码
						</div>
						<el-button @click="copyText(scope.row.DiedPos)">{{scope.row.Died}}</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column label="击杀者" width="180" align="center">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">
							{{scope.row.Killer}}<br />{{scope.row.KillerSteamId}}<br />{{scope.row.KillerPos}}<br />点击复制传送代码
						</div>
						<el-button @click="copyText(scope.row.KillerPos)">{{scope.row.Killer}}</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column label="武器" width="200" align="center">
				<template slot-scope="scope">
					{{scope.row.Weapon}}
				</template>
			</el-table-column>
			<el-table-column prop="Distance" label="距离" width="180">
			</el-table-column>
			<el-table-column prop="type" label="击杀类型">
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
				url: "/admin/getlog?group=event"
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
					url: "/admin/getlog?group=event&name=" + this.$data.value
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
				let kill = []
				let arrays = text.split("\n")
				// console.log(arrays);
				let regex =
					/(\d{4}\.\d{2}\.\d{2}-\d{2}\.\d{2}\.\d{2}): (.+)/;
				for (let str of arrays) {
					// console.log(str);
					let maches = str.match(regex)
					console.log(maches);
					if (maches) {
						if (maches[2].match(/Game version:/)) {

							console.log(1);
						} else if (maches[2].match(/Died/)) {

							console.log(maches[2]);
							let dateTime = this.$moment.utc(`${maches[1]}`, 'YYYY.MM.DD-HH.mm.ss').utcOffset(8).format(
								'YYYY-MM-DD HH:mm:ss');
							/* let rex = maches[2].match(
								/Died: ([^\s]*) \((\d{17})\), Killer: ([^\s]*) \((\d{17})\) Weapon: ([^\s]*) \[([^\[]*)\] S\[KillerLoc : ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+) VictimLoc: ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), Distance: (\d*\.\d*\sm)\] C\[KillerLoc: ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), VictimLoc: ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), Distance: (\d*\.\d*\sm)\]/
							) */
							let rex = maches[2].match(
								/Died: ([^\s]*) \((\d{17})\), Killer: ([^\s]*) \((\d{17})\) Weapon: (.*) \[(.*)\] S(:?)\[KillerLoc : ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+) VictimLoc: ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), ([^\s]\d+\.\d+|[^-\s]\d+\.\d+), Distance: (\d*\.\d*\sm)\]/
							)
							console.log(rex);
							if (rex) {
								kill.push({
									datetime: dateTime,
									Died: rex[1],
									DiedSteamId: rex[2],
									Killer: rex[3],
									KillerSteamId: rex[4],
									Weapon: rex[5],
									type: rex[6],
									DiedPos: {
										x: rex[8],
										y: rex[9],
										z: rex[10]
									},
									KillerPos: {
										x: rex[11],
										y: rex[12],
										z: rex[13]
									},
									Distance: rex[14]
								})
							}
							/* 
							 [
							     "Died: 男神GGboon (76561199541123628), Killer: Damfone (76561198973728456) Weapon: Weapon_AK47_C [Projectile] S[KillerLoc : -37425.74, -488739.09, 525.56 VictimLoc: -37507.27, -489310.47, 544.46, Distance: 5.77 m] C[KillerLoc: -37425.74, -488739.09, 525.56, VictimLoc: -37404.60, -489266.63, 544.46, Distance: 5.28 m]",
							     "男神GGboon",
							     "76561199541123628",
							     "Damfone",
							     "76561198973728456",
							     "Weapon_AK47_C",
							     "Projectile",
							     "KillerLoc",
							     "-37425.74",
							     "-488739.09",
							     "525.56",
							     "-37507.27",
							     "-489310.47",
							     "544.46",
							     "5.77 m",
							     "-37425.74",
							     "-488739.09",
							     "525.56",
							     "-37404.60",
							     "-489266.63",
							     "544.46",
							     "5.28 m"
							 ]
							 */
						} else {

							// console.log(6, JSON.parse(maches[2]));
						}

					}
				}
				this.$data.tableData = kill
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