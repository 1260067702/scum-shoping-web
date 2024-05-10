<template>
	<div id="recovery-list">
		<div class="ctrl-top">
			<span style="margin-left: 10px;">选择日期：</span>
			<el-date-picker v-model="datetime" align="right" type="date" placeholder="选择日期"
				:picker-options="pickerOptions" value-format="yyyy-MM-dd">
			</el-date-picker>
		</div>
		<el-table :data="tableData.filter(data => !datetime || data.dateTime.includes(datetime.toString()))"
			height="90%" border style="width: 100%">
			<el-table-column prop="dateTime" sortable label="日期" width="180">
			</el-table-column>
			<el-table-column prop="name" label="昵称" width="180" align="center">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">
							{{scope.row.steamid}}<br />点击复制
						</div>
						<el-button @click="copyText(scope.row.steamid)">{{scope.row.name}}</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="nickname" label="物品名称" align="center">
				<template slot-scope="scope">
					<el-tooltip placement="top">
						<div slot="content">
							{{scope.row.prop}}<br />点击复制
						</div>
						<el-button @click="copyText(scope.row.prop)">{{scope.row.nickname}}</el-button>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="number" label="数量" sortable>
			</el-table-column>
			<el-table-column prop="area" label="交易区">
			</el-table-column>
			<el-table-column prop="points" label="积分" sortable>
			</el-table-column>
			<el-table-column prop="points" label="总积分" sortable>
				<template slot-scope="scope">
					{{scope.row.points*scope.row.number}}
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				datetime: "",
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				}
			}
		},
		created() {
			this.$axios({
				url: "/admin/getRecoveryList"
			}).then(({
				data
			}) => {
				console.log(data);
				if (data.code == 200) {
					this.$data.tableData = data.data
				} else {
					this.$notify({
						title: '警告',
						message: data.msg,
						type: 'warning'
					});
				}
			})
		},
		methods: {
			change(e) {
			console.log(this.$data.datetime);
			console.log(e);
			}
		}
	}
</script>

<style>
	.ctrl-top {
		width: 100%;
		background-color: white;
	}
</style>