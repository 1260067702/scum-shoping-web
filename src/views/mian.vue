<template>
	<div id="main">
		<div id="nav">
			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				<el-menu-item index="1">首页</el-menu-item>
				<el-menu-item index="2">商城</el-menu-item>
				<el-submenu index="10">
					<template slot="title">更多</template>
					<el-menu-item index="0">订单列表</el-menu-item>
					<el-menu-item index="999">退出登录</el-menu-item>
				</el-submenu>
				<el-submenu index="3" v-if="senior=='true'">
					<template slot="title">管理中心</template>
					<el-menu-item index="4">商品管理</el-menu-item>
					<el-menu-item index="5">礼包管理</el-menu-item>
					<el-menu-item index="6">用户管理</el-menu-item>
					<el-menu-item index="7">小队管理</el-menu-item>
					<el-menu-item index="8">传送点管理</el-menu-item>
					<el-menu-item index="9">积分充值</el-menu-item>
					<el-menu-item index="11">日志管理</el-menu-item>
					<el-menu-item index="12">回收记录</el-menu-item>
					<el-menu-item index="13">商城配置</el-menu-item>
				</el-submenu>


			</el-menu>
		</div>
		<router-view class="view" />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: '1',
				activeIndex2: '1',
				mainData: {},
				senior: false
			};
		},
		methods: {
			handleSelect(key, keyPath) {
				console.log(key, keyPath);
				switch (key) {
					case "0":
						if (this.$route.name != "orders") {
							this.$router.push("/main/orders")
						}
						break
					case "1":
						if (this.$route.name != "main_view") {
							this.$router.push("/main/main_view")
							console.log(key)

						}
						break
					case "2":
						if (this.$route.name != "jf") {
							this.$router.push("/main/jf")
						}
						break
					case "4":
						if (this.$route.name != "admin_shoping") {
							this.$router.push("/main/admin_shoping")

						}
						break
					case "5":
						if (this.$route.name != "admin_gift") {
							this.$router.push("/main/admin_gift")

						}
						break
					case "6":
						if (this.$route.name != "admin_user") {
							this.$router.push("/main/admin_user")

						}
						break
					case "8":
						if (this.$route.name != "admin_transmit") {

							this.$router.push("/main/admin_transmit")
						}
						break
					case "9":
						if (this.$route.name != "admin_recharge") {

							this.$router.push("/main/admin_recharge")
						}
						break
					case "11":
						if (this.$route.name != "admin_log") {

							this.$router.push("/main/admin_log")
						}
						break
					case "12":
						if (this.$route.name != "admin_recovery_list") {

							this.$router.push("/main/admin_recovery_list")
						}
						break
					case "13":
						if (this.$route.name != "admin_server_config") {

							this.$router.push("/main/admin_server_config")
						}
						break
					case "999":
						this.$router.push("/")
						localStorage.removeItem("token")
						break
				}
			}
		},
		created() {
			console.log(this.$route.name);
			
			if (this.$route.name != "main_view") {
				this.$router.push("/main/main_view")
			}
			this.$data.senior = localStorage.getItem("senior")
			
		}
	}
</script>

<style>
	#main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-flow: column;
		background-color: #303133;
	}

	.view {
		width: 100%;
		height: calc(100% - 61px);
		overflow: scroll-y;
	}
</style>