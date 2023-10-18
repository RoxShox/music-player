// Создание Музыкального визуализатора

const columnsGap = 2
const columnCount = 256 // Кол-во колонок: 1024, 512, 256, 128, 64

const canvas = document.getElementById("vizualizer__player")
const ctx = canvas.getContext("2d")
const audio = document.querySelector(".audio")

let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let source = audioCtx.createMediaElementSource(audio)

let analyser = audioCtx.createAnalyser()
analyser.fftSize = columnCount
source.connect(analyser) // Подключаем анализатор к элементу audio
analyser.connect(audioCtx.destination) // Без этой строки нет звука, но анализатор работает.
let frequencyData = new Uint8Array(analyser.frequencyBinCount)

document.getElementById("player-btn").addEventListener("click", function () {
	if (!this.classList.contains("play-btn__play")) {
		audio.play()
		this.textContent = "Pause"
		this.classList.add("play-btn__play")
	} else {
		audio.pause()
		this.textContent = "Play"
		this.classList.remove("play-btn__play")
	}
})
// Рисует колонку
function drawColumn(x, width, height) {
	const gradient = ctx.createLinearGradient(
		0,
		canvas.height - height / 2,
		0,
		canvas.height
	)
	gradient.addColorStop(1, "rgba(255,255,255,1)")
	gradient.addColorStop(0.9, "rgba(255,150,0,1)")
	gradient.addColorStop(0, "rgba(255,0,0,0)")
	ctx.fillStyle = gradient
	ctx.fillRect(x, canvas.height - height / 2, width, height)
}

function render() {
	analyser.getByteFrequencyData(frequencyData) // Записываем в массив данные уровней частот

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const columnWidth =
		canvas.width / frequencyData.length -
		columnsGap +
		columnsGap / frequencyData.length // Ширина колонки
	const heightScale = canvas.height / 100 // Масштабный коэффициент

	let xPos = 0

	for (let i = 0; i < frequencyData.length; i++) {
		let columnHeight = frequencyData[i] * heightScale

		drawColumn(xPos, columnWidth, columnHeight / 2)

		xPos += columnWidth + columnsGap
	}

	// window.requestAnimationFrame(render)
}
render()
// window.requestAnimationFrame(render)
