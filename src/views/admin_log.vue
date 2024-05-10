<template>
	<div id="log">
		<el-col :span="12" id="tabact">
			<el-menu default-active="0" class="el-menu-vertical-demo" @select="handleOpen">
				<el-menu-item index="0">
					<i class="el-icon-tickets"></i>
					<span slot="title">日志列表</span>
				</el-menu-item>
				<el-menu-item index="1">
					<i class="el-icon-map-location"></i>
					<span slot="title">登录日志</span>
				</el-menu-item>
				<el-menu-item index="2">
					<i class="el-icon-scissors"></i>
					<span slot="title">击杀记录</span>
				</el-menu-item>
				<el-menu-item index="3">
					<i class="el-icon-key"></i>
					<span slot="title">开锁记录</span>
				</el-menu-item>
				<el-menu-item index="4">
					<i class="el-icon-goods"></i>
					<span slot="title">交易记录</span>
				</el-menu-item>
			</el-menu>
		</el-col>
		<router-view class="log_view" />
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		created() {
			if (this.$route.name != "admin_log_list") {
				this.$router.push("/main/admin_log/admin_log_list")
			}
		},
		methods: {
			handleOpen(e) {
				console.log(e);
				switch (e) {
					case "0":
						if (this.$route.name != "admin_log_list") {
							this.$router.push("/main/admin_log/admin_log_list")
						}
						break
					case "1":
						if (this.$route.name != "admin_login_table") {
							this.$router.push("/main/admin_log/admin_login_table")
						}
						break
					case "2":
						if (this.$route.name != "admin_enevt_kill") {
							this.$router.push("/main/admin_log/admin_enevt_kill")
						}
						break
					case "3":
						if (this.$route.name != "admin_gameplay") {
							this.$router.push("/main/admin_log/admin_gameplay")
						}
						break
					case "4":
						if (this.$route.name != "admin_recovery") {
							this.$router.push("/main/admin_log/admin_recovery")
						}
						break
				}
			}
		}
	}
</script>

<style>
	#log {
		display: flex;
	}

	#tabact {
		width: 120px;
		height: 95%;
		background-color: white;
	}

	.log_view {
		width: calc(100% - 120px);
		height: 95%;
		/* background-color: aqua; */
		/* overflow: hidden; */
	}
</style>