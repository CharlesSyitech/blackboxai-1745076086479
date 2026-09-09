"use server"

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string }
  | { status: "unconfigured" }

const MAX_LENGTH = 4000

function invalidEmail(value: string) {
  return !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

/**
 * Contact submission.
 *
 * Validation is authoritative on the server. A honeypot field and a minimum
 * fill time filter automated submissions. Delivery goes to CONTACT_WEBHOOK_URL;
 * with no transport configured the form says so plainly rather than pretending
 * the message was sent.
 */
export async function submitContact(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const honeypot = String(formData.get("company_website") ?? "")
  if (honeypot.length > 0) return { status: "success" }

  const startedAt = Number(formData.get("started_at") ?? 0)
  if (startedAt > 0 && Date.now() - startedAt < 2000) {
    return { status: "error", message: "form_too_fast" }
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()
  const profile = String(formData.get("profile") ?? "other")

  if (name.length < 2 || name.length > 200) return { status: "error", message: "name" }
  if (invalidEmail(email)) return { status: "error", message: "email" }
  if (message.length < 10 || message.length > MAX_LENGTH) return { status: "error", message: "message" }

  const endpoint = process.env.CONTACT_WEBHOOK_URL
  if (!endpoint) return { status: "unconfigured" }

  const payload: Record<string, string> = { profile, name, email, message }
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !(key in payload) && key !== "company_website" && key !== "started_at") {
      payload[key] = value.slice(0, 500)
    }
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!response.ok) return { status: "error", message: "delivery" }
    return { status: "success" }
  } catch {
    return { status: "error", message: "delivery" }
  }
}
