<template>
	<div class="log_list">
		<el-table :data="tableData" border style="width: 100%" height="100%">
			<el-table-column fixed prop="datetime" label="日期" width="170">
			</el-table-column>
			<el-table-column prop="name" label="文件名" width="250">
			</el-table-column>
			<el-table-column label="大小" width="120">
				<template slot-scope="scope">
					{{parseInt(scope.row.size/1024)}}K
				</template>
			</el-table-column>
			<el-table-column prop="group" label="分类">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
					<el-button type="text" size="small">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog :title="title" :visible.sync="centerDialogVisible" width="95%" center>
			<div style="width: 100%;height: 550px;overflow-y: scroll;">
				<p v-for="item in content">{{item}}</p>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				centerDialogVisible: false,
				title: "",
				content: []
			}
		},
		created() {

			this.$axios({
				url: "/admin/getlog?group=all"
			}).then(({
				data
			}) => {
				console.log(data);
				this.$data.tableData = data.data
			})
		},
		methods: {
			handleClick(row) {
				this.$data.centerDialogVisible = true
				this.$data.title = row.name
				let txt = row.text.split("\n")
				this.$data.content = txt
			}
		}
	}
</script>

<style>
	.log_list {
		width: 100%;
		height: 95%;
	}
</style>