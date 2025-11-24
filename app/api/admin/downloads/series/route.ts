import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/configs/firebase-admin";

// Middleware to verify admin token
async function verifyAdminToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const adminUser = await verifyAdminToken(token);
    if (!adminUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { seriesId, title, episodes } = body;

    if (!seriesId || !title || !episodes) {
      return NextResponse.json(
        { message: "Missing required fields: seriesId, title, episodes" },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("series").doc(String(seriesId));
    await docRef.set(
      {
        seriesId,
        title,
        episodes,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    return NextResponse.json(
      { message: "Series download links updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating series downloads:", error);
    return NextResponse.json(
      { message: "Error updating download links" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const adminUser = await verifyAdminToken(token);
    if (!adminUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get("seriesId");

    if (!seriesId) {
      return NextResponse.json(
        { message: "Missing seriesId parameter" },
        { status: 400 }
      );
    }

    await adminDb.collection("series").doc(String(seriesId)).delete();

    return NextResponse.json(
      { message: "Series download links deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting series downloads:", error);
    return NextResponse.json(
      { message: "Error deleting download links" },
      { status: 500 }
    );
  }
}
