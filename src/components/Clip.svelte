<script>
	// These values are bound to properties of the video
	let time = 0;
	let duration;
	let paused = true;

	let divWidth, divHeight;
	$: divRatio = divWidth/divHeight;

	export let showControls = true;
	let showControlsTimeout;

	export let src;
	export let ratio;
	export let size = '3/4';
	export let hasWatched;

	// Used to track time and position of last mouse down event
	let lastMouseDown;
	let lastMouseDownX;

	$: if (time > duration / 2) hasWatched = true;

	function handleMove(e) {
		// Make the controls visible, but fade out after
		// 1.5 seconds of inactivity
		clearTimeout(showControlsTimeout);
		showControlsTimeout = setTimeout(() => showControls = false, 1500);
		showControls = true;

		if (!duration) return; // video not loaded yet
		if (e.type !== 'touchmove' && !(e.buttons & 1)) return; // mouse not down

		const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
		// Only seek if mouse moves more than 20 pixels
		if (Math.abs(lastMouseDownX - clientX) < 20) return;
		const { left, right } = this.getBoundingClientRect();
		time = duration * (clientX - left) / (right - left);
	}

	// we can't rely on the built-in click event, because it fires
	// after a drag — we have to listen for clicks ourselves
	function handleMousedown(e) {
		lastMouseDown = new Date();
		lastMouseDownX = e.clientX;
	}

	function handleMouseup(e) {
		if (new Date() - lastMouseDown < 400) {
			if (paused) {
				e.target.play();
				paused = false;
			} else {
				e.target.pause();
				paused = true;
			}
		}
	}

	function format(seconds) {
		if (isNaN(seconds)) return '...';

		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = '0' + seconds;

		return `${minutes}:${seconds}`;
	}
</script>

<div class="h-{size}" bind:clientWidth={divWidth} bind:clientHeight={divHeight}>
	<div class="controls" style="opacity: {duration && showControls ? 1 : 0}; 
		top: {divRatio >= ratio-.01 ? 0 : (divHeight-(divHeight*(divRatio/ratio)))/2}px; 
		left: {divRatio <= ratio+.01 ? 0 : (divWidth-(divWidth*(ratio/divRatio)))/2}px; 
		width: {divRatio <= ratio+.01 ? divWidth : divWidth*(ratio/divRatio)}px">
		<progress value="{(time / duration) || 0}"/>

		<div class="info">
			<span class="time">{format(time)}</span>
			<span>click anywhere to {paused ? 'play' : 'pause'} / drag to seek</span>
			<span class="time">{format(duration)}</span>
		</div>
	</div>
	<video
		class="h-full"
		{src}
		on:mousemove={handleMove}
		on:touchmove|preventDefault={handleMove}
		on:mousedown={handleMousedown}
		on:mouseup={handleMouseup}
		bind:currentTime={time}
		bind:duration
		bind:paused>
        <track kind="captions"/>
	</video>

	
</div>

<style>
	div {
		position: relative;
	}

	.controls {
		position: absolute;
		transition: opacity 1s;
	}

	.info {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	span {
		padding: 0.2em 0.5em;
		color: white;
		text-shadow: 0 0 8px black;
		font-size: 1.4em;
		opacity: 0.7;
	}

	.time {
		width: 3em;
	}

	.time:last-child { text-align: right }

	progress {
		display: block;
		width: 100%;
		height: 10px;
		-webkit-appearance: none;
		appearance: none;
	}

	progress::-webkit-progress-bar {
		background-color: rgba(0,0,0,0.2);
	}

	progress::-webkit-progress-value {
		background-color: rgba(255,255,255,0.6);
	}

	video {
		width: 100%;
	}
</style>