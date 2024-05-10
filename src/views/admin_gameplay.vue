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
			<el-table-column prop="datetime" label="日期" sortable width="180">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="180" align="center">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">{{scope.row.steamid}}
						</div>
						<el-button>{{scope.row.name}}</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="action" label="状态" align="center" width="80">
				<template slot-scope="scope">
					<el-tag
						:type="scope.row.success=='Yes'?'success':'danger'">{{scope.row.success=='Yes'?'成功':'失败'}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="time" label="时长" align="center" width="80">
			</el-table-column>
			<el-table-column prop="count" label="次数" width="50" align="center">
			</el-table-column>
			<el-table-column label="目标" align="center">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">{{scope.row.target}}
						</div>
						<!-- <el-button>{{scope.row.target=='BPLockpick_Weapon_Locker_Police_C'?"警察局武器柜":scope.row.target}}</el-button> -->
						<el-tag effect="dark">
							{{scope.row.target=='BPLockpick_Weapon_Locker_Police_C'?"警察局武器柜":
							scope.row.target=='BPLockpick_Weapon_Locker_Military_C'?'普通武器柜':
							scope.row.target=="BPLockpick_CargoDrop_01_ArmoryBox_C"?"空投":
							scope.row.target=="BPLockpick_Hazmat_Suit_Locker_02_C"?'防化柜02':
							scope.row.target=="BPLockpick_Medical_Container_TEC01_C"?'医疗箱':
							scope.row.target=='BP_KillBoxRoomMeshDoor_C'?"绿卡房":
							scope.row.target=='BPLockpick_Hazmat_Suit_Locker_01_C'?'防化柜01':
							scope.row.target=="BPLockpick_NPP_DepletedUraniumStorage_01_C"?"贫铀贮存":
							scope.row.target=="BPLockpick_TV_Base_Weapon_Locker_Military_Tear_2_C"?'废弃地堡2级':
							scope.row.target=="BPLockpick_TV_Base_Weapon_Locker_Military_Tear_3_C"?'废弃地堡3级':
							scope.row.target=="BPLockpick_TV_Base_Weapon_Locker_Military_Tear_4_C"?'废弃地堡4级':
							scope.row.target=="BPLockpick_Weapon_Locker_Military_Tier_1_C"?'废弃地堡1级':
							scope.row.target=="ImprovisedWardrobe_C"?"简易橱柜":
							scope.row.target=="LogShed_1_C"?"木棚1":
							scope.row.target=="Improvised_Metal_Chest_C"?"金属箱":
							scope.row.target="BP_BasicAirplaneDoor_1_Upgr3_C"?"飞机":
							scope.row.target}}
						</el-tag>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column label="锁" align="center" width="150">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">{{scope.row.lock}}
						</div>
						<el-button>{{scope.row.lock=='VeryEasy'?'非常简单':scope.row.lock=='Basic'?'基本':scope.row.lock=='Medium'?'中等':scope.row.lock=='Advanced'?"高级":scope.row.lock}}</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="owner" label="归属者">
			</el-table-column>
			<el-table-column label="位置" width="100">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">{{scope.row.pos}}<br />点击复制传送代码
						</div>
						<el-button @click="copyText(scope.row.pos)">查看</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column label="原始数据" width="100">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">{{scope.row.log}}
						</div>
						<el-button>查看</el-button>
					</el-tooltip>
				</template>
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
				url: "/admin/getlog?group=gameplay"
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
					url: "/admin/getlog?group=gameplay&name=" + this.$data.value
				}).then(({
					data
				}) => {
					// console.log(data);
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
				let gameplay = []
				let arrays = text.split("\n")
				// console.log(arrays);
				for (let str of arrays) {

					if (str.includes("LockpickingMinigame")) {
						let regex =
							/(\d{4}\.\d{2}\.\d{2}-\d{2}\.\d{2}\.\d{2}): \[([^[\]]*)\] \[([^\[]*)\] User: ([^\s]*) \((\d+), (\d{17})\). Success: ([^\s]*). Elapsed time: (\d*\.\d*). Failed attempts: (\d*). Target object: ([^\s]*). Lock type: ([^\s]*). User owner: ([^\s]*). Location: X=(-\d*\.\d*|\d*\.\d*) Y=(-\d*\.\d*|\d*\.\d*) Z=(-\d*\.\d*|\d*\.\d*)/;
						let matches = str.match(regex)
						// console.log(str);
						// console.log(matches);
						if (matches) {
							let datetime = this.$moment.utc(`${matches[1]}`, 'YYYY.MM.DD-HH.mm.ss').utcOffset(8).format(
								'YYYY-MM-DD HH:mm:ss');;
							// console.log(datetime);
							gameplay.push({
								datetime,
								name: matches[4],
								userid: matches[5],
								steamid: matches[6],
								success: matches[7],
								time: matches[8],
								count: matches[9],
								target: matches[10],
								lock: matches[11],
								owner: matches[12],
								pos: {
									x: matches[13],
									y: matches[14],
									z: matches[15]
								},
								log: str
							})


						}
					} else {
						console.log(str);
					}

				}

				this.$data.tableData = gameplay
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