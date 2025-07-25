<script lang="ts">
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
	import { cn } from "$lib/utils.js";
	import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
	import LanguageSwitcher from './language-switcher.svelte'
	import type { HTMLAttributes } from "svelte/elements";
	import { Button } from "$lib/components/ui/button/index";
	import { mode, toggleMode } from "mode-watcher";
	import {
		LogIn,
		SunIcon,
		MoonIcon,
	} from 'lucide-svelte';

	import { onMount } from 'svelte';
	import { translation } from '$lib/stores/internalization-store';
	let currentMode = mode.current;
	$: logoSrc = currentMode === 'dark' ? '/logo-light.png' : '/logo-dark.png';


	onMount(() => {
		const lightLogo = new Image();
		lightLogo.src = "/logo-light.png";

		const darkLogo = new Image();
		darkLogo.src = "/logo-dark.png";
	});

	function handleToggle() {
		toggleMode();
		currentMode = mode.current;

	}

	const components: { title: string; href: string; description: string }[] = [
		{
			title: "Alert Dialog",
			href: "/docs/primitives/alert-dialog",
			description:
				"A modal dialog that interrupts the user with important content and expects a response."
		},
		{
			title: "Hover Card",
			href: "/docs/primitives/hover-card",
			description:
				"For sighted users to preview content available behind a link."
		},
		{
			title: "Progress",
			href: "/docs/primitives/progress",
			description:
				"Displays an indicator showing the completion progress of a task, typically displayed as a progress bar."
		},
		{
			title: "Scroll-area",
			href: "/docs/primitives/scroll-area",
			description: "Visually or semantically separates content."
		},
		{
			title: "Tabs",
			href: "/docs/primitives/tabs",
			description:
				"A set of layered sections of content—known as tab panels—that are displayed one at a time."
		},
		{
			title: "Tooltip",
			href: "/docs/primitives/tooltip",
			description:
				"A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
		}
	];

	type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
		title: string;
		href: string;
		content: string;
	};
</script>



{#snippet ListItem({
										 title,
										 content,
										 href,
										 class: className,
										 ...restProps
									 }: ListItemProps)}

	<li>
		<NavigationMenu.Link>
			{#snippet child()}
				<a
					{href}
					class={cn(
      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
      className
     )}
					{...restProps}
				>
					<div class="text-sm font-medium leading-none">{title}</div>
					<p class="text-muted-foreground line-clamp-2 text-sm leading-snug">
						{content}
					</p>
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

<nav class="flex flex-row justify-between items-center max-w-7xl mx-auto px-4 z-50 relative">
	<div class="content-center">
		{#if currentMode === "dark"}
			<img src="/logo-light.png" alt="Logo" class="h-8 w-auto">
			{:else if currentMode === "light"}
				<img src="/logo-dark.png" alt="Logo" class="h-8 w-auto"/>
			{/if}
	</div>
	<div class="flex flex-wrap items-center">
		<NavigationMenu.Root viewport={false} class="h-15">
			<NavigationMenu.List>

				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href="/" class={navigationMenuTriggerStyle()}>{$translation.nav.home}</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger>{$translation.nav.courses}</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul
							class="grid gap-2 p-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"
						>
							<li class="row-span-3">
								<NavigationMenu.Link
									class="from-primary to-muted bg-linear-to-b outline-hidden flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline focus:shadow-md"
								>
									{#snippet child({ props })}
										<a {...props} href="/">
											<div class="mb-2 mt-4 text-lg font-medium">Amazing</div>
											<p class="text-muted-foreground text-sm leading-tight">
												Beautifully designed components built with Tailwind CSS.
											</p>
										</a>
									{/snippet}
								</NavigationMenu.Link>
							</li>
							{@render ListItem({
								href: "/docs",
								title: "Introduction",
								content:
									"Re-usable components built using Bits UI and Tailwind CSS."
							})}
							{@render ListItem({
								href: "/docs/installation",
								title: "Installation",
								content: "How to install dependencies and structure your app."
							})}
							{@render ListItem({
								href: "/docs/primitives/typography",
								title: "Typography",
								content: "Styles for headings, paragraphs, lists...etc"
							})}
							{@render ListItem({
								href: "/docs/primitives/typography",
								title: "Typography",
								content: "Styles for headings, paragraphs, lists...etc"
							})}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<!--
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>{$translation.nav.courses}</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul
							class="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
						>
							{#each components as component, i (i)}
								{@render ListItem({
									href: component.href,
									title: component.title,
									content: component.description
								})}
							{/each}
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
-->
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>{$translation.nav.about_us}</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[300px] gap-4 p-2">
							<li>
								<NavigationMenu.Link href="/about-us">
									<div class="font-medium">About Us</div>
									<div class="text-muted-foreground">
										Browse all components in the library.
									</div>
								</NavigationMenu.Link>
								<NavigationMenu.Link href="/terms">
									<div class="font-medium">Terms And Conditions</div>
									<div class="text-muted-foreground">
										Review the legal terms that govern your use of our services.
									</div>
								</NavigationMenu.Link>
								<NavigationMenu.Link href="/privacy">
									<div class="font-medium">Privacy</div>
									<div class="text-muted-foreground">
										Understand how we collect, use, and protect your personal data.
									</div>
								</NavigationMenu.Link>
								<NavigationMenu.Link href="/cookies">
									<div class="font-medium">Cookies</div>
									<div class="text-muted-foreground">
										Learn how we use cookies to improve site functionality and personalize your experience.
									</div>
								</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href="/support" class={navigationMenuTriggerStyle()}>{$translation.nav.support}</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href="/admin/users" class={navigationMenuTriggerStyle()}>{$translation.nav.admin}</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<!--
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Admin</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[200px] gap-4 p-2">
							<li>
								<NavigationMenu.Link href="/admin/users">Users</NavigationMenu.Link>
								<NavigationMenu.Link href="#">Documentation</NavigationMenu.Link>
								<NavigationMenu.Link href="#">Blocks</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger>With Icon</NavigationMenu.Trigger>

					<NavigationMenu.Content>
						<ul class="grid w-[200px] gap-4 p-2">
							<li>
								<NavigationMenu.Link href="#" class="flex-row items-center gap-2">
									<CircleHelpIcon />
									Backlog
								</NavigationMenu.Link>

								<NavigationMenu.Link href="#" class="flex-row items-center gap-2">
									<CircleIcon />
									To Do
								</NavigationMenu.Link>

								<NavigationMenu.Link href="#" class="flex-row items-center gap-2">
									<CircleCheckIcon />
									Done
								</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
							-->
			</NavigationMenu.List>

		</NavigationMenu.Root>
	</div>
	<div class="content-center flex flex-row">
		<Button onclick={handleToggle} variant="outline" size="icon">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>

		<LanguageSwitcher />

		<Button variant="outline">
			<LogIn class="h-[1.2rem] w-[1.2rem] rotate-0" />
			<span>{$translation.common.login}</span>
		</Button>
	</div>
</nav>

