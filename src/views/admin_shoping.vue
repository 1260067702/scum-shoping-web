<template>
	<div>
		<div class="tap">
			<el-button type="primary" @click="dialogFormVisible = true">添加道具</el-button>
			<el-button type="primary" @click="uppic">上传图片</el-button>
			<el-button type="primary" @click="search=''">全部商品</el-button>
			<span>物品分类：</span>
			<el-select v-model="search" placeholder="分类">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</div>

		<!-- 商品列表 -->
		<el-table
			:data="tableData3.filter(data => search!='' && data.group.toLowerCase().includes(search.toLowerCase()))"
			height="90%" border style="width: 100%">
			</el-table-column>
			<el-table-column label="图片" width="180">
				<template slot-scope="scope">
					<div :style="'background: url('+url+'/uploads/'+scope.row.image+');background-size: 100% 100%;'"
						id="imgback">
						<!-- <el-button type="primary" icon="el-icon-edit" circle @click="chenggeImage(scope.$index)"></el-button> -->
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="商品名称" width="180">
				<template slot-scope="scope">
					<el-input placeholder="" v-model="scope.row.name" :disabled="true">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="物品数量" width="180">
				<el-select v-model="form.type" placeholder="" :disabled="true">
					<el-option v-for="item in options2" :key="item.value" :label="item.label"
						:value="item.value"></el-option>
				</el-select>
			</el-table-column>
			<el-table-column prop="code" label="代码" width="180">
				<template slot-scope="scope">
					<el-input placeholder="" v-model="scope.row.code" :disabled="true">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column prop="group" label="分类" width="180">
				<template slot-scope="scope">
					<el-select v-model="scope.row.group" placeholder="请选择" :disabled="true">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column prop="price" label="价格/积分">
				<template slot-scope="scope">
					<el-input placeholder="" v-model="scope.row.price" :disabled="true" type="number">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column prop="isGou" label="是否可购买">
				<template slot-scope="scope">
					<el-radio-group size="mini" v-model="scope.row.isGou" style="display: flex;" :disabled="true">
						<el-radio-button label="是"></el-radio-button>
						<el-radio-button label="否"></el-radio-button>
					</el-radio-group>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="限购类型" width="180">
				<template slot-scope="scope">
					<el-input placeholder="" v-model="scope.row.quotaType" :disabled="true">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="限购数量" width="180">
				<template slot-scope="scope">
					<el-input placeholder="" v-model="scope.row.quota" :disabled="true">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column prop="sale" label="销售量">
				<template slot-scope="scope">
					<el-input placeholder="" v-model="scope.row.sale" :disabled="true" type="number">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="120">
				<template slot-scope="scope">
					<el-button type="text" @click="edit(scope.row,scope.$index)" size="small"
						:disabled="isK&&scope.$index==indexMethod">编辑</el-button>
					<el-button type="text" @click="del(scope.row,scope.$index)" size="small">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 添加道具 -->
		<addShoping :form="form" :options="options" :options2="options2" :tableData4="tableData4"
			:dialogFormVisible="dialogFormVisible" :images="images" :tableData3="tableData3" :seacher="seacher"
			:innerVisible="innerVisible" />
		<!-- 修改商品 -->
		<updateShopping />
		<!-- 上传图片 -->
		<el-dialog title="上传图片" :visible.sync="upPicDialog" width="50%" center>
			<el-upload ref="upload" class="avatar-uploader" :action="url+'/admin/upload'" name="image"
				:show-file-list="false" :on-success="handleAvatarSuccess" :headers="headers" accept="image"
				:auto-upload="false" :on-change="selPic" :data="upData">
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			<el-input v-model="picName" placeholder="图片名称"></el-input>
			<span slot="footer" class="dialog-footer">
				<!-- <el-button @click="upPicDialog = false">取 消</el-button> -->
				<el-button type="primary" @click="submitUpload">上 传</el-button>
			</span>
		</el-dialog>

		<!-- 修改选择图片 -->
		<el-dialog width="80%" title="选择图片" :visible.sync="innerVisible2" append-to-body>
			<div class="imgs">
				<div class="img_item" v-for="item in images" @click="imgClick2(item)">
					<img :src="url+'/uploads/'+item.imgUrl">
					<span class="img_name">{{item.name}}</span>
				</div>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import addShoping from "../components/add_shopping.vue"
	import updateShopping from "../components/update_shopping.vue"
	export default {
		components: {
			addShoping,
			updateShopping
		},
		data() {
			return {
				tableData3: [],
				activeName2: "first",
				indexMethod: -1,
				select: "武器",
				seacher: "",
				options: this.$cache['options'],
				options2: [{
					lable: "单件",
					value: "单件"
				}, {
					lable: "多件",
					value: "多件"
				}],
				dialogFormVisible: false,
				form: {
					image: '',
					name: '',
					price: 0,
					isGou: "否",
					sale: 0,
					group: "武器",
					code: "",
					image: "",
					type: "单件",
					quota: 0,
					quotaType: 0
				},
				imageUrl: "",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token")
				},
				isK: false,
				upPicDialog: false,
				upData: {},
				picName: "",
				file: null,
				innerVisible: false,
				images: [],
				innerVisible2: false,
				changgeImgindex: -1,
				mangPeiVisible: false,
				search: '',
				selects: [],
				tableData4: [],
				updateFormVisible: false
			}
		},
		methods: {

			handleClick: () => {
				console.log("标签点击");
			},
			edit(row, index) {
				console.log(row, index);
				console.log("编辑");
				this.$data.form = row
				this.$data.updateFormVisible = true
			},
			save() {
				console.log("保存",this.$data.form);
				this.$axios({
					url: "/admin/AdminChangeArticle",
					data: this.$data.form
				}).then(({
					data
				}) => {
					console.log(data);
					if (data.code == 200) {
						this.$message(data.msg)
						this.$data.updateFormVisible = false
						this.$data.form = {
							image: '',
							name: '',
							price: 0,
							isGou: "否",
							sale: 0,
							group: "武器",
							code: "",
							image: "",
							type: "单件",
							quota: 0,
							quotaType: 0
						}
					} else {
						this.$message(data.msg)
					}
				})
			},
			del(row, index) {
				console.log(row, index);
				console.log("删除");
				this.$axios({
					url: "/admin/AdminDeleteArticle",
					data: {
						_id: row._id
					}
				}).then(({
					data
				}) => {
					console.log(data);
					if (data.code == 200) {
						this.$data.tableData3 = data.data
						this.$message(data.msg)
					} else {
						this.$message(data.msg)
					}
				})
			},
			add() {
				this.$data.dialogFormVisible = true
			},
			handleAvatarSuccess(res, file) {
				console.log(res);
				if (res.code == 200) {
					this.$data.imageUrl = ""
					this.$data.picName = ""
					this.$message(res.msg);
					this.$data.images = data.data
				} else {
					this.$message("上传失败！")
				}
			},
			addToServer() {
				console.log(this.$data.form);
				console.log(this.$data.tableData4);
				if (this.$data.form.name == "") {
					this.$message("名称不能为空")
					return
				}
				if (this.$data.form.code == "") {
					this.$message("代码不能为空")
					return
				}
				if (this.$data.form.image == "") {
					this.$message("图片不能为空")
					return
				}
				this.$axios({
					url: "/admin/addArticle",
					data: this.$data.form
				}).then(({
					data
				}) => {
					console.log(data);
					if (data.code == 200) {
						this.$data.form = {
							image: '',
							name: '',
							price: 0,
							isGou: "否",
							sale: 0,
							group: "武器",
							code: "",
							image: "",
							type: "单件",
							quota: 0,
							quotaType: 0
						}
						this.$data.dialogFormVisible = false
						this.$message(data.msg)
						this.$data.tableData3 = data.data
						this.imageUrl = ""
					} else {
						this.$message(data.msg)
					}
				})
			},
			uppic() {
				this.$data.upPicDialog = true
			},
			selPic(file, fileList) {
				console.log(file, fileList);
				this.$data.file = file
				this.imageUrl = URL.createObjectURL(file.raw);
			},
			submitUpload() {
				if (this.$data.picName == "") {
					this.$message("请输入图片名字")
					return
				}
				if (this.$data.file == null) {
					this.$message("图片不能为空")
					return
				}
				let formData = new FormData()
				formData.append("image", this.$data.file.raw)
				formData.append("name", this.$data.picName)
				this.$axios({
					url: "/admin/upload",
					data: formData
				}).then(({
					data
				}) => {
					console.log(data);
					if (data.code == 200) {
						this.$data.imageUrl = ""
						this.$data.picName = ""
						this.$data.file = null
						this.$data.upPicDialog = false
						this.$message(data.msg)
					} else {
						this.$message("上传失败！")
					}
				})
				// this.$data.upData = {
				// 	name: this.$data.picName
				// }
				// console.log(this.$data.upData);
				// this.$refs.upload.submit();
			},
			imgClick(item) {
				console.log(item);
				this.$data.form["image"] = item.imgUrl
				this.innerVisible = false
			},
			chenggeImage(index) {
				console.log(index);
				this.$data.innerVisible2 = true
				this.$data.changgeImgindex = index
			},
			imgClick2(item) {
				console.log(item);
				console.log(this.$data.tableData3[this.$data.changgeImgindex]["image"]);
				this.$data.tableData3[this.$data.changgeImgindex]["image"] = item.imgUrl
				this.innerVisible2 = false

			},

		},
		created() {
			this.$axios({
				url: "/admin/AdminQueryAll"
			}).then(({
				data
			}) => {
				console.log(data);
				if (data.code == 200) {
					this.$data.tableData3 = data.data
				}
			})
			this.$axios({
				url: "/admin/AdminGetImages"
			}).then(({
				data
			}) => {
				console.log(data);
				if (data.code == 200) {
					this.$data.images = data.data
				}
			})
		}
	}
</script>
<style>
	.duo {
		display: flex;

	}

	.wuping {
		display: flex;
		flex-wrap: nowrap;
	}

	#imgback {
		width: 150px;
		height: 120px;
		/* background: url(); */
		background-size: 100% 100%;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.imgs {
		width: 100%;
		height: 90%;
		display: flex;
		flex-wrap: wrap;
	}

	.img_item {
		width: 140px;
		height: 160px;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
	}

	.img_item:hover {
		background-color: #d9d9d9;
	}

	.img_item img {
		width: 95%;
		height: 130px;
	}

	.img_name {}

	.block {
		width: 200px;
		height: 180px;
		display: flex;
		justify-content: center;
		align-items: center;
		/* border: 1px solid #409EFF; */
		background-color: #ececec;
	}

	.tap {
		display: flex;
		align-items: center;
		background-color: white;
		width: 100%;
		padding-left: 1-px;
	}

	.from {
		display: flex;
		flex-flow: column;
		justify-content: flex-start;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>