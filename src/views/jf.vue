<template>
	<div class="jfGood">
		<div class="tap-a">
			<!-- <el-input v-model="seacher" placeholder="请输入搜索内容" style="width: 200px;"></el-input> -->
			<!-- <el-button>搜索</el-button> -->
			<!-- <div class="group">
				<el-select v-model="value" placeholder="分类">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div> -->
			<h4 v-for="item in options" class="nav-tap" :style="value==item.value?'background-color:cadetblue;':'' "
				@click="value=item.value">{{item.label}}</h4>
		</div>
		<div class="shopping">
			<div class="shopping_box" v-for="item in shopping"
				v-if="seacher!=''?(item.group==value&&item.name.indexOf(seacher)!=-1):(item.group==value)">
				<img :src="url+'/uploads/'+item.image" class="shop_img">
				<div class="insc">
					<h5>{{item.name}}</h5>
					<el-tag type="danger">{{item.price}}积分</el-tag>
				</div>
				<div>
					<el-button size="mini" type="primary" @click="addSopping(item)">加入购物车</el-button>
					<el-tag type="danger" effect="dark" size="medium" v-if="item.quotaType!=0">
						{{(item.quotaType==2?"日":(item.quotaType==3?"月":""))+"限"+item.quota}}
					</el-tag>
				</div>

			</div>

		</div>
		<div class="shopping_cart">
			<div class="god_list">
				<!-- <div v-for="item in goodsCar">
					<h5>{{item.name}}</h5>
					<el-tag type="danger">{{item.name}}</el-tag>
					<h5>数量：{{item.num}}</h5>
					<h5>数量：{{item.num}}</h5>
				</div> -->
				<el-badge :value="item.num" class="item" v-for="(item,index) in goodsCar" :key="index">
					<!-- <el-button size="small">评论</el-button> -->
					<el-tag type="danger" @click="changeNum(item)">{{item.name}}</el-tag>
					<h5>{{item.num*item.price}}积分</h5>
				</el-badge>
			</div>
			<div class="jiesuan">
				<el-tag type="danger" effect="dark">
					累计：{{ sum }}积分
				</el-tag>
				<el-button type="primary" :disabled="flag" @click="overUp">结算</el-button>
			</div>
		</div>



		<el-dialog title="请输入数量" :visible.sync="dialogVisible" width="80%">

			<el-input type="number" v-model="nums"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addToCar">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="修改数量" :visible.sync="dialogVisible2" width="80%">
			<el-input type="number" v-model="nums" value=""></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="delShopping">移除商品</el-button>
				<el-button type="primary" @click="changgeOk">修改</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				shopping: [],
				dialogVisible: false,
				nums: 1,
				goodsCar: [],
				thatData: {},
				dialogVisible2: false,
				changgeData: {},
				sum: 0,
				flag: false,
				seacher: "",
				options: this.$cache['options'],
				value: "热销",
				user: {}
			}
		},
		created() {
			console.log(this.$data.options);
			this.$axios({
				url: "/user/getShopping",
			}).then(({
				data
			}) => {
				console.log(data);
				this.$data.shopping = data.data
			})

			this.$axios({
				url: "/user/mainData"
			}).then(({
				data
			}) => {
				console.log(data);
				if (data.code == 200) {
					this.$data.user = data.data.user
				}
			})
		},
		methods: {
			touchMenu(e) {
				console.log(e);
			},
			addSopping(e) {
				console.log(e);
				this.$data.dialogVisible = true
				this.$data.thatData = e
			},
			addToCar() {
				let flag = false

				for (let var1 in this.$data.goodsCar) {
					if (this.$data.goodsCar[var1]._id == this.$data.thatData._id) {
						flag = true
					}
				}
				if (flag) {
					// this.$message("你已添加过该商品")
					this.$notify({
						title: '警告',
						message: '你已添加过该商品',
						type: 'warning'
					});
					return
				}
				this.$data.thatData["num"] = this.$data.nums
				this.$data.goodsCar.push(this.$data.thatData)
				console.log(this.$data.goodsCar);
				this.$data.nums = 1
				this.$data.thatData = {}
				this.$data.dialogVisible = false
			},
			changeNum(e) {
				console.log(e);
				// e.num = parseInt(e.num)
				this.$data.nums = e.num
				this.$data.changgeData = e
				this.$data.dialogVisible2 = true
			},
			delShopping() {
				let news = []
				for (let var1 in this.$data.goodsCar) {
					if (this.$data.goodsCar[var1]._id != this.$data.changgeData._id) {
						news.push(this.$data.goodsCar[var1])
					}
				}
				this.$data.goodsCar = news
				this.$data.dialogVisible2 = false

			},
			changgeOk() {
				for (let var1 in this.$data.goodsCar) {
					if (this.$data.goodsCar[var1]._id == this.$data.changgeData._id) {
						this.$data.changgeData.num = this.$data.nums
						this.$data.goodsCar[var1] = this.$data.changgeData
						this.$data.nums = 1
					}
				}
				console.log(this.$data.goodsCar);
				this.$data.dialogVisible2 = false
			},
			overUp() {
				if (this.$data.goodsCar.length < 1) {
					// this.$message("你还没有选购物品")
					this.$notify.error({
						title: '错误',
						message: '你还没有选购物品'
					});
					return
				}

				let jf = parseInt(this.$data.user.fraction)
				let sum = 0
				for (let var1 in this.$data.goodsCar) {
					sum += parseInt(this.$data.goodsCar[var1].num) * parseInt(this.$data.goodsCar[var1].price)
				}
				console.log(jf, sum);
				if (jf >= sum) {
					this.$axios({
						url: "/user/shoppingOverUp",
						data: this.$data.goodsCar
					}).then(({
						data
					}) => {
						console.log(data);
						// this.$message(data.msg)

						if (data.code == 200) {
							this.$data.goodsCar = []
							this.$data.nums = 1
							this.$data.thatData = {}
							this.$data.user.fraction = data.data.jf
							// localStorage.setItem("jf", data.data.jf)

							this.$notify({
								title: '交易提醒',
								message: data.msg,
								type: 'success'
							});
						} else {
							this.$notify({
								title: '交易提醒',
								message: data.msg,
								type: "warning"
							});
						}
					})
				} else {
					this.$notify({
						title: '交易提醒',
						message: "积分不足",
						type: "warning"
					});
				}
			}
		},
		watch: {
			goodsCar: {
				handler(item1, item2) {
					console.log(item1, item2);
					let sum = 0
					for (let var1 in this.$data.goodsCar) {
						sum += parseInt(this.$data.goodsCar[var1].num) * parseInt(this.$data.goodsCar[var1].price)
					}
					this.$data.sum = sum
				}
			},
			nums: {
				handler(item1, item2) {
					console.log(item1, item2);
					let sum = 0
					for (let var1 in this.$data.goodsCar) {
						sum += parseInt(this.$data.goodsCar[var1].num) * parseInt(this.$data.goodsCar[var1].price)
					}
					this.$data.sum = sum
				}
			}
		}
	}
</script>

<style>
	.nav-tap {
		cursor: default;
		background-color: #ff6d05;
		padding: 5px;
		border-radius: 2px;
		font-size: 13px;
		margin-top: 2px;
		margin-bottom: 2px;
		margin-left: 3px;
		margin-left: 3px;
	}

	.nav-tap:active {
		background-color: cadetblue;
	}

	.nav-tap:hover {
		background-color: cadetblue;
	}

	.tap-a {
		display: flex;
		/* justify-content: space-between; */
		padding: 10px 5%;
		flex-flow: wrap;
	}

	.tap-a h5 {
		margin-left: 10px;
	}

	.group {
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.group span {
		padding: 0;
		margin: 0;
		font-size: 15px;
		color: white;
		/* background-color: aqua; */
		cursor: default;
	}

	.group:active {
		border: 1px solid white;
	}

	.god_list::-webkit-scrollbar {
		display: none;
	}

	.item {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-flow: column;
		height: 70px;
		/* width: 80px; */
		margin-left: 20px;
		margin-top: 10px;
		/* border: 1px soli #ffaa00; */
		background-color: #ff6d05;
		padding-left: 10px;
		padding-right: 10px;
	}

	.god_list {
		width: calc(100% - 250px);
		height: 100%;
		display: flex;
		flex-wrap: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
		align-items: center;
	}

	.jiesuan {
		width: 250px;
		height: 100%;
		/* background-color: black; */
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		/* border: 1px solid #ff6d05; */
	}

	.insc {
		width: 96%;
		display: flex;
		flex-flow: row;
		justify-content: space-evenly;
		margin: 1%;
		height: 40px;
		margin-top: 10px;
	}

	.shopping_box h5 {
		line-height: 30px;
	}

	.shop_img {
		display: block;
		width: 170px;
		height: 150px;
		margin-top: 5%;
	}

	.shopping_box {
		width: 190px;
		height: 250px;
		background-color: white;
		margin: 5px;
		border-radius: 5px;
		display: flex;
		flex-flow: column;
		align-items: center;
	}

	.shopping {
		width: 100%;
		height: 90%;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		overflow-y: scroll;
		/* justify-content: start; */
		/* align-items: flex-start; */
		/* align-self: flex-start; */
	}

	.shopping_cart {
		width: 100%;
		height: 10%;
		background-color: white;
		display: flex;
	}

	.jfGood {
		width: 100%;
		height: 90%;
		display: flex;
		flex-flow: column;
		align-items: center;
	}
</style>