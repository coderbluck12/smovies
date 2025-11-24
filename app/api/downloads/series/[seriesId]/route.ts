import { NextResponse } from "next/server";
import { adminDb } from "@/lib/configs/firebase-admin";

export async function GET(_: any, { params }: { params: any }) {
  try {
    const { seriesId } = params;

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
