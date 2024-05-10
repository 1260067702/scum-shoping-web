<template>
	<div class="home">
		<canvas id="c"></canvas>
		<form action="#">
			<div class="kuan-input">
				<div class="k-i">
					<img src="../assets/SCUM_logo_White.png">
					<h3>{{title}}</h3>
					<input type="text" placeholder="昵称" v-model="nickname" v-if="status" minlength="1" maxlength="10">
					<input type="text" placeholder="账号" v-model="username" minlength="6" maxlength="20">
					<input type="password" placeholder="密码" v-model="password" minlength="6" maxlength="20">
					<input type="password" placeholder="确认密码" v-model="tow_password" v-if="status" minlength="6"
						maxlength="20">
					<input type="number" placeholder="STEAMID" v-model="steamid" v-if="status" maxlength="17"
						minlength="17">
					<div class="yanshi" style="width: 160px;">
						<a href="#" class="white" v-if="!status">
							<p><span class="bg"></span><span class="base"></span><span class="text"
									@click="loginBtn">登录</span></p>
						</a>
						<a href="#" v-if="!status">
							<p><span class="bg"></span><span class="base"></span><span class="text"
									@click="status=!status">注册</span></p>
						</a>
						<a href="#" v-if="status">
							<p><span class="bg"></span><span class="base"></span><span class="text"
									@click="regBtn">注册</span></p>
						</a>
						<a href="#" class="white" v-if="status">
							<p><span class="bg"></span><span class="base"></span><span class="text"
									@click="status=!status">登录</span></p>
						</a>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				canvas: null,
				status: false,
				username: "",
				password: "",
				isShow: 1,
				nickname: "",
				tow_password: "",
				steamid: "",
				config: {},
				title:"服务器商城"
			}
		},
		created() {
			let username = localStorage.getItem("username", this.$data.username)
			let password = localStorage.getItem("password", this.$data.password)
			if (username) this.username = username
			if (password) this.password = password

			this.getCtx()

		},
		methods: {
			getCtx() {
				//  获取canvas
				var canvas = document.getElementById("c")
				//  由于弹窗，确保已获取到
				var a = setInterval(() => {
					//  重复获取
					canvas = document.getElementById("c")
					if (!canvas) {
						return false
					} else {
						this.$data.canvas = canvas
						clearInterval(a)
						this.bg()
					}
				}, 1000)

				// this.$data.canvas = canvas
				// this.bg()
			},
			bg() {
				// console.log(this.$data.canvas.width);
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
				let ctx = this.$data.canvas.getContext("2d");
				let w = this.canvas.width,
					h = this.canvas.height
				let opts = {
					len: 20,
					count: 50,
					baseTime: 10,
					addedTime: 10,
					dieChance: .05,
					spawnChance: 1,
					sparkChance: .1,
					sparkDist: 10,
					sparkSize: 2,
					color: 'hsl(hue,100%,light%)',
					baseLight: 50,
					addedLight: 10,
					shadowToTimePropMult: 6,
					baseLightInputMultiplier: .01,
					addedLightInputMultiplier: .02,
					cx: w / 2,
					cy: h / 2,
					repaintAlpha: .04,
					hueChange: .1
				};
				let tick = 0,
					lines = [],
					dieX = w / 2 / opts.len,
					dieY = h / 2 / opts.len,
					baseRad = Math.PI * 2 / 6;

				ctx.fillStyle = 'black';
				ctx.fillRect(0, 0, w, h);
				// console.log(ctx);

				function loop() {
					window.requestAnimationFrame(loop);
					++tick;
					ctx.globalCompositeOperation = 'source-over';
					ctx.shadowBlur = 0;
					ctx.fillStyle = 'rgba(0,0,0,alp)'.replace('alp', opts.repaintAlpha);
					ctx.fillRect(0, 0, w, h);
					ctx.globalCompositeOperation = 'lighter';

					if (lines.length < opts.count && Math.random() < opts.spawnChance) lines.push(new Line());

					lines.map(function(line) {
						line.step()
					})
				}

				function Line() {
					this.x = 0;
					this.y = 0;
					this.addedX = 0;
					this.addedY = 0;
					this.rad = 0;
					this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math
						.random();
					this.color = opts.color.replace('hue', tick * opts.hueChange);
					this.cumulativeTime = 0;
					// console.log(this);

					this.beginPhase = () => {
						this.x += this.addedX;
						this.y += this.addedY;
						this.time = 0;
						this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0;
						this.rad += baseRad * (Math.random() < .5 ? 1 : -1);
						this.addedX = Math.cos(this.rad);
						this.addedY = Math.sin(this.rad);
						if (Math.random() < opts.dieChance || this.x > dieX || this.x < -dieX || this.y > dieY || this
							.y < -dieY) new Line()
					}
					this.step = function() {
						++this.time;
						++this.cumulativeTime;
						if (this.time >= this.targetTime) this.beginPhase();
						var prop = this.time / this.targetTime,
							wave = Math.sin(prop * Math.PI / 2),
							x = this.addedX * wave,
							y = this.addedY * wave;
						ctx.shadowBlur = prop * opts.shadowToTimePropMult;
						ctx.fillStyle = ctx.shadowColor = this.color.replace('light', opts.baseLight + opts
							.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier));
						ctx.fillRect(opts.cx + (this.x + x) * opts.len, opts.cy + (this.y + y) * opts.len, 2, 2);
						if (Math.random() < opts.sparkChance) ctx.fillRect(opts.cx + (this.x + x) * opts.len + Math
							.random() *
							opts
							.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2, opts.cy + (this.y +
								y) *
							opts
							.len +
							Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2,
							opts
							.sparkSize,
							opts.sparkSize)
					}

					this.beginPhase()
				}




				loop();

				window.addEventListener('resize',
					() => {
						this.canvas.width = window.innerWidth;
						this.canvas.height = window.innerHeight;
						ctx.fillStyle = 'black';
						ctx.fillRect(0, 0, w, h);
						opts.cx = w / 2;
						opts.cy = h / 2;
						dieX = w / 2 / opts.len;
						dieY = h / 2 / opts.len
					});

			},

			loginBtn: function() {
				if (this.$data.username == "") {

					this.$notify({
						title: '警告',
						message: '账号不能为空',
						type: 'warning'
					});
					return
				}
				if (this.$data.password == "") {

					this.$notify({
						title: '警告',
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
						// this.$message(data.msg)
						this.$notify({
							title: '消息',
							message: data.msg,
							type: "success"
						});
						localStorage.setItem("token", data.data.token)
						localStorage.setItem("senior", data.data.senior)
						localStorage.setItem("username", this.$data.username)
						localStorage.setItem("password", this.$data.password)
						this.$router.push("/main")
					} else {
						this.$notify({
							title: '警告',
							message: data.msg,
							type: 'warning'
						});
					}
				})
			},
			regBtn: function() {
				if (this.$data.nickname == "") {
					this.$notify({
						title: '警告',
						message: "昵称不能为空",
						type: 'warning'
					});
					return
				}
				if (this.$data.username == "") {

					this.$notify({
						title: '警告',
						message: "账号不能为空",
						type: 'warning'
					});
				}
				if (this.$data.password == "") {
					this.$notify({
						title: '警告',
						message: "密码不能为空",
						type: 'warning'
					});
					return
				}
				if (this.$data.tow_password == "") {
					this.$notify({
						title: '警告',
						message: "确认密码不能为空",
						type: 'warning'
					});
					return
				}
				if (this.$data.steamid == "") {

					this.$notify({
						title: '警告',
						message: "STEAMID不能为空",
						type: 'warning'
					});
					return
				}
				// this.$message("正确")

				if (this.$data.steamid.length != 17) {
					this.$notify({
						title: '警告',
						message: "STEAMID不正确",
						type: 'warning'
					});
					return
				}
				if (this.$data.username.length < 3) {

					this.$notify({
						title: '警告',
						message: "账号不能小于3",
						type: 'warning'
					});
					return
				}
				if (this.$data.password.length < 6) {
					this.$notify({
						title: '警告',
						message: "密码不能小于6",
						type: 'warning'
					});
					return
				}
				if (this.$data.tow_password != this.$data.password) {
					this.$notify({
						title: '警告',
						message: "两次密码不一致",
						type: 'warning'
					});
					return
				}
				if (this.$data.nickname.length < 1) {
					this.$notify({
						title: '警告',
						message: "昵称不能小于1",
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
						// this.$message(data.msg)
						this.$notify({
							title: '消息',
							message: data.msg,
							type: "success"
						});
						this.$data.steamid = ""
						// this.$data.username = ""
						this.$data.nickname = ""
						// this.$data.password = ""
						this.$data.tow_password = ""
						localStorage.setItem("username", this.$data.username)
						localStorage.setItem("password", this.$data.password)
						// location.reload();
					} else {
						this.$notify({
							title: '消息',
							message: data.msg,
							type: 'warning'
						});
					}
				})
			}
		}
	}
</script>

<style>
	.k-i h3 {
		color: white;
	}

	.k-i img {
		width: 300px;
		margin-bottom: 30px;
	}

	body {
		background: #0f1923;
		font-family: "Muli";
	}

	.yanshi {
		display: flex;
		flex-flow: column;
		/* width: 160px; */
		/* height: 90px; */
		margin-top: 30px;
	}

	.yanshi div {
		display: -webkit-box;
		display: flex;
		height: 100vh;
		-webkit-box-align: center;
		align-items: center;
		-webkit-box-pack: center;
		justify-content: center;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex-flow: column;
	}

	div a {
		width: 100%;
		max-width: 140px;
		height: 34px;
		padding: 8px;
		font-size: 0.8rem;
		font-weight: 900;
		color: #ff4655;
		text-align: center;
		text-transform: uppercase;
		text-decoration: none;
		box-shadow: 0 0 0 1px inset rgba(236, 232, 225, 0.3);
		position: relative;
		margin: 10px 0;
	}

	div a.white:hover>p {
		color: #ece8e1;
	}

	div a.white>p {
		background: #ece8e1;
		color: #0f1923;
	}

	div a.white>p span.base {
		border: 1px solid transparent;
	}

	div a.transparent:hover>p {
		color: #ece8e1;
	}

	div a.transparent:hover>p span.text {
		box-shadow: 0 0 0 1px #ece8e1;
	}

	div a.transparent>p {
		background: #0f1923;
		color: #ece8e1;
	}

	div a.transparent>p span.base {
		border: 1px solid #ece8e1;
	}

	div a:after,
	div a:before {
		content: "";
		width: 1px;
		position: absolute;
		height: 8px;
		background: #0f1923;
		left: 0;
		top: 50%;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}

	div a:before {
		right: 0;
		left: initial;
	}

	div a p {
		margin: 0;
		height: 33px;
		line-height: 33px;
		box-sizing: border-box;
		z-index: 1;
		left: 0;
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	div a p span.base {
		box-sizing: border-box;
		position: absolute;
		z-index: 2;
		width: 100%;
		height: 100%;
		left: 0;
		border: 1px solid #ff4655;
	}

	div a p span.base:before {
		content: "";
		width: 2px;
		height: 2px;
		left: -1px;
		top: -1px;
		background: #0f1923;
		position: absolute;
		-webkit-transition: 0.3s ease-out all;
		transition: 0.3s ease-out all;
	}

	div a p span.bg {
		left: -5%;
		position: absolute;
		background: #ff4655;
		width: 0;
		height: 100%;
		z-index: 3;
		-webkit-transition: 0.3s ease-out all;
		transition: 0.3s ease-out all;
		-webkit-transform: skewX(-10deg);
		transform: skewX(-10deg);
	}

	div a p span.text {
		z-index: 4;
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	div a p span.text:after {
		content: "";
		width: 4px;
		height: 4px;
		right: 0;
		bottom: 0;
		background: #0f1923;
		position: absolute;
		-webkit-transition: 0.3s ease-out all;
		transition: 0.3s ease-out all;
		z-index: 5;
	}

	div a:hover {
		color: #ece8e1;
	}

	div a:hover span.bg {
		width: 110%;
	}

	div a:hover span.text:after {
		background: #ece8e1;
	}

	.k-i input {
		height: 30px;
		width: 240px;
		margin-top: 10px;
		border: 1px solid #ff4655;
		opacity: .7;
		background-color: #ffffff88;
		padding-left: 5px;
		/* outline-color: #0cbafb; */
		/* outline-width: 10px; */
		/* outline-style: none; */
		caret-color: #ff4655;
		color: aliceblue;
	}

	.k-i input:focus {
		outline: 1px solid #000;
		border: 1px solid #00ff7f;
	}

	.k-i input::placeholder {
		color: #000056;
	}

	.k-i {
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
	}

	.kuan-input {
		position: absolute;
		width: 100%;
		height: 100%;
		/* background-color: #ffffff; */
		/* z-index: 100; */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.home {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: black;
	}
</style>