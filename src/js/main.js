import { data } from "./data.js"

class AudioController {
	constructor() {
		this.audios = []
		this.currentAudio = {}

		this.initVizualizer = initVizualizer

		this.audioList = document.querySelector(".items")
		this.currentItem = document.querySelector(".current")
		this.repeatButton = document.querySelector(".handling-repeat")
		this.volumeButton = document.querySelector(".controls-volume")
		this.shuffleButton = document.querySelector(".handling-shuffle")

		this.playing = false
		this.repeating = false
		this.playButton = null
		this.volume = 0.5
	}

	init() {
		this.renderAudios()
		this.initEvents()
	}

	formatTime(time) {
		return time < 10 ? `0${time}` : time
	}

	toMinAndSec(duration) {
		const minutes = this.formatTime(Math.floor(duration / 60))
		const seconds = this.formatTime(Math.round(duration - minutes * 60))

		return `${minutes}:${seconds}`
	}

	shufle(arr) {
		return arr.sort(() => 0.5 - Math.random())
	}

	renderItem({ id, link, group, track, duration, genre }) {
		const [image] = link.split(".")
		const trackTime = this.toMinAndSec(duration)
		return `    <div class="item" data-id='${id}'>
                            <div
                                class="item-image"
                                style="background-image: url(./assets/images/${image}.jpg)"
                            ></div>
                            <div class="item-titles">
                                <h2 class="item-group">${group}</h2>
                                <h3 class="item-track">${track}</h3>
                            </div>
                            <p class="item-duration">${trackTime}</p>
                            <p class="item-genre">${genre}</p>
                            <button class="item-play">
                                <svg class="icon-play">
                                    <use xlink:href="./assets/images/sprite.svg#play"></use>
                                </svg>
                            </button>
                    </div>`
	}

	loadAudioData(audio) {
		this.audioList.innerHTML += this.renderItem(audio)
	}

	initEvents() {
		this.audioList.addEventListener("click", this.handleItem.bind(this))
		this.repeatButton.addEventListener("click", this.handleRepeat.bind(this))
		this.volumeButton.addEventListener("input", this.handleVolume.bind(this))
		this.shuffleButton.addEventListener("click", this.handleShufle.bind(this))
	}

	handleShufle() {
		const { children } = this.audioList
		const shuffled = this.shufle([...children])
		this.audioList.innerHTML = ""
		shuffled.forEach((item) => this.audioList.appendChild(item))
	}

	handleVolume(e) {
		this.volume = e.target.value
		if (!this.currentAudio?.audio) return

		this.currentAudio.audio.volume = e.target.value
	}

	handleRepeat(e) {
		e.target.classList.toggle("active", !this.repeating)
		this.repeating = !this.repeating
	}

	handleAudioPlay() {
		const { audio } = this.currentAudio

		!this.playing ? audio.play() : audio.pause()
		this.playButton.classList.toggle("playing", !this.playing)
		this.playing = !this.playing
		this.visualizer.preparation(this.currentAudio.audio)
	}

	handleNext() {
		const currentItem = document.querySelector(
			`[data-id="${this.currentAudio.id}"]`
		)
		const next = currentItem.nextElementSibling?.dataset
		const first = this.audioList.firstChild.nextElementSibling?.dataset

		const itemId = next?.id || first?.id

		if (!itemId) return

		this.setCurrentItem(itemId)
	}

	handlePrev() {
		const currentItem = document.querySelector(
			`[data-id="${this.currentAudio.id}"]`
		)
		const prev = currentItem.previousElementSibling?.dataset
		const last = this.audioList.lastChild.dataset

		const itemId = prev?.id || last?.id

		if (!itemId) return

		this.setCurrentItem(itemId)
	}

	handlePlayer() {
		const play = document.querySelector(".controls-play")
		const next = document.querySelector(".controls-next")
		const prev = document.querySelector(".controls-prev")

		this.playButton = play

		play.addEventListener("click", this.handleAudioPlay.bind(this))
		next.addEventListener("click", this.handleNext.bind(this))
		prev.addEventListener("click", this.handlePrev.bind(this))
	}
	setProgress(e) {
		const width = e.target.clientWidth
		const clickX = e.offsetX
		const duration = this.currentAudio.duration
		const currentTime = (clickX / width) * duration
		this.currentAudio.audio.currentTime = currentTime

		console.log(this.currentAudio.audio.currentTime)
	}
	audioUpdateHandler({ audio, duration }) {
		const progressCurent = document.querySelector(".progress-current")
		const progress = document.querySelector(".progress")
		const timeline = document.querySelector(".timeline-start")
		audio.addEventListener("timeupdate", (e) => {
			const { currentTime } = e.target
			const width = (currentTime * 100) / duration
			timeline.textContent = this.toMinAndSec(currentTime)
			progressCurent.style.width = `${width}%`
		})
		audio.addEventListener("ended", (e) => {
			e.target.currentTime = 0
			progressCurent.style.width = "0%"
			this.repeating ? e.target.play() : this.handleNext()
		})
		progress.addEventListener("click", this.setProgress.bind(this))
	}

	renderCurrentItem({ id, link, group, track, duration, year }) {
		const [image] = link.split(".")
		const trackTime = this.toMinAndSec(duration)
		return `
						<div
							class="current-image"
							style="background-image: url(./assets/images/${image}.jpg)"
						></div>
						<div class="current-info">
							<div class="current-info__top">
								<div class="current-info__titles">
									<h2 class="current-info__group">${group}</h2>
									<h3 class="current-info__track">${track}</h3>
								</div>
								<div class="current-info__year">${year}</div>
							</div>
							<div class="controls">
								<div class="controls-buttons">
									<button class="controls-button controls-prev">
										<svg class="icon-arrow">
											<use xlink:href="./assets/images/sprite.svg#arrow"></use>
										</svg>
									</button>

									<button class="controls-button controls-play">
										<svg class="icon-pause">
											<use xlink:href="./assets/images/sprite.svg#pause"></use>
										</svg>
										<svg class="icon-play">
											<use xlink:href="./assets/images/sprite.svg#play"></use>
										</svg>
									</button>

									<button class="controls-button controls-next">
										<svg class="icon-arrow">
											<use xlink:href="./assets/images/sprite.svg#arrow"></use>
										</svg>
									</button>
								</div>
								<div class="controls-progress">
									<div class="progress">
										<div class="progress-current" ></div>
									</div>
									<div class="timeline">
										<span class="timeline-start">00:00</span>
										<span class="timeline-end">${trackTime}</span>
									</div>
								</div>
							</div>
						
						</div>				
`
	}

	pauseCurrentAudio() {
		const { audio } = this.currentAudio
		if (!audio) return

		audio.pause()
		audio.currentTime = 0
	}

	togglePlaying() {
		const { audio } = this.currentAudio
		this.playing ? audio.play() : audio.pause()
		this.playButton.classList.toggle("playing", this.playing)
	}

	setCurrentItem(itemId) {
		const current = this.audios.find((audio) => +audio.id === +itemId)

		if (!current) return
		this.pauseCurrentAudio()
		this.currentAudio = current
		this.currentItem.innerHTML = this.renderCurrentItem(current)

		current.audio.volume = this.volume

		this.handlePlayer()
		this.audioUpdateHandler(current)
		setTimeout(() => {
			this.togglePlaying()
		}, 10)
	}

	handleItem(e) {
		const { id } = e.target.dataset
		if (!id) return
		this.setCurrentItem(id)
	}

	renderAudios() {
		data.forEach((item) => {
			const audio = new Audio(`./assets/audio/${item.link}`)

			audio.addEventListener("loadeddata", () => {
				const newItem = { ...item, duration: audio.duration, audio }
				this.audios = [...this.audios, newItem]
				this.loadAudioData(newItem)
			})
		})
	}
}

const controller = new AudioController()

controller.init()
