import { createSocialImage, SOCIAL_IMAGE_SIZE } from "@/lib/social-image";

export const alt = "Vivek Thakur — Full-Stack Developer portfolio";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createSocialImage({
    eyebrow: "Developer portfolio",
    title: "Vivek Thakur",
    description: "Full-Stack Developer building responsive applications and reusable interfaces.",
  });
}
