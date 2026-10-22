import { ImageResponse } from "next/og";
import { SOCIAL_IMAGE_COLORS } from "@/lib/social-image-colors";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  const colors = SOCIAL_IMAGE_COLORS;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        border: `2px solid ${colors.accent}`,
        borderRadius: 15,
        backgroundColor: colors.canvas,
        color: colors.text,
        fontSize: 25,
        fontWeight: 700,
        letterSpacing: -1,
      }}
    >
      VT
    </div>,
    size,
  );
}
