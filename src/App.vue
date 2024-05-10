<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
	export default {
		data() {
			return {
				title: "商城"
			}
		},
		created() {
			this.$axios({
				url:"/api/selectServer"
			}).then(({data})=>{
				console.log(data);
				if(data.code==200){
					this.$data.title=data.data.server
					this.$title=data.data.server
					document.title=data.data.server
					this.$cache.options=data.data.group
					return
				}
				document.title="SCUM服务器商城"
			})
			
			this.$cache['options'] = [{
				value: '热销',
				label: '热销'
			},{
				value: '套餐',
				label: '套餐'
			}, {
				value: '远程武器',
				label: '远程武器'
			}, {
				value: '近战武器',
				label: '近战武器'
			}, {
				value: '枪械配件',
				label: '枪械配件'
			}, {
				value: '满配枪',
				label: '满配枪'
			}, {
				value: '弹药',
				label: '弹药'
			}, {
				value: '载具',
				label: '载具'
			}, {
				value: '药品',
				label: '药品'
			}, {
				value: '建筑材料',
				label: '建筑材料'
			}, {
				value: '工具',
				label: '工具'
			}, {
				value: '食品',
				label: '食品'
			}, {
				value: '服装',
				label: '服装'
			}, {
				value: '渔具',
				label: '渔具'
			}, {
				value: '特殊',
				label: '特殊'
			}]
		}
	}
</script>
<style>
	#app {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: column;
	}

	* {
		padding: 0;
		margin: 0;
	}
</style>