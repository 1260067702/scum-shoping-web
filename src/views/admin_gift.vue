<template>
	<div class="gift">
		<el-card class="box-card" v-for="(item,index) in gift" :key="index">
			<div slot="header" class="clearfix">
				<span>{{item.name}}</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="changeGift(item)">修改</el-button>
			</div>
			<el-tag v-for="(item2,index2) in item.content" :key="index2"
				style="margin: 5px;">{{item2.name+" "+item2.group+"X"+item2.number}}</el-tag>
		</el-card>



		<el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
			<div class="addGift">
				<el-table ref="thisContent" :data="all" tooltip-effect="dark" style="width: 100%" height="580"
					@select="handleSelectionChange">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column label="物品名称" width="120">
						<template slot-scope="scope">{{ scope.row.name }}</template>
					</el-table-column>

				</el-table>
				<el-table :data="thisContent" border style="width: 100%" v-if="thisContent" height="580">
					<el-table-column prop="name" label="名称" width="180" fixed>
					</el-table-column>
					<el-table-column prop="number" label="数量" width="180">
						<template slot-scope="scope">
							<el-input v-model="scope.row.number" placeholder="" type="number"></el-input>

						</template>
					</el-table-column>
				</el-table>
			</div>


			<span slot="footer" class="dialog-footer">
				<el-switch v-model="thisData.isOn" active-text="启用" inactive-text="禁用" style="margin-right: 10px;">
				</el-switch>
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveGift">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				gift: [],
				dialogVisible: false,
				title: "",
				porp: {
					key: 'code',
					label: 'name'
				},
				thisData: {},
				thisContent: [],
				all: []
			}
		},
		created() {
			this.$axios({
				url: "/admin/AdminQueryGift"
			}).then(({
				data
			}) => {
				console.log(data);
				this.$data.gift = data.data
			})
			this.$axios({
				url: "/admin/AdminQueryAll"
			}).then(({
				data
			}) => {
				console.log(data);
				if (data.code == 200) {
					this.$data.all = data.data
				}
			})
		},
		methods: {
			changeGift(e) {
				console.log(e);
				this.$data.title = e.name
				this.$data.dialogVisible = true
				this.$data.thisData = e
				this.$data.thisContent = e.content


				setTimeout(() => {
					// console.log(this.$refs.thisContent);
					this.$data.all.forEach(item => {
						e.content.forEach(item2 => {
							if (item.code == item2.code) {
								this.$refs.thisContent.toggleRowSelection(item, true)
							}
						})
					})
				}, 1000)

			},
			saveGift() {
				console.log("选取的内容", this.$data.thisContent);
				console.log("选取的内容", this.$data.thisData);
				this.$data.thisData.content = this.$data.thisContent
				this.$axios({
					url: "/admin/AdminChangeGift",
					data: this.$data.thisData
				}).then(({
					data
				}) => {
					console.log(data);
					if (data.code == 200) {
						this.$data.gift = data.data
						this.$data.dialogVisible = false
						this.$message(data.msg)
					}
				})
			},
			handleSelectionChange(e) {
				// console.log("服务器数据", this.$data.thisContent);

				for (let var1 in e) {
					for (let var2 in this.$data.thisContent) {
						if (e[var1].code == this.$data.thisContent[var2].code) {
							// console.log(this.$data.thisContent[var2].number);
							// console.log("有");
							e[var1] = this.$data.thisContent[var2]

						} else {
							if (!e[var1]['number']) {
								e[var1]['number'] = 1
							}
						}
					}

				}

				// console.log(e);
				this.$data.thisContent = e
			}
		}
	}
</script>

<style>
	.cfgNum_item {
		display: flex;
		flex-flow: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.cfgNum {
		width: 300px;
		display: flex;
		margin: 5px;
		flex-flow: column;
	}

	.gift {
		width: 100%;
		height: 90%;
		background-color: white;
		display: flex;
		flex-flow: wrap;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.box-card {
		width: 480px;
		margin: 5px;
		height: 300px;
	}

	.addGift {
		display: flex;
	}
</style>