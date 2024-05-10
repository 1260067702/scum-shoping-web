<template>
	<div>
		<h1 style="text-align: center;">充值正整数为增加，负整数为减少</h1>
		<div class="top">
			<el-select v-model="name" placeholder="请选择">
				<el-option v-for="(item,index) in users" :key="item.name" :label="item.name" :value="index">
				</el-option>
			</el-select>
			<el-input v-model="input" placeholder="请输入内容" type="number" style="width: 200px;"></el-input>
			<el-button type="primary" round @click="chongzhi">充值</el-button>
			<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="备注" v-model="textarea" style="width: 200px;">
			</el-input>
		</div>
		<el-table :data="name!=-1?[users[name]]:[]" height="130" border style="width: 96%;margin-left: 2%;"
			v-if="name!=-1">
			<el-table-column label="id" width="230">
				<template slot-scope="scope" v-if="name!=-1">
					{{scope.row._id}}
				</template>
			</el-table-column>
			<el-table-column prop="name" label="游戏名" width="180">
				<template slot-scope="scope" v-if="name!=-1">
					{{scope.row.name}}
				</template>
			</el-table-column>
			<el-table-column prop="steamid" label="steamID" width="180">
				<template slot-scope="scope" v-if="name!=-1">
					{{scope.row.steamId}}
				</template>
			</el-table-column>
			<el-table-column label="商城名">
				<template slot-scope="scope" v-if="name!=-1">
					{{scope.row.nickname}}
				</template>
			</el-table-column>
			<el-table-column label="账号">
				<template slot-scope="scope" v-if="name!=-1">
					{{scope.row.username}}
				</template>
			</el-table-column>
			<el-table-column label="密码">
				<template slot-scope="scope" v-if="name!=-1">
					{{scope.row.password}}
				</template>
			</el-table-column>
			<el-table-column label="积分">
				<template slot-scope="scope" v-if="name!=-1">
					{{scope.row.fraction}}
				</template>
			</el-table-column>
		</el-table>
		<div
			style="margin-left: 2%;width: 96%;display: flex;justify-content: center;flex-flow: column;align-items: center;height: 80%">
			<h1>充值记录</h1>
			<el-table :data="log" height="450" border style="width: 100%;height: 40%">
				<el-table-column prop="datetime" label="日期" width="180">
				</el-table-column>
				<el-table-column prop="nickname" label="管理员" width="180">
				</el-table-column>
				<el-table-column prop="player" label="玩家账号" width="180">
				</el-table-column>
				<el-table-column prop="num" label="数量" width="50">
				</el-table-column>
				<el-table-column prop="remarks" label="备注">
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				users: [],
				name: -1,
				input: 0,
				log: [],
				textarea:""
			}
		},
		created() {
			this.$axios({
				url: "/admin/AdminGetUsers",

			}).then(({
				data
			}) => {
				console.log(data);
				this.$data.users = data.data
			})
			this.$axios({
				url: "/admin/AdminChongZhiLog",

			}).then(({
				data
			}) => {
				console.log(data);
				this.$data.log = data.data
			})
		},
		methods: {
			chongzhi(e) {
				console.log(e);
				console.log(this.$data.name);
				console.log(this.$data.input);
				if (this.$data.name != -1) {
					console.log(this.$data.users[this.$data.name]);
					if (this.$data.input == 0) {
						this.$message("充值不能为0")
						return
					}
					console.log("充值");
					if (!this.$data.users[this.$data.name]._id) {
						this.$message("选择错误")
						return
					}
					this.$axios({

						url: "/admin/AdminChongZhi",
						data: {
							id: this.$data.users[this.$data.name]._id,
							num: this.$data.input,
							remarks:this.$data.textarea
						}

					}).then(({
						data
					}) => {
						console.log(data);
						this.$message(data.msg)
						if (data.code == 200) {
							this.$data.name = -1
							this.$data.input = 0
						}
					})
				} else {
					this.$message("请选择用户")
				}
			}
		}
	}
</script>

<style>
	.top {
		width: 96%;
		margin-left: 2%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>