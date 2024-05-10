<template>
	<el-dialog title="修改商品" :visible.sync="$parent.updateFormVisible" width="90%" style="margin-top: 10px;">
		<el-form :model="$parent.form" class="from">
			<el-form-item label="名称" label-width="120px">
				<el-input v-model="$parent.form.name" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="分类" label-width="120px">
				<el-select v-model="$parent.form.group" placeholder="请选择活动区域">
					<el-option v-for="item in $parent.options" :key="item.value" :label="item.label"
						:value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="物品种类" label-width="120px">
				<el-select v-model="$parent.form.type" placeholder="请选择活动区域">
					<el-option v-for="item in $parent.options2" :key="item.value" :label="item.label"
						:value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<h4>单件为一行代码，多件一个代码一行</h4>
			<el-form-item label="物品代码" label-width="120px">
				<el-input v-model="$parent.form.code" autocomplete="off" v-if="$parent.form.type=='单件'"></el-input>
				<el-input type="textarea" :autosize="{ minRows: 7, maxRows: 7}" placeholder="请输入内容" v-if="$parent.form.type=='多件'" v-model="$parent.form.code">
				</el-input>
			</el-form-item>
			<el-form-item label="价格" label-width="120px">
				<el-input v-model="$parent.form.price" autocomplete="off" type="number"></el-input>
			</el-form-item>
			<el-form-item label="销售量" label-width="120px" type="number">
				<el-input v-model="$parent.form.sale" autocomplete="off"></el-input>
			</el-form-item>
			<h4>0不限制，1每账号，2每日，3每月</h4>
			<el-form-item label="限购类型" label-width="120px" type="number">
				<el-input v-model="$parent.form.quotaType" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="限购" label-width="120px" type="number">
				<el-input v-model="$parent.form.quota" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="是否可售" label-width="120px">
				<el-radio-group size="mini" v-model="$parent.form.isGou" style="display: flex;">
					<el-radio-button label="是"></el-radio-button>
					<el-radio-button label="否"></el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="图片" label-width="120px">
				<div class="block" @click="$parent.innerVisible=true">
					<el-image :src="url+'/uploads/'+$parent.form.image">
						<div slot="error" class="image-slot">
							<i class="el-icon-picture-outline"></i>
						</div>
					</el-image>
				</div>
				<el-dialog width="80%" title="选择图片" :visible.sync="$parent.innerVisible" append-to-body>
					<div class="imgs">
						<div class="img_item" v-for="item in $parent.images" @click="$parent.imgClick(item)">
							<img :src="url+'/uploads/'+item.imgUrl">
							<span class="img_name">{{item.name}}</span>
						</div>
					</div>

				</el-dialog>
			</el-form-item>

			<el-dialog title="选择物品" :visible.sync="$parent.mangPeiVisible" width="80%" append-to-body>
				<div class="wuping">
					<el-table ref="thisContent"
						:data="$parent.tableData3.filter(data => !$parent.search || data.name.toLowerCase().includes($parent.search.toLowerCase()))"
						tooltip-effect="dark" style="width: 100%" height="580" @select="handleSelectionChange">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column label="物品名称" width="120">
							<template slot-scope="scope">{{ scope.row.name }}</template>
						</el-table-column>
						<el-table-column align="right">
							<template slot="header" slot-scope="scope">
								<el-input v-model="$parent.search" size="mini" placeholder="输入关键字搜索" />
							</template>
						</el-table-column>
					</el-table>
				</div>

				<span slot="footer" class="dialog-footer">

					<el-button @click="$parent.updateFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="$parent.tableData4 = $parent.selects,$parent.mangPeiVisible = false">确 定</el-button>
				</span>
			</el-dialog>

		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="$parent.updateFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="$parent.save">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		name: "updateShoping",
		data() {
			return {

			}
		},
		methods: {
			addToServer() {
			console.log(this.$parent.form);
			},
			handleSelectionChange(e) {
				this.$data.selects = e
			},
		}
	}
</script>

<style>
</style>