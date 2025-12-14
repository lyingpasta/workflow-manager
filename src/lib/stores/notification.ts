import { writable } from "svelte/store";

type NotificationType = "info" | "error"
type NotificationStatus = "active" | "expired"

export type Notification = {
  id: number,
  type: NotificationType,
  message: string;
  status: NotificationStatus
};

function createNotification() {
  const { subscribe, update } = writable(new Array<Notification>());

  let id = 0;

  return {
    subscribe,
    add: (message: string, type: NotificationType, timeout = 5000) => {
      const notification = { id: id++, type, message, status: "active" as const }
      update((notifications) => [notification, ...notifications])

      setTimeout(() => {
        update(notifications => {
          const idx = notifications.findIndex(n => n.id === notification.id)
          if (idx > -1) {
            notifications[idx].status = "expired"
          }
          return notifications
        })
      }, timeout)
    },
    remove: (id: number) => update(notifications => notifications.filter(notification => notification.id !== id)),
  }
}

export const notificationStore = createNotification()

