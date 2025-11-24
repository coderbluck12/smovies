import { NextResponse } from "next/server";
import { adminDb } from "@/lib/configs/firebase-admin";

export async function GET(_: any, { params }: { params: any }) {
  try {
    const { movieId } = params;

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
