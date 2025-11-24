import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/configs/firebase-admin";

// Middleware to verify admin token
async function verifyAdminToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    // You can add custom claims check here for admin role
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
    const { movieId, title, links } = body;

    if (!movieId || !title || !links) {
      return NextResponse.json(
        { message: "Missing required fields: movieId, title, links" },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("movies").doc(String(movieId));
    await docRef.set(
      {
        movieId,
        title,
        links,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    return NextResponse.json(
      { message: "Movie download links updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating movie downloads:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Error updating download links", error: errorMessage },
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
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { message: "Missing movieId parameter" },
        { status: 400 }
      );
    }

    await adminDb.collection("movies").doc(String(movieId)).delete();

    return NextResponse.json(
      { message: "Movie download links deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting movie downloads:", error);
    return NextResponse.json(
      { message: "Error deleting download links" },
      { status: 500 }
    );
  }
}
