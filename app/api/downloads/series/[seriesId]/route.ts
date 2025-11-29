import { NextResponse } from "next/server";
import { adminDb } from "@/lib/configs/firebase-admin";

export async function GET(_: any, { params }: { params: any }) {
  try {
    const { seriesId } = params;

    // Check if it's a custom series
    if (String(seriesId).startsWith("custom")) {
      const customDocRef = adminDb.collection("customSeries").doc(String(seriesId));
      const customDoc = await customDocRef.get();

      if (customDoc.exists) {
        const data = customDoc.data();
        return NextResponse.json({
          episodes: data?.episodes || [],
          title: data?.title,
          id: customDoc.id,
        });
      }
    }

    // Try regular series collection
    const docRef = adminDb.collection("series").doc(String(seriesId));
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { message: "No download links found for this series" },
        { status: 404 }
      );
    }

    return NextResponse.json(doc.data());
  } catch (error) {
    console.error("Error fetching series downloads:", error);
    return NextResponse.json(
      { message: "Error fetching download links" },
      { status: 500 }
    );
  }
}
