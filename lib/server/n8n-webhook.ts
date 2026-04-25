export type N8nWebhookResult =
  | { sent: true; reason: null }
  | {
      sent: false
      reason: 'missing_config' | 'request_failed' | 'http_error'
      statusCode?: number
    }

type N8nEvent = 'lead_captured' | 'contact_request_submitted'

export async function sendN8nWebhook(
  event: N8nEvent,
  payload: Record<string, unknown>,
): Promise<N8nWebhookResult> {
  const url = process.env.N8N_WEBHOOK_URL
  const secret = process.env.N8N_WEBHOOK_SECRET

  if (!url) {
    return { sent: false, reason: 'missing_config' }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'x-webhook-secret': secret } : {}),
      },
      body: JSON.stringify({
        event,
        occurredAt: new Date().toISOString(),
        payload,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error(`[n8n] webhook returned ${response.status} for event ${event}`)
      return {
        sent: false,
        reason: 'http_error',
        statusCode: response.status,
      }
    }

    return { sent: true, reason: null }
  } catch (error) {
    console.error(`[n8n] webhook request failed for event ${event}:`, error)
    return { sent: false, reason: 'request_failed' }
  } finally {
    clearTimeout(timeoutId)
  }
}
