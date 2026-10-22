import { ImageResponse } from "next/og";
import { SOCIAL_IMAGE_COLORS } from "@/lib/social-image-colors";

export const SOCIAL_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export function createSocialImage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  const colors = SOCIAL_IMAGE_COLORS;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: 46,
        backgroundColor: colors.canvas,
        color: colors.text,
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          border: `1px solid ${colors.line}`,
          padding: "34px 42px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              width: 38,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${colors.accent}`,
              borderRadius: 10,
              color: colors.accent,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            VT
          </div>
          <div style={{ display: "flex", color: colors.muted, fontSize: 17, letterSpacing: 2 }}>
            VIVEK THAKUR <span style={{ margin: "0 10px", color: colors.accent }}>/</span>
            PORTFOLIO
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
          <div
            style={{
              display: "flex",
              marginBottom: 20,
              color: colors.accent,
              fontFamily: "monospace",
              fontSize: 17,
              letterSpacing: 2,
            }}
          >
            {eyebrow.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 32 ? 54 : 72,
              fontWeight: 650,
              letterSpacing: -2.5,
              lineHeight: 1.08,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              color: colors.muted,
              fontSize: 24,
              lineHeight: 1.4,
            }}
          >
            {description.length > 150 ? `${description.slice(0, 147).trimEnd()}…` : description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${colors.line}`,
            paddingTop: 18,
            color: colors.muted,
            fontFamily: "monospace",
            fontSize: 15,
          }}
        >
          <span>FULL-STACK DEVELOPER</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                display: "flex",
                width: 8,
                height: 8,
                borderRadius: 8,
                backgroundColor: colors.accent,
              }}
            />
            PROJECT DOSSIER
          </span>
        </div>
      </div>
    </div>,
    SOCIAL_IMAGE_SIZE,
  );
}
