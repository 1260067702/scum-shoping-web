<template>
	<div class="transmit">
		<div>
			<el-button type="primary" @click="dialogFormVisible=true">添加传送点</el-button>
		</div>

		<el-table :data="tableData" border style="width: 100%;" height="90%">
			<el-table-column prop="notes" label="地点" width="180">
				<template slot-scope="scope">
					<el-input v-model="scope.row.notes" placeholder=""></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="type" label="类型" width="180">
				<template slot-scope="scope">
					<el-select v-model="scope.row.type" placeholder="请选择">
						<el-option v-for="item in options" :key="item.type" :label="item.label" :value="item.type">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="设置人">
			</el-table-column>
			<el-table-column prop="x" label="X">
				<template slot-scope="scope">
					<el-input v-model="scope.row.position.x" placeholder="" type="number"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="y" label="Y">
				<template slot-scope="scope">
					<el-input v-model="scope.row.position.y" placeholder="" type="number"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="z" label="Z">
				<template slot-scope="scope">
					<el-input v-model="scope.row.position.z" placeholder="" type="number"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="z" label="价格">
				<template slot-scope="scope">
					<el-input v-model="scope.row.price" placeholder="" type="number"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="server" label="服务器">
			</el-table-column>
			<el-table-column prop="z" label="是否启用">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.isOn" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button @click="save(scope.row)" type="text" size="small">保存</el-button>
					<el-button @click="del(scope.row._id)" type="text" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="添加传送点" :visible.sync="dialogFormVisible">
			<el-input v-model="addPostion" placeholder="放入复制坐标内容"></el-input>
			<el-button @click="eventAdd">解析</el-button>
			<el-form :model="form">
				<el-form-item label="名称" label-width="120px">
					<el-input v-model="form.notes"></el-input>
				</el-form-item>
				<el-form-item label="选择用户/可不选">
					<el-select v-model="form.userId" placeholder="请选择">
						<el-option v-for="item in users" :key="item.name" :label="item.name" :value="item._id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型" label-width="120px">
					<el-select v-model="form.type" placeholder="请选择">
						<el-option v-for="item in options" :key="item.type" :label="item.label" :value="item.type">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="X" label-width="120px">
					<el-input v-model="form.position.x" type="number"></el-input>
				</el-form-item>
				<el-form-item label="Y" label-width="120px">
					<el-input v-model="form.position.y" type="number"></el-input>
				</el-form-item>
				<el-form-item label="Z" label-width="120px">
					<el-input v-model="form.position.z" type="number"></el-input>
				</el-form-item>
				<el-form-item label="价格" label-width="120px">
					<el-input v-model="form.price" type="number"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" label-width="120px">
					<el-switch v-model="form.isOn" active-color="#13ce66" inactive-color="#ff4949">
					</el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addPos">确 定</el-button>
			</div>
		</el-dialog>


	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				dialogFormVisible: false,
				form: {
					"notes": "",
					"position": {
						"x": 0,
						"y": 0,
						"z": 0
					},
					"price": 0,
					"type": "公共",
					isOn: true,
					userId: ""
				},
				options: [{
					type: '公共',
					label: '公共'
				}, {
					type: '私人',
					label: '私人'
				}],
				users: [],
				addPostion: ""

			}
		},
		created() {
			this.$axios({
				url: "/admin/AdminGetTransmit",
			}).then(({
				data
			}) => {
				console.log(data);
				this.$data.tableData = data.data.transmit
				this.$data.users = data.data.users
			})
		},
		methods: {
			eventAdd() {
				let a1 = this.$data.addPostion.replaceAll("=", "\":")
				let a2 = a1.replaceAll(" ", ",\"")
				let a3 = a2.replaceAll("|", ",\"")
				let a4 = a3.replaceAll("X", "\"X")
				// {X=-82068.648 Y=-382602.500 Z=7683.258|P=309.885010 Y=249.854431 R=0.000000}
				a4=a4.replace("Y","YY")
				let pos = JSON.parse(a4)
				console.log(pos);
				this.$data.form.position.x = pos.X
				this.$data.form.position.y = pos.YY
				this.$data.form.position.z = pos.Z
			},
			addPos() {
				console.log("添加传送点");
				console.log(this.$data.form);
				// return
				this.$axios({
					url: "/admin/AdminAddTransmit",
					data: this.$data.form
				}).then(({
					data
				}) => {
					console.log(data);
					this.$message(data.msg)
					if (data.code == 200) {
						this.$data.dialogFormVisible = false
						this.$data.form = {
							"notes": "",
							"position": {
								"x": 0,
								"y": 0,
								"z": 0
							},
							"price": 0,
							"type": "公共点",
							isOn: true
						}
					}
				})
			},
			save(row) {
				console.log("保存", row);
				this.$axios({
					url: "/admin/AdminChangeTransmit",
					data: row
				}).then(({
					data
				}) => {
					this.$message(data.msg)
					if (data.code == 200) {
						this.$data.tableData = data.data
					}
				})
			},
			del(id) {
				console.log("删除", id);
				this.$axios({
					url: "/admin/AdminDeleteTransmit",
					data: {
						_id: id
					}
				}).then(({
					data
				}) => {
					this.$message(data.msg)
					console.log(data);
					if (data.code == 200) {
						this.$data.tableData = data.data
					}
				})
			}
		}
	}
</script>

<style>
	.transmit {
		width: 100%;
		height: 90%;
		background-color: white;
		display: flex;
		flex-flow: column;
	}
</style>