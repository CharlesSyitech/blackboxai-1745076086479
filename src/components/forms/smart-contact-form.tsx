"use client"

import { useActionState, useMemo, useState } from "react"
import { submitContact, type ContactState } from "@/app/actions/contact"
import type { Dictionary } from "@/content/dictionaries"
import { site } from "@/content/site"
import { cn } from "@/lib/utils/format"

type ProfileKey = keyof Dictionary["contact"]["profiles"]

/** Extra fields per profile — never more than six inputs on screen at once. */
const extraFields: Record<ProfileKey, { name: string; labelKey: keyof Dictionary["contact"]["fields"] }[]> = {
  company: [
    { name: "organization", labelKey: "organization" },
    { name: "sector", labelKey: "sector" },
    { name: "companySize", labelKey: "companySize" },
  ],
  institution: [
    { name: "organization", labelKey: "organization" },
    { name: "country", labelKey: "country" },
    { name: "role", labelKey: "role" },
  ],
  investor: [
    { name: "organization", labelKey: "organization" },
    { name: "investorType", labelKey: "investorType" },
  ],
  artist: [{ name: "artistName", labelKey: "artistName" }],
  event: [
    { name: "eventType", labelKey: "eventType" },
    { name: "eventDate", labelKey: "eventDate" },
  ],
  technology: [
    { name: "organization", labelKey: "organization" },
    { name: "sector", labelKey: "sector" },
  ],
  media: [
    { name: "outlet", labelKey: "outlet" },
    { name: "deadline", labelKey: "deadline" },
  ],
  candidate: [{ name: "position", labelKey: "position" }],
  other: [],
}

const initialState: ContactState = { status: "idle" }

export function SmartContactForm({ t, locale }: { t: Dictionary; locale: "fr" | "en" }) {
  const [profile, setProfile] = useState<ProfileKey>("company")
  const [state, formAction, pending] = useActionState(submitContact, initialState)
  const startedAt = useMemo(() => Date.now(), [])
  const fields = extraFields[profile]

  const errorMessages: Record<string, string> = {
    name: locale === "fr" ? "Indiquez votre nom." : "Please enter your name.",
    email: locale === "fr" ? "Cette adresse e-mail n'est pas valide." : "This email address is not valid.",
    message:
      locale === "fr"
        ? "Votre message doit contenir au moins dix caractères."
        : "Your message must contain at least ten characters.",
    delivery:
      locale === "fr"
        ? "L'envoi a échoué. Écrivez-nous directement par e-mail."
        : "Sending failed. Please email us directly.",
    form_too_fast: locale === "fr" ? "Merci de réessayer." : "Please try again.",
  }

  return (
    <div className="flex flex-col gap-10">
      <fieldset className="flex flex-col gap-4">
        <legend className="type-overline mb-3 text-faint">{t.contact.title}</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(t.contact.profiles) as ProfileKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setProfile(key)}
              aria-pressed={profile === key}
              className={cn(
                "min-h-11 rounded-md border px-4 text-sm transition-colors",
                profile === key
                  ? "border-line-strong bg-brand-soft text-ink"
                  : "border-line text-muted hover:text-ink",
              )}
            >
              {t.contact.profiles[key]}
            </button>
          ))}
        </div>
      </fieldset>

      {state.status === "success" ? (
        <p role="status" className="rounded-md border border-ok px-5 py-4 text-sm">
          {locale === "fr"
            ? "Message envoyé. Nous revenons vers vous rapidement."
            : "Message sent. We will get back to you shortly."}
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-6" noValidate>
          <input type="hidden" name="profile" value={profile} />
          <input type="hidden" name="started_at" value={startedAt} />
          <div aria-hidden="true" className="absolute left-[-9999px]">
            <label htmlFor="company_website">Website</label>
            <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field id="name" name="name" label={t.contact.fields.name} required />
            <Field id="email" name="email" type="email" label={t.contact.fields.email} required />
            {fields.map((field) => (
              <Field
                key={field.name}
                id={field.name}
                name={field.name}
                label={t.contact.fields[field.labelKey]}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              {t.contact.fields.message}{" "}
              <span className="text-faint">({t.contact.fields.required})</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className="w-full rounded-md border border-line bg-page px-4 py-3 text-[0.95rem] outline-none transition-colors focus:border-line-strong"
            />
            {profile === "company" ? <p className="text-sm text-muted">{t.contact.demoNote}</p> : null}
          </div>

          {state.status === "error" ? (
            <p role="alert" className="rounded-md border border-danger px-5 py-4 text-sm text-danger">
              {errorMessages[state.message] ?? errorMessages.delivery}
            </p>
          ) : null}

          {state.status === "unconfigured" ? (
            <p role="alert" className="rounded-md border border-warn px-5 py-4 text-sm">
              {locale === "fr"
                ? "L'acheminement des formulaires n'est pas encore configuré sur cet environnement. Écrivez-nous à "
                : "Form delivery is not yet configured on this environment. Please email us at "}
              <a href={`mailto:${site.contact.email}`} className="link-underline">
                {site.contact.email}
              </a>
              .
            </p>
          ) : null}

          <div className="flex flex-col items-start gap-4">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-6 font-medium text-ink-900 transition-colors hover:bg-amber-600 disabled:opacity-60"
              aria-busy={pending}
            >
              {t.contact.submit}
            </button>
            <p className="max-w-xl text-xs leading-relaxed text-faint">{t.contact.privacy}</p>
          </div>
        </form>
      )}
    </div>
  )
}

function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
}: {
  id: string
  name: string
  label: string
  type?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? <span className="text-faint"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="min-h-11 w-full rounded-md border border-line bg-page px-4 text-[0.95rem] outline-none transition-colors focus:border-line-strong"
      />
    </div>
  )
}
