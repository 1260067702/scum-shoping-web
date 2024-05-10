<template>
	<div class="ctrl">
		<div class="ad">
			<h3 style="margin: 4px;">公告:</h3>
			<h5 style="margin: 5px;">{{gonggao}}</h5>
		</div>
		<div class="user" v-if="user">
			<el-tag class="ins">{{user.nickname}}</el-tag>
			<el-tag class="ins" type="success">用户名：{{user.username}}</el-tag>
			<el-tag class="ins" type="success">积分：{{user.fraction}}</el-tag>
			<el-tag class="ins" type="success">状态：{{user.online}}</el-tag>
			<el-badge :value="messageList.length" class="ins">
				<el-button size="small" @click="openMessage">消息</el-button>
			</el-badge>
		</div>
		<div class="fl">
			<div class="card card1" v-for="item in gift" :style="'background-image: url('+item.image+');'">
				<el-button round :type="item.color" class="xsfl" :disabled="!item.isOn"
					@click="giveXSFL(item)">{{item.name}}</el-button>
			</div>
		</div>
		<div class="orter">
			<div class="app2">
				<div class="app-item" v-for="item in apps" @click="toApp(item)">
					<img :src="item.img" />
					<h5>{{item.title}}</h5>
				</div>
			</div>

			<div class="crd">
				<h4 style="margin-top: 5px;">地图传送</h4>
				<div class="cs">
					<div class="cs-item" v-for="item in transmit">
						<h5>{{item.notes}}</h5>
						<el-button plain size="mini" @click="chuanSong(item)">传送/{{item.price}}</el-button>
					</div>
				</div>
			</div>

			<!-- 小队列表 -->
			<div class="crd">
				<h4 style="margin-top: 5px;">小队列表</h4>
				<div class="ranks">
					<div class="reanks_item" v-if="ranksList" v-for="item in ranksList">
						<h5 style="width:65%;">{{item.name}}</h5>
						<!-- <el-tag  effect="dark">{{item.name}}</el-tag> -->
						<h5 style="margin-right: 10px;">{{item.playerNum}}人</h5>
						<el-button plain size="mini" @click="joinRanks(item)">加入小队</el-button>
					</div>
				</div>
			</div>
			<!-- 我的小队 -->
			<div class="crd">
				<h4 style="margin-top: 5px;">我的小队</h4>
				<div class="ranks">
					<div class="reanks_create" v-if="!ranks">
						<el-input v-model="ranksName" placeholder="队伍名称" size="mini" maxlength="8"></el-input>
						<el-button plain size="mini" @click="createRanks">创建小队</el-button>
					</div>
					<div class="reanks_create" v-if="ranks">
						<el-tag type="danger" effect="dark" style="margin-right: 20px;">
							{{ ranks.name }}
						</el-tag>
						<!-- <el-button type="warning" size="small">转移队长</el-button> -->
						<!-- <el-button type="success" size="small" @click="dialogVisible=true">退出队伍</el-button> -->
					</div>
					<div class="reanks_item" v-if="ranks" v-for="(item,index) in (ranks?ranks.item:[])">
						<!-- <h5>{{item.name +(ranks.boss==item.id?"[队长]":"")}}</h5> -->
						<el-tag effect="dark">
							{{item.name +(ranks.boss==item.id?"[队长]":"")}}
						</el-tag>

						<el-button plain size="mini" @click="chuanRanks(item,ranks._id)"
							v-if="user._id!=item.id&&item.verify==true">传送/1积分</el-button>
						<el-button plain size="mini" @click="check(item,ranks._id)"
							v-if="user._id!=item.id&&item.verify==false">通过申请</el-button>

						<el-button type="success" size="small" @click="dialogVisible=true"
							v-if="user._id==item.id">退出队伍</el-button>

					</div>
				</div>
			</div>
			<div class="crd">
				<h4 style="margin-top: 5px;">私人传送</h4>
				<div class="prvite">
					<!-- <div style="width: 100%;">
						<p class="ranks_tips">每人赠送一个传送点只能设在家里，联系管理添加</p>
					</div> -->
					<div v-for="item in privateTransmit" class="privateChuan">
						<h5 style="margin: 5px;">{{item.notes}}</h5>
						<el-button plain size="mini" @click="privateChuan(item)"
							style="margin: 5px;">传送/{{item.price}}积分</el-button>
					</div>
				</div>
			</div>
			<div class="crd">
				<h4 style="margin-top: 5px;">实时聊天</h4>
				<div class="chat" ref="chatscroll">
					<h5 v-for="item in chat" v-if="item.name!='机器人'||item.text.includes('说:')">{{item.name}}
						说：{{item.text}} {{item.dateTime}}</h5>
				</div>
				<div class="chat-in">
					<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea">
					</el-input>
					<el-button type="danger" @click="sendMessage">1/发送</el-button>
				</div>
			</div>
			<div class="crd">
				<h4 style="margin-top: 5px;">回收价格表</h4>
				<div class="recovery-box">
					<div class="recovery-item" v-for="item in recovery">
						<h5>{{item.name}}</h5>
						<h5>{{item.points}}积分</h5>
					</div>
				</div>
				<span style="margin-top: 20px;font-size: 15px;">提示：直接卖给交易区药店即可，稍等一会积分就到账！</span>
			</div>
			<div class="crd">
				<h4 style="margin-top: 5px;">积分榜</h4>
				<div class="ranks">
					<div class="reanks_item" v-if="userList&&index<20" v-for="(item,index) in userList">
						<h5 style="width: 30px;">{{index+1}}</h5>
						<h5 :style="'color:'+(index<3?'red':'#000')">{{item.name}}</h5>
						<h5>{{item.fraction}}</h5>
					</div>
				</div>
			</div>
		</div>

		<!-- dialog -->
		<el-dialog title="警告!" :visible.sync="dialogVisible" width="30%">
			<span>是否退出队伍？队长退出队伍即队伍解散！</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="outranks(ranks._id)">确 定</el-button>
			</span>
		</el-dialog>

		<!--  -->
		<el-drawer title="消息列表" :visible.sync="drawer" :direction="direction" class="msg-mb"
			:size="width<500?'80%':'30%'" :show-close="false">
			<div class="msg-box">
				<div v-for="item in messageList">
					<h5>{{item.text}}</h5>
					<h5 style="color: coral;font-size: 10px;">{{item.datetime}}</h5>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				width: window.screen.width,
				user: {},
				gift: [],
				transmit: [],
				gonggao: "",
				by: "",
				ranksName: "",
				ranks: null,
				ranksList: [],
				userList: [],
				dialogVisible: false,
				privateTransmit: [],
				apps: [
					// 	{
					// 	title: "选点传送",
					// 	img: "http://3365.scum.if9.cc:520/uploads/1697035468128.png"
					// }, 
					{
						title: "积分转盘",
						img: "http://3365.scum.if9.cc:520/uploads/1697035922581.jpg"
					}
				],
				chat: [],
				textarea: "",
				recovery: [],
				direction: 'ltr',
				drawer: false,
				messageList: []
			}

		},
		created() {
			// console.log(window.screen.width);
			this.$axios({
				url: "/user/mainData"
			}).then(({
				data
			}) => {
				console.log(data);
				if (data.code == 200) {
					this.$data.gift = data.data.gift
					this.$data.transmit = data.data.transmit
					this.$data.gonggao = data.data.gonggao
					this.$data.ranks = data.data.ranks
					this.$data.ranksList = data.data.ranksList
					this.$data.userList = data.data.userList
					this.$data.user = data.data.user
					this.$data.privateTransmit = data.data.privateTransmit
					this.$data.messageList = data.data.message
				}
			})
			this.$axios({
				url: "/user/getRecovery"
			}).then(({
				data
			}) => {
				console.log(data);
				if (data.code == 200) {
					this.$data.recovery = data.data
				}
			})

			this.getChat()
			setInterval(() => {
				this.getChat()
			}, 30000)
		},
		methods: {
			openMessage() {
				this.$data.drawer = !this.$data.drawer
			},
			sendMessage() {
				if (this.$data.textarea == "") {
					this.$message("输入不能为空")
					return
				}
				if (this.$data.textarea.match(/#/)) {
					this.$message("有敏感字符")
					return
				}
				this.$axios({
					url: "/user/setChat",
					data: {
						text: this.$data.textarea
					}
				}).then(({
					data
				}) => {
					// console.log(data);
					this.$message(data.msg)
					this.$data.textarea = ""
				})
			},
			getChat() {
				this.$axios({
					url: "/user/getChat"
				}).then(({
					data
				}) => {
					// console.log(data);
					this.$data.chat = data.data

				})
			},
			giveXSFL(item) {
				console.log(item);
				this.$axios({
					url: "/user/giveXSFL",
					data: item
				}).then(({
					data
				}) => {
					console.log(data);
					this.$message(data.msg)
				})
			},
			chuanSong(item) {
				console.log(item);
				this.$axios({
					url: "/user/transmit",
					data: {
						id: item._id
					}
				}).then(({
					data
				}) => {
					console.log(data);
					// this.$message(data.msg)
					this.$notify({
						title: '传送提醒',
						message: data.msg,
						type: 'success'
					});
				})
			},
			createRanks() {
				console.log(this.$data.ranksName);
				if (this.$data.ranksName != "" && this.$data.ranksName.length < 9) {
					this.$axios({
						url: "/user/createRanks",
						data: {
							ranksName: this.$data.ranksName
						}
					}).then(({
						data
					}) => {
						console.log(data);
						this.$message(data.msg)
						if (data.code == 200) {
							this.$router.go(0)
						}
					})
				} else {
					this.$message("输入错误！")
				}
			},
			joinRanks(item) {
				console.log(item);
				this.$axios({
					url: "/user/joinRanks",
					data: {
						id: item._id
					}
				}).then(({
					data
				}) => {
					console.log(data);
					this.$message(data.msg)
					if (data.code == 200) {
						location.reload()
					}
				})
			},
			chuanRanks(item, id) {
				console.log(item, id);
				this.$axios({
					url: "/user/ranksTransmit",
					data: {
						ranksId: id,
						id: item.id
					}
				}).then(({
					data
				}) => {
					console.log(data);
					// this.$message(data.msg)
					this.$notify({
						title: '传送提醒',
						message: data.msg,
						type: 'success'
					});
				})
			},
			outranks(item) {
				console.log(item);
				this.$axios({
					url: "/user/outRanks",
					data: {
						id: item
					}
				}).then(({
					data
				}) => {
					console.log(data);
					this.$message(data.msg)
					if (data.code == 200) {
						this.$data.dialogVisible = false
						location.reload()
					}
				})
			},
			privateChuan(item) {
				console.log(item);
				this.$axios({
					url: "/user/privateTransmit",
					data: {
						id: item._id
					}
				}).then(({
					data
				}) => {
					console.log(data);
					// this.$message(data.msg)
					this.$notify({
						title: '传送提醒',
						message: data.msg,
						type: 'success'
					});
					if (data.code == 200) {
						// location.reload()
					}
				})
			},
			check(item, id) {
				console.log(item, id);

				this.$axios({
					url: "/user/passPrivateTransmit",
					data: {
						id: item.id,
						ranksId: id
					}
				}).then(({
					data
				}) => {
					this.$message(data.msg)
				})
			},
			toApp(item) {
				console.log(item.title);
				switch (item.title) {
					case "选点传送":
						if (this.$route.name != "map") {
							this.$router.push("/main/map")
						}
						break;
					default:
						break;
				}
			}
		}

	}
</script>

<style>
	.msg-box {
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.msg-box div {
		margin-top: 10px;
		margin-left: 10px;
		margin-right: 10px;
	}

	.recovery-item {
		width: 50%;
		display: flex;
		flex-flow: nowrap;
		justify-content: space-between;
		line-height: 30px;
		align-items: center;
	}

	.recovery-item :nth-child(1) {
		color: #550000;
		margin-left: 10px;
	}

	.recovery-item :nth-child(2) {
		color: #ff0000;
		margin-right: 10px;
	}

	.recovery-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.chat-in {
		width: 100%;
		display: flex;
	}

	.chat {
		width: 100%;
		height: 410px;

		overflow-y: scroll;
		overflow-x: hidden;
	}

	.app-item {
		margin-top: 5px;
		width: 24.9%;
		height: 100px;
		/* padding: 3px; */
		display: flex;
		justify-content: center;
		align-items: center;
		flex-flow: column;
		/* background-color: #ffffff; */
	}

	.app-item img {
		/* margin-top: 6%; */
		width: 70px;
		height: 70px;
		border-radius: 10px;
		background-color: white;
	}

	.app-item h5 {
		line-height: 20px;
	}

	.app-item:active {
		background-color: white;
	}

	.ranks_tips {
		font-size: 12px;
		color: whitesmoke;
		background-color: #409eff;
		padding: 4px;
		border-radius: 2px;
	}

	.privateChuan {
		display: flex;
		width: 100%;
		flex-flow: nowrap;
		justify-content: space-between;
	}

	.prvite {
		display: flex;
		flex-flow: column;
	}

	.reanks_create {
		display: flex;
		flex-flow: nowrap;
		margin-top: 5px;
	}

	.ranks {
		display: flex;
		width: 100%;
		/* justify-content: center; */
		flex-flow: column;
		align-items: center;
		padding-bottom: 10px;
		max-height: 600px;
		overflow-y: scroll;
	}

	.reanks_item {
		width: 90%;
		/* height: 30px; */
		display: flex;
		flex-flow: nowrap;
		justify-content: space-between;
		align-items: center;
		margin-top: 5px;
	}

	.cs {
		width: 100%;
		display: flex;
		/* flex-flow: column; */
		flex-wrap: wrap;
		/* justify-content: center; */
		/* flex-grow: 2; */
		/* overflow-y: scroll; */
		height: 100%;
		flex-direction: row;
		align-content: flex-start;
	}

	.cs-item {
		width: 48%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* margin-top: 3px; */
		border-bottom: 1px solid #55557f;
		/* padding: 1px; */
		margin-left: 0.5%;
		margin-right: 0.5%;
		/* columns: 1; */
	}



	.ad {
		width: 98%;
		height: 200px;
		background-color: #eea907;
		margin: 1%;
		border-radius: 5px;
		border: 1px solid #55557f;
	}

	.ctrl {
		width: 100%;
		display: flex;
		flex-flow: column;
		overflow-y: scroll;
		overflow-x: hidden;
		height: 90%;
	}

	.user {
		margin: 10px;
	}

	.ins {
		margin: 10px;
	}





	.card:hover {
		backdrop-filter: blur(10px);
		border: 5px solid #fff;
	}

	.card1 {
		background-image: url("../assets/Scum-Logo.jpg");
	}

	.xsfl {
		/* margin-top: 90px; */
	}

	/* 2列 */
	@media screen and (min-width: 839px) {
		.app2 {
			width: 400px;
			min-height: 300px;
			border-radius: 3px;
			background-color: #eea907;
			display: flex;
			flex-wrap: wrap;
			align-items: flex-start;
			justify-content: flex-start;
			flex-direction: row;
			align-content: flex-start;
			margin: 20px;
		}

		.card {
			width: 370px;
			height: 230px;
			background-color: white;
			margin: 20px;
			border-radius: 10px;
			background-size: 100% 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 8px solid #fff;
			box-shadow: 0 2px 5px #fff;
		}

		.fl {
			display: flex;
			justify-content: space-around;
		}

		.orter {
			width: 98%;
			margin: 1%;
			display: flex;
			flex-flow: wrap;
			justify-content: flex-start;
			align-items: flex-start;
		}

		.crd {
			width: 400px;
			min-height: 500px;
			border-radius: 3px;
			background-color: #eea907;
			display: flex;
			align-items: center;
			flex-flow: column;
			margin: 20px;
			/* max-height: 500px;
			overflow-y: scroll; */
		}
	}

	@media screen and (max-width:838px) {
		.app2 {
			width: 400px;
			min-height: 300px;
			border-radius: 3px;
			background-color: #eea907;
			display: flex;
			flex-wrap: wrap;
			align-items: flex-start;
			justify-content: flex-start;
			flex-direction: row;
			align-content: flex-start;
			margin: 5px;
		}

		.card {
			width: 180px;
			height: 120px;
			background-color: white;
			margin: 2px;
			border-radius: 10px;
			background-size: 100% 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2px solid #fff;
			box-shadow: 0 2px 5px #fff;
		}

		.fl {
			display: flex;
			/* justify-content: space-around; */
			justify-content: center;
		}

		.orter {
			width: 98%;
			margin: 1%;
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			margin-top: 20px;
		}

		.crd {
			width: 400px;
			min-height: 300px;
			background-color: white;
			border-radius: 3px;
			background-color: #eea907;
			display: flex;
			align-items: center;
			flex-flow: column;
			margin: 5px;
		}

		.msg-mb {
			width: 100%;
		}
	}
</style>