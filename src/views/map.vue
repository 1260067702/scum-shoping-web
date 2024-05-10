<template>
	<div>

		<div class="map">
			<canvas id="map" width="750" height="750" @click="handleClick"></canvas>
		</div>
		{{x+"|"+y}}
	</div>
</template>

<script>
	export default {
		data() {
			return {
				x: 0,
				y: 0,
				canvas: null
			}
		},
		created() {
			this.draw()

		},
		methods: {
			handleClick(event) {
				// console.log(event);
				// console.log(event.offsetX, event.offsetY);
				let context = this.$data.canvas.getContext("2d")
				// console.log(context);
				context.clearRect(this.$data.x - 2, this.$data.y - 2, 4, 4)
				this.draw()

				context.beginPath()
				context.fillStyle = "red"
				context.arc(event.offsetX, event.offsetY, 2, 0, 2 * Math.PI)
				context.closePath()
				context.stroke()
				context.fill()

				this.$data.x = event.offsetX
				this.$data.y = event.offsetY

				let conX = 305
				let conY = 303.2
				if (event.offsetX > conX) {
					console.log((-(event.offsetX - conX)) * (2 * 1000));
				} else {
					console.log((conX - event.offsetX) * (2 * 1000));
				}
				if (event.offsetY > conY) {
					console.log((-(event.offsetY - conY)) * (2 * 1000));
				} else {
					console.log((conY - event.offsetY) * (2 * 1000));
				}
			},
			draw() {
				//  获取canvas
				var canvas = document.getElementById("map")
				//  由于弹窗，确保已获取到
				var a = setInterval(() => {
					//  重复获取
					canvas = document.getElementById("map")
					if (!canvas) {
						return false
					} else {
						this.$data.canvas = canvas
						clearInterval(a)
						let context = canvas.getContext('2d')
						context.beginPath()
						context.strokeStyle = "#000000"
						context.lineWidth = 1;
						for (var i = 0; i < 750; i += 150) {
							context.moveTo(i, 0)
							context.lineTo(i, 750)
							context.moveTo(0, i)
							context.lineTo(750, i)
						}
						context.fillStyle = 'white'
						let names = ["D", "C", "B", "A", "Z"]
						let x = 0
						let y = 0
						for (let key in names) {
							for (var i = 4; i > -1; i--) {
								context.fillText(names[key] + i, x + 1, y + 10)
								x += 150
							}
							y += 150
							x = 0
						}

						context.closePath()
						context.stroke()

					}
				}, 1)
			}
		}
	}
</script>

<style>
	.map {
		width: 100%;
		height: 750px;
		background-color: white;
	}

	#map {
		border: 1px solid #c7c6c6;
		background-image: url("../assets/eb6d8d9e-d473-4617-8209-1041c683822b.webp");
		background-size: 100%;
	}
</style>