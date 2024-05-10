<template>
	<div class="index">
		<h1>{{config?config.server:""}}</h1>
		<div class="reg" v-if="isShow==2">
			<el-input v-model="nickname" placeholder="昵称" minlength="1" maxlength="10"></el-input>
			<el-input v-model="username" placeholder="账号" minlength="6" maxlength="11"></el-input>
			<el-input v-model="password" placeholder="密码" minlength="6" maxlength="15"></el-input>
			<el-input v-model="tow_password" placeholder="确认密码" minlength="6" maxlength="15"></el-input>
			<el-input v-model="steamid" placeholder="SteamId" maxlength="17" minlength="17"></el-input>
			<h5 class="link_login" href="#" @click="toLogin">返回登录</h5>
			<el-button @click="regBtn">注册</el-button>
		</div>
		<div class="login" v-if="isShow==1">
			<el-input v-model="username" placeholder="账号"></el-input>
			<el-input v-model="password" type="password" show-password placeholder="密码"></el-input>
			<h5 class="link_reg" href="#" @click="toReg" v-if="config.registration_switch">注册</h5>
			<el-button @click="loginBtn">登录</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'HomeView',
		components: {},
		data() {
			return {
				username: "",
				password: "",
				isShow: 1,
				nickname: "",
				tow_password: "",
				steamid: "",
				config: {}
			}
		},
		methods: {
			toReg: function() {
				console.log("跳转注册");
				console.log(this);
				this.$data.isShow = 2
			},
			toLogin: function() {
				console.log("跳转登录");
				this.$data.isShow = 1
			},
			loginBtn: function() {
				if (this.$data.username == "") {
					this.$message({
						message: '昵称不能为空',
						type: 'warning'
					});
					return
				}
				if (this.$data.password == "") {
					this.$message({
						message: '密码不能为空',
						type: 'warning'
					});
					return
				}
				this.$axios({
					url: "/api/login",
					data: {
						"username": this.$data.username,
						"password": this.$data.password
					}
				}).then(({
					data
				}) => {
					if (data.code == 200) {
						this.$message(data.msg)
						localStorage.setItem("token", data.data.token)
						localStorage.setItem("nickName", data.data.nickname)
						localStorage.setItem("username", data.data.username)
						localStorage.setItem("jf", data.data.jf)
						localStorage.setItem("senior", data.data.senior)
						this.$router.push("/main")
					} else {
						this.$message({
							message: data.msg,
							type: 'warning'
						});
					}
				})
			},
			regBtn: function() {
				if (this.$data.nickname == "") {
					this.$message({
						message: '昵称不能为空',
						type: 'warning'
					});
					return
				}
				if (this.$data.username == "") {
					this.$message({
						message: '账号不能为空',
						type: 'warning'
					});
				}
				if (this.$data.password == "") {
					this.$message({
						message: '密码不能为空',
						type: 'warning'
					});
					return
				}
				if (this.$data.tow_password == "") {
					this.$message({
						message: '确认密码不能为空',
						type: 'warning'
					});
					return
				}
				if (this.$data.steamid == "") {
					this.$message({
						message: 'steamid不能为空',
						type: 'warning'
					});
					return
				}
				// this.$message("正确")

				if (this.$data.steamid.length != 17) {
					this.$message({
						message: 'steamId不正确',
						type: 'warning'
					});
					return
				}
				if (this.$data.username.length < 3) {
					this.$message({
						message: '账号不能小于3',
						type: 'warning'
					});
					return
				}
				if (this.$data.password.length < 6) {
					this.$message({
						message: '密码不能小于6',
						type: 'warning'
					});
					return
				}
				if (this.$data.tow_password != this.$data.password) {
					this.$message({
						message: '两次密码不一致',
						type: 'warning'
					});
					return
				}
				if (this.$data.nickname.length < 1) {
					this.$message({
						message: '昵称不能小于6',
						type: 'warning'
					});
					return
				}
				this.$axios({
					url: "/api/createUser",
					data: {
						steamId: this.$data.steamid,
						username: this.$data.username,
						nickname: this.$data.nickname,
						password: this.$data.password
					}
				}).then(({
					data
				}) => {
					console.log(data);
					if (data.code == 200) {
						this.$message(data.msg)
						this.$data.steamid = ""
						this.$data.username = ""
						this.$data.nickname = ""
						this.$data.password = ""
						this.$data.tow_password = ""
					} else {
						this.$message({
							message: data.msg,
							type: 'warning'
						});
					}
				})
			}
		},
		created() {
			this.$axios({
				url: "/api/selectServer"
			}).then(({
				data
			}) => {
				console.log(data);
				if (data.code == 200) {
					this.$cache['config'] = data.data
					this.config=data.data
				} else {

				}
			})
		}
	}
</script>
<style>
	.index {
		/* background-color: aqua; */
		width: 50%;
		height: 50%;
		display: flex;
		flex-flow: column;
		align-items: center;

	}

	h1 {
		margin-top: 20px;
		color: white
	}

	.reg {
		display: flex;
		flex-flow: column;
		align-items: center;
		border-radius: 4px;

	}

	.reg * {
		margin: 5px;
	}

	.link_reg {
		margin-left: 70%;
		/* line-height: 10px; */
		/* margin: 0 10; */
		margin-top: 0;
		margin-bottom: 0;
		cursor: default;
		color: white;
	}

	.link_reg:hover {
		color: cadetblue;
	}

	.login {
		display: flex;
		flex-flow: column;
		align-items: center;
		border-radius: 4px;

	}

	.login * {
		margin: 10px;
	}

	.link_login {
		margin-left: 70%;
		/* line-height: 10px; */
		/* margin: 0 10; */
		margin-top: 0;
		margin-bottom: 0;
		cursor: default;
		color: white;
	}

	.link_login:hover {
		color: cadetblue;
	}
</style>