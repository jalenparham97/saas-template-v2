import { uploadFile } from "@/lib/s3";
import { createImageUploadUrl } from "@/utils/create-image-upload-url";
import { generateAvatarImage } from "@/utils/generate-avatar-image";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { seed, key } = body as {
    seed: string;
    key: string;
  };

  try {
    const imageBuffer = generateAvatarImage(seed);
    await uploadFile(key, imageBuffer, "image/svg+xml");
    const url = createImageUploadUrl(key);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate avatar" },
      { status: 500 },
    );
  }
}
