import { ChatLauncher } from "@/components/chat-launcher";
import { getSettings } from "@/lib/content";

/**
 * "Talk to a real person" — server-side gate for the chat launcher.
 *
 * Renders nothing when chat is not configured: the site ships with no floating
 * widget, no dead button, and no invented promise that a human is waiting.
 *
 * **Exactly one floating affordance.** This used to stack a WhatsApp pill above
 * the chat button, giving the corner two competing entry points to two
 * different inboxes — and on the sibling sites the same pattern put a WhatsApp
 * FAB directly on top of Chatwoot's own bubble. Chatwoot is the group's single
 * support channel: it is the one with per-brand inboxes, history and routing.
 * WhatsApp still exists as an in-page link on `/contact` (`org.whatsapp`),
 * which is a deliberate destination rather than a floating overlay.
 */
export async function ChatLauncherGate() {
  const settings = await getSettings();
  const chatwootUrl = settings["chatwoot.base_url"] ?? "";
  const token = settings["chatwoot.token"] ?? process.env.CHATWOOT_WIDGET_TOKEN ?? "";
  const enabled = String(settings["chatwoot.enabled"] ?? "") === "true";
  const label = settings["chatwoot.launcher_label"] ?? "Talk to a real person";

  const chatOn = Boolean(enabled && chatwootUrl && token);
  if (!chatOn) return null;

  return <ChatLauncher chatwootUrl={chatwootUrl} chatwootToken={token} label={label} />;
}