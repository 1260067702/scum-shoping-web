<template>
	<div>
		<div>

		</div>
		<el-table :data="users.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
			height="90%" border style="width: 100%">
			<el-table-column prop="_id" label="ID" width="230">
			</el-table-column>
			<el-table-column prop="name" label="游戏名称">
			</el-table-column>
			<el-table-column prop="steam" label="steamID"  width="180">
			</el-table-column>
			<el-table-column prop="username" label="商城账号" width="180">
			</el-table-column>
			<el-table-column prop="nickname" label="商城名字">
			</el-table-column>
			<el-table-column prop="password" label="密码">
			</el-table-column>
			<el-table-column prop="fraction" label="积分" width="80">
			</el-table-column>
			<el-table-column prop="online" label="状态" width="50">
			</el-table-column>
			<el-table-column align="center"  width="400">
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="搜索名字" />
				</template>
				<template slot-scope="scope" style="padding: 0;margin: 0;">
					<el-button size="mini" >启用账号</el-button>
					<el-button size="mini" type="danger">禁用账号</el-button>
					<el-button size="mini" >解封游戏</el-button>
					<el-button size="mini" type="danger">封禁游戏</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				users: [],
				search: ""
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
		}
	}
</script>

<style>
</style>