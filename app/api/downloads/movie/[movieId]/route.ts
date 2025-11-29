import { NextResponse } from "next/server";
import { adminDb } from "@/lib/configs/firebase-admin";

export async function GET(_: any, { params }: { params: any }) {
  try {
    const { movieId } = params;

    // Check if it's a custom movie
    if (String(movieId).startsWith("custom")) {
      const customDocRef = adminDb.collection("customMovies").doc(String(movieId));
      const customDoc = await customDocRef.get();

      if (customDoc.exists) {
        const data = customDoc.data();
        return NextResponse.json({
          links: data?.links || [],
          title: data?.title,
          id: customDoc.id,
        });
      }
    }

    // Try regular movies collection
    const docRef = adminDb.collection("movies").doc(String(movieId));
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { message: "No download links found for this movie" },
        { status: 404 }
      );
    }

    return NextResponse.json(doc.data());
  } catch (error) {
    console.error("Error fetching movie downloads:", error);
    return NextResponse.json(
      { message: "Error fetching download links" },
      { status: 500 }
    );
  }
}
