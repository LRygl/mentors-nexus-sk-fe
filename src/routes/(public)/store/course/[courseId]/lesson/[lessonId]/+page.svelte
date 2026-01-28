<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { Maximize, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { API_CONFIG, buildApiUrl } from '$lib/API/APIConfiguration';

	let { data }: { data: PageData } = $props();
	let lesson = $derived(data.lesson);
	let courseId = $derived(data.courseId);

	// State management using Svelte 5 runes
	// Think of $state as @Autowired fields in Spring - they're managed for you
	let videoElement = $state<HTMLVideoElement | null>(null);
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let volume = $state(1);
	let isMuted = $state(false);
	let isLoading = $state(true);
	let showControls = $state(true);
	let hideControlsTimeout: number | null = null;
	let playbackRate = $state(1);
	let autoplay = false;

	// Computed properties - like getters in Java
	// These automatically update when dependencies change
	let progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
	let formattedCurrentTime = $derived(formatTime(currentTime));
	let formattedDuration = $derived(formatTime(duration));
	/**
	 * Build video URL using centralized API config
	 * This follows your pattern of using API_CONFIG for all backend calls
	 */

/*	let videoUrl = $derived(
		`${API_CONFIG.FULL_BASE_URL}${API_CONFIG.ENDPOINTS.VIDEO_STREAM}/${lesson.uuid}`
	);*/

	let videoUrl = $derived(`/api/v1/video/${lesson.uuid}`);
	/**
	 * Component initialization - like @PostConstruct in Spring
	 */
	onMount(() => {
		if (!videoElement) return;

		videoElement.volume = volume;
		videoElement.playbackRate = playbackRate;

		// Auto-hide controls after inactivity
		const handleMouseMove = () => {
			showControls = true;
			if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
			hideControlsTimeout = setTimeout(() => {
				if (isPlaying) showControls = false;
			}, 3000) as unknown as number;
		};

		videoElement.addEventListener('mousemove', handleMouseMove);

		return () => {
			videoElement?.removeEventListener('mousemove', handleMouseMove);
			if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
		};
	});

	/**
	 * Utility: Format seconds to MM:SS or HH:MM:SS
	 */
	function formatTime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		if (hours > 0) {
			return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		}
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	/**
	 * Toggle play/pause - like a controller action
	 */
	function togglePlay() {
		if (!videoElement) return;
		isPlaying ? videoElement.pause() : videoElement.play();
	}

	/**
	 * Seek to specific position when clicking progress bar
	 */
	function seek(event: MouseEvent) {
		if (!videoElement) return;

		const progressBar = event.currentTarget as HTMLElement;
		const rect = progressBar.getBoundingClientRect();
		const percent = (event.clientX - rect.left) / rect.width;
		videoElement.currentTime = percent * duration;
	}

	/**
	 * Skip forward/backward
	 */
	function skip(seconds: number) {
		if (!videoElement) return;
		videoElement.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
	}

	/**
	 * Toggle mute
	 */
	function toggleMute() {
		if (!videoElement) return;
		videoElement.muted = !videoElement.muted;
		isMuted = videoElement.muted;
	}

	/**
	 * Change volume
	 */
	function changeVolume(event: Event) {
		if (!videoElement) return;
		const target = event.target as HTMLInputElement;
		const newVolume = parseFloat(target.value);
		videoElement.volume = newVolume;
		volume = newVolume;
		isMuted = newVolume === 0;
	}

	/**
	 * Change playback speed
	 */
	function changePlaybackRate(rate: number) {
		if (!videoElement) return;
		videoElement.playbackRate = rate;
		playbackRate = rate;
	}

	/**
	 * Toggle fullscreen
	 */
	function toggleFullscreen() {
		if (!videoElement) return;

		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			videoElement.parentElement?.requestFullscreen();
		}
	}

	/**
	 * Keyboard shortcuts
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (!videoElement) return;

		switch (event.key) {
			case ' ':
			case 'k':
				event.preventDefault();
				togglePlay();
				break;
			case 'ArrowLeft':
				event.preventDefault();
				skip(-5);
				break;
			case 'ArrowRight':
				event.preventDefault();
				skip(5);
				break;
			case 'j':
				event.preventDefault();
				skip(-10);
				break;
			case 'l':
				event.preventDefault();
				skip(10);
				break;
			case 'f':
				event.preventDefault();
				toggleFullscreen();
				break;
			case 'm':
				event.preventDefault();
				toggleMute();
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				event.preventDefault();
				videoElement.currentTime = (parseInt(event.key) / 10) * duration;
				break;
		}
	}

</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative w-full bg-black rounded-lg overflow-hidden group aspect-video">
	<!-- Video Element -->
	<video
		bind:this={videoElement}
		bind:currentTime
		bind:duration
		onplay={() => (isPlaying = true)}
		onpause={() => (isPlaying = false)}
		onloadedmetadata={() => (isLoading = false)}
		onwaiting={() => (isLoading = true)}
		oncanplay={() => (isLoading = false)}
		class="w-full h-full"
		{autoplay}
		preload="metadata"
	>
		<!-- The browser automatically handles Range requests -->
		<source src={videoUrl} type="video/mp4" />
		<track kind="captions" />
		Your browser does not support the video tag.
	</video>

	<!-- Loading Spinner -->
	{#if isLoading}
		<div class="absolute inset-0 flex items-center justify-center bg-black/50">
			<div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
		</div>
	{/if}

	<!-- Controls Overlay -->
	<div
		class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
		class:opacity-100={showControls || !isPlaying}
	>
		<!-- Top Bar - Title -->
		<div class="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
			<h3 class="text-white font-semibold text-lg">{lesson.title}</h3>
		</div>

		<!-- Center Play Button -->
		{#if !isPlaying && !isLoading}
			<button
				onclick={togglePlay}
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
			>
				<Play class="w-10 h-10 text-white fill-white ml-1" />
			</button>
		{/if}

		<!-- Bottom Controls -->
		<div class="absolute bottom-0 left-0 right-0 p-4 space-y-2">
			<!-- Progress Bar -->
			<button
				onclick={seek}
				class="w-full h-1.5 bg-white/30 rounded-full cursor-pointer group/progress relative"
			>
				<div class="h-full bg-blue-500 rounded-full transition-all relative" style="width: {progress}%">
					<div
						class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
					></div>
				</div>
			</button>

			<!-- Control Buttons -->
			<div class="flex items-center gap-2">
				<!-- Play/Pause -->
				<Button variant="ghost" size="icon" onclick={togglePlay} class="text-white hover:bg-white/20">
					{#if isPlaying}
						<Pause class="w-5 h-5" />
					{:else}
						<Play class="w-5 h-5" />
					{/if}
				</Button>

				<!-- Skip Back -->
				<Button variant="ghost" size="icon" onclick={() => skip(-10)} class="text-white hover:bg-white/20">
					<SkipBack class="w-4 h-4" />
				</Button>

				<!-- Skip Forward -->
				<Button variant="ghost" size="icon" onclick={() => skip(10)} class="text-white hover:bg-white/20">
					<SkipForward class="w-4 h-4" />
				</Button>

				<!-- Volume -->
				<div class="flex items-center gap-2">
					<Button variant="ghost" size="icon" onclick={toggleMute} class="text-white hover:bg-white/20">
						{#if isMuted || volume === 0}
							<VolumeX class="w-5 h-5" />
						{:else}
							<Volume2 class="w-5 h-5" />
						{/if}
					</Button>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={volume}
						oninput={changeVolume}
						class="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer
               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
               [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
               [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
					/>
				</div>

				<!-- Time -->
				<span class="text-white text-sm font-medium">
					{formattedCurrentTime} / {formattedDuration}
				</span>

				<div class="flex-1"></div>

				<!-- Playback Speed -->
				<div class="relative group/speed">
					<Button variant="ghost" size="sm" class="text-white hover:bg-white/20 text-xs">
						{playbackRate}x
					</Button>
					<div
						class="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 opacity-0 group-hover/speed:opacity-100 transition-opacity pointer-events-none group-hover/speed:pointer-events-auto"
					>
						<div class="flex flex-col gap-1">
							{#each [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as rate}
								<button
									onclick={() => changePlaybackRate(rate)}
									class="px-3 py-1 text-sm text-white hover:bg-white/20 rounded {playbackRate === rate ? 'bg-white/30' : ''}"
								>
									{rate}x
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Fullscreen -->
				<Button variant="ghost" size="icon" onclick={toggleFullscreen} class="text-white hover:bg-white/20">
					<Maximize class="w-5 h-5" />
				</Button>
			</div>
		</div>
	</div>
</div>