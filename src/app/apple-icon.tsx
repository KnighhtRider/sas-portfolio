import { ImageResponse } from "next/og";
import { SOCIAL_IMAGE_COLORS } from "@/lib/social-image-colors";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const colors = SOCIAL_IMAGE_COLORS;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        border: `4px solid ${colors.accent}`,
        borderRadius: 40,
        backgroundColor: colors.canvas,
        color: colors.text,
        fontSize: 76,
        fontWeight: 700,
        letterSpacing: -3,
      }}
    >
      VT
    </div>,
    size,
  );
}
