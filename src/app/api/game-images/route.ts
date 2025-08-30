import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
      return NextResponse.json({ error: "Unsplash API key not configured" }, { status: 500 })
    }

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=cartoon,animals,kids&count=3&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch images from Unsplash")
    }

    const data = await response.json()
    const images = data.map((img: { urls: { small: string } }) => img.urls.small)

    // Create shuffled array with 3 sets of each image (9 total for 3x3 grid)
    const shuffledImages = [...images, ...images, ...images].sort(() => Math.random() - 0.5)

    return NextResponse.json({ images: shuffledImages })
  } catch (error) {
    console.error("Error fetching game images:", error)
    return NextResponse.json({ error: "Failed to fetch game images" }, { status: 500 })
  }
}
