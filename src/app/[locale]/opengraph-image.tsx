import { ImageResponse } from "next/og"
import { site } from "@/content/site"
import { isLocale } from "@/lib/i18n/routes"

export const alt = "Syitech Group — Technology. Ecosystems. Impact."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Shared social card for every page under [locale]. Uses the ink surface and
 * amber accent of the design system, with no external font fetch so the build
 * stays self-contained.
 */
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const resolved = isLocale(locale) ? locale : "fr"

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060B14",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#E39A2B" }} />
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.14em",
            }}
          >
            SYITECH GROUP
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span style={{ color: "#FFFFFF", fontSize: 62, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {resolved === "fr"
              ? "Nous construisons les technologies qui transforment les économies."
              : "We build the technologies that transform economies."}
          </span>
          <span style={{ color: "#E39A2B", fontSize: 24, letterSpacing: "0.12em" }}>
            {site.signature.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", gap: 18, color: "#7C9FD1", fontSize: 20 }}>
          <span>Enterprise</span>
          <span>·</span>
          <span>CultTech</span>
          <span>·</span>
          <span>FinTech</span>
          <span>·</span>
          <span>EventTech</span>
          <span>·</span>
          <span>Hardware &amp; IoT</span>
          <span>·</span>
          <span>AI &amp; Data</span>
        </div>
      </div>
    ),
    size,
  )
}
