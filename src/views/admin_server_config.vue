<template>
	<div class="config">
		<el-form ref="form" :model="form" label-width="150px">
			<el-form-item label="发货服务器状态">
				<el-tag type="success" effect="dark">
					{{ sendGoods.status }}
				</el-tag>
				<br />
				<p>每次打开机器人需要手动连接一次，不在线也需要手动连接，每次修改完需要重新点击启动</p>
				<el-button @click="getsendGoods" size="mini">刷新</el-button>
				<el-button type="primary" size="mini" @click="startsendGoods">启动</el-button>
			</el-form-item>
			<el-form-item label="日志服务器状态">
				<el-tag type="success" effect="dark">
					{{logStatus}}
				</el-tag>
				<br />
				<el-button @click="getLog" size="mini">刷新</el-button>
				<el-button type="primary" size="mini" @click="startLog">启动</el-button>
			</el-form-item>

			<el-form-item label="商城域名">
				<p>****.scum.if9.cc:520 <br />
					****可自定义，联系我修改，如：abc.scum.if9.cc:520</p>
				<el-input v-model="form.hostname" disabled></el-input>
			</el-form-item>
			<el-form-item label="数据库前缀">
				<el-input v-model="form.database" disabled></el-input>
			</el-form-item>
			<el-form-item label="公告">
				<el-input type="textarea" v-model="form.gonggao" rows="5"></el-input>
			</el-form-item>
			<el-form-item label="商城名称">
				<el-input v-model="form.server"></el-input>
			</el-form-item>
			<el-form-item label="商品分类">
				<p>标题随便改，分类改了可能就找不到原本这个分类的商品了</p>
				<div style="display: flex;width: 300px;justify-content: space-around;">
					<h4>标题</h4>
					<h4>分类</h4>
				</div>
				<div v-for="(item,index) in form.group"
					style="display: flex;width: 300px;justify-content: space-around;">
					<el-input v-model="item.label" placeholder="请输入内容"></el-input>
					<el-input v-model="item.value" placeholder="请输入内容"></el-input>
					<el-button type="primary" icon="el-icon-delete" style="margin-left: 10px;"
						@click="form.group.splice(index,1)"></el-button>
				</div>
				<el-button type="primary" icon="el-icon-plus" style="margin-top: 10px;"
					@click="form.group.push({label:'',value:''})"></el-button>
			</el-form-item>
			<el-form-item label="公共传送">
				<el-switch v-model="form.public"></el-switch>
			</el-form-item>
			<el-form-item label="队友传送">
				<el-switch v-model="form.ranks"></el-switch>
			</el-form-item>
			<el-form-item label="私人传送">
				<el-switch v-model="form.private"></el-switch>
			</el-form-item>
			<p>注意：@user为玩家名字,@server为服务器名字</p>
			<el-form-item label="新玩家进入服务器">
				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.newPlayerIn">
				</el-input>
			</el-form-item>
			<el-form-item label="玩家进入服务器通知">
				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.playerIn">
				</el-input>
			</el-form-item>
			<el-form-item label="机器人上线通知">
				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.robotOnline">
				</el-input>
			</el-form-item>
			<el-form-item label="机器人发货前通知">
				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.BfNotfiy">
				</el-input>
			</el-form-item>
			<el-form-item label="机器人发货完通知">
				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.AfNotfiy">
				</el-input>
			</el-form-item>
			<el-form-item label="机器人传送前">
				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.CSBfNotfiy">
				</el-input>
			</el-form-item>
			<el-form-item label="机器人传送后">
				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.CSAfNotfiy">
				</el-input>
			</el-form-item>
			<el-form-item label="FTP配置" style="display: flex;flex-flow: column;">
				<p>用户注册数据，物品回收等均需要日志支持,未连接就无法使用此商城</p>
				<div>
					服务器商：
					<el-input v-model="form.ftptype"></el-input>
					FTP地址：
					<el-input v-model="form.ftphost"></el-input>
					FTP端口：
					<el-input v-model="form.ftpport"></el-input>
				</div>
				<div>
					FTP账号：
					<el-input v-model="form.ftpuser"></el-input>
					FTP密码：
					<el-input v-model="form.ftppassword"></el-input>
					日志路径：
					<el-input v-model="form.ftppath"></el-input>
				</div>
			</el-form-item>

			<el-form-item label="允许注册">
				<el-switch v-model="form.registration_switch"></el-switch>
			</el-form-item>
			<el-form-item label="注册赠送积分">
				<el-input v-model="form.initial_integral"></el-input>
			</el-form-item>

			<el-form-item label="机器人通讯密钥">
				<el-input v-model="form.selkey"></el-input>
			</el-form-item>
			<el-form-item label="重启时间" dis>
				<p>0 5 12 * * *<br />
					第一个代表秒，第二个代表分钟，第三个代表小时，后面的不用管<br />
					比如上面就是12点5分0秒，服务器重启完成（重启完成能连接才算）,
					开始自动连接, 注意每个字后面的空格</p>
				<div v-for="(item,index) in form.restart" style="margin-top: 10px;">
					<el-input :value="item"></el-input>
					<el-button type="primary" icon="el-icon-delete" style="margin-left: 10px;"
						@click="delRestart(index)"></el-button>
				</div>
				<el-button type="primary" icon="el-icon-plus" style="margin-top: 10px;" @click="addRestart"></el-button>
			</el-form-item>
			<el-form-item label="自动连接识别图片">
				<p>使用windows自带的截图软件截图，
					替换成自己的,顺序不能换，第一张是识别游戏是否在线,
					第二张是重启后会有个掉线弹窗不点掉点不了继续游戏，<br />
					第三张就是继续游戏，
					修改完后不要调整游戏窗口、分辨率、画质等等，
					不然就会识别不到图片，就不会自动上线</p>
				<div style="width: 300px;display: flex;justify-content: space-between;" v-if="imgvi">
					<img :src="'data:image/png;base64,'+img" v-for="(img,index) in form.shibie"
						@click="openselfile(index)" />
				</div>

				<input v-show="false" ref="fileRef" type="file" @change="fileChange">
			</el-form-item>
			<el-form-item label="保存修改内容">
				<p>每次修改后都需要保存，否则不生效</p>
				<el-button type="primary" @click="onSubmit">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form: {},
				sendGoods: {
					status: "未启动"
				},
				imgIndex: 0,
				imgvi: true,
				logStatus:"未启动"
			}
		},
		created() {
			this.$axios({
				url: "/admin/getServerConfig"
			}).then(({
				data
			}) => {
				console.log(data);
				if (data.code == 200) {
					this.$data.form = data.data
				} else {
					this.$notify({
						title: '警告',
						message: data.msg,
						type: 'warning'
					});
				}
			})
			this.getsendGoods()
			this.getLog()
		},
		methods: {
			delGroup(index) {

			},
			onSubmit() {
				console.log(this.$data.form);
				// return
				this.$axios({
					url: "/admin/setServerConfig",
					data: this.$data.form
				}).then(({
					data
				}) => {
					console.log(data);
					if (data.code == 200) {
						// this.$data.form = data.data
						if (data.data.matchedCount > 0) this.$message("保存成功")
					} else {
						this.$notify({
							title: '警告',
							message: data.msg,
							type: 'warning'
						});
					}
				})
			},
			getsendGoods() {
				this.$axios({
					url: "/admin/getSendGoods",
					method: "post"
				}).then(({
					data
				}) => {
					console.log(data);
					this.$message(JSON.stringify(data))
					if (data.code != 200) {
						this.$data.sendGoods.status = "未启动"
						return
					}
					if (data.data.run) {
						this.$data.sendGoods.status = "发货中"
						return
					}
					switch (data.data.auto) {
						case 0:
							this.$data.sendGoods.status = "发货任务检测中"
							break;
						case 1:
							this.$data.sendGoods.status = "自动上线中"
							break;
						case 2:
							this.$data.sendGoods.status = "等待游戏进入"
							break;
						case 3:
							this.$data.sendGoods.status = "重新上线机器人中"
							break;
						case 4:
							this.$data.sendGoods.status = "已停止"
							break;
						default:
					}
				})
			},
			startsendGoods() {
				this.$axios({
					url: "/admin/startsendGoods",
					method: "post"
				}).then(({
					data
				}) => {
					console.log(data);
					this.$message(JSON.stringify(data))
					if (data.code != 200) {
						this.$data.sendGoods.status = "未启动"
						return
					}
					if (data.data.run) {
						this.$data.sendGoods.status = "发货中"
						return
					}
					switch (data.data.auto) {
						case 0:
							this.$data.sendGoods.status = "发货任务检测中"
							break;
						case 1:
							this.$data.sendGoods.status = "自动上线中"
							break;
						case 2:
							this.$data.sendGoods.status = "等待游戏进入"
							break;
						case 3:
							this.$data.sendGoods.status = "重新上线机器人"
							break;
						case 4:
							this.$data.sendGoods.status = "停止"
							break;
						default:
					}
				})
			},
			addRestart() {
				this.$data.form.restart.push("0 0 0 * * *")
			},
			delRestart(index) {
				console.log(index);
				this.$data.form.restart.splice(index, 1)
			},
			openselfile(index) {
				console.log(index);
				this.$data.imgIndex = index
				this.$refs.fileRef.dispatchEvent(new MouseEvent('click'))
			},
			fileChange(e) {
				console.log(e.target.files);
				let file = e.target.files[e.target.files.length - 1]
				if (window.FileReader) {
					let reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = e => {
						let base64String = e.target.result;
						// 此处可对该base64进行获取赋值传入后端
						// console.log("bese64编码：", base64String.split(",")[1]);
						this.$data.imgvi = false
						this.$data.form.shibie[this.$data.imgIndex] = base64String.split(",")[1]
						this.$data.imgvi = true

					}
				}
			},
			startLog() {
				this.$axios({
					url: "/admin/startLogServer",
					method: "post"
				}).then(({
					data
				}) => {
					this.$message(JSON.stringify(data))
				})
			},
			getLog(){
				this.$axios({
					url: "/admin/getLogServer",
					method: "post"
				}).then(({
					data
				}) => {
					this.$message(JSON.stringify(data))
					if(data.code==200){
						this.$data.logStatus="已启动"
						// return
					}else{
						this.$data.logStatus="未启动"
					}
				})
			}
		}
	}
</script>

<style>
	.config {
		width: 100%;
		height: 90%;
		background-color: white;
		display: flex;
		overflow: scroll;
	}

	.el-input {
		width: 280px;
	}

	p {
		color: red;
	}
</style>