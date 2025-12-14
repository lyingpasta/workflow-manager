<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import NotificationPan from '$lib/components/notification-pan.svelte';

	let { children } = $props();

	import { notificationStore } from '$lib/stores/notification';
	import { mount, unmount } from 'svelte';
	import { match, P } from 'ts-pattern';

	const mountedNotifications: Map<number, any> = $state.raw(new Map<number, any>());

	$effect(() => {
		if ($notificationStore.length > 0) {
			const lastNotification = $notificationStore[0];
			if (mountedNotifications.get(lastNotification.id)) {
				return;
			}

			const target = document.getElementById('notifications');
			if (target && lastNotification) {
				const mounted = mount(NotificationPan, {
					target,
					props: {
						message: lastNotification.message,
						type: lastNotification.type
					}
				});
				mountedNotifications.set(lastNotification.id, mounted);
			} else {
				console.error('notification not set');
			}
		}
	});

	$effect(() => {
		$notificationStore.map((notification) =>
			match(notification)
				.with({ status: 'expired' }, (mounted) => {
					const instance = mountedNotifications.get(mounted.id);
					return match(instance)
						.with(P.nonNullable, (toUnmount) => {
							unmount(toUnmount, { outro: true });
							notificationStore.remove(mounted.id);
						})
						.otherwise(() => {
							console.info('instance already removed');
						});
				})
				.otherwise(() => {})
		);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div id="main" class="relative w-screen h-screen">
	{@render children()}
	<div id="notifications" class="absolute z-100 top-3 right-5"></div>
</div>

<style>
	#main {
		/* Prioritizes Helvetica Neue or Helvetica, with fallbacks */
		font-family: 'JetBrains Mono', Helvetica, Arial, sans-serif;
	}
</style>
