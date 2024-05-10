<template>
	<el-table :data="tableData" style="width: 100%" height="250">
		<el-table-column prop="dateTime" label="日期" width="180">
		</el-table-column>
		<el-table-column prop="name" label="昵称" width="180">
		</el-table-column>
		<el-table-column prop="type" label="类型">
		</el-table-column>
		<el-table-column prop="status" label="状态">
		</el-table-column>
	</el-table>
</template>

<script>
	export default {
		created() {
			this.$axios({
				url: "/user/getOrders"
			}).then(({
				data
			}) => {
				console.log(data.data);
				data.data.reverse()
				this.$data.tableData = data.data
			})
		},
		data() {
			return {
				tableData:[]
			}
		}
	}
</script>

<style>
</style>