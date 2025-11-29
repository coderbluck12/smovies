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
    const {
      title,
      overview,
      releaseDate,
      posterUrl,
      backdropUrl,
      rating,
      totalSeasons,
      episodes,
    } = body;

    // Validate required fields
    if (!title || !overview || !releaseDate || !posterUrl || !episodes) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: title, overview, releaseDate, posterUrl, episodes",
        },
        { status: 400 }
      );
    }

    // Generate a unique ID for the custom series
    const customSeriesId = `custom_series_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the series document
    const seriesData = {
      id: customSeriesId,
      title,
      overview,
      release_date: releaseDate,
      poster_path: posterUrl,
      backdrop_path: backdropUrl || "",
      vote_average: rating || 0,
      total_seasons: totalSeasons || 1,
      isCustom: true,
      episodes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Save to Firestore
    await adminDb.collection("customSeries").doc(customSeriesId).set(seriesData);

    return NextResponse.json(
      {
        message: "Custom series added successfully",
        seriesId: customSeriesId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding custom series:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Error adding custom series", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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

    // Fetch all custom series
    const snapshot = await adminDb.collection("customSeries").get();
    const customSeries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { customSeries },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching custom series:", error);
    return NextResponse.json(
      { message: "Error fetching custom series" },
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

    await adminDb.collection("customSeries").doc(seriesId).delete();

    return NextResponse.json(
      { message: "Custom series deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting custom series:", error);
    return NextResponse.json(
      { message: "Error deleting custom series" },
      { status: 500 }
    );
  }
}
