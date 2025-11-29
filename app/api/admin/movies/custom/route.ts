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
      links,
    } = body;

    // Validate required fields
    if (!title || !overview || !releaseDate || !posterUrl || !links) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: title, overview, releaseDate, posterUrl, links",
        },
        { status: 400 }
      );
    }

    // Generate a unique ID for the custom movie
    const customMovieId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the movie document
    const movieData = {
      id: customMovieId,
      title,
      overview,
      release_date: releaseDate,
      poster_path: posterUrl,
      backdrop_path: backdropUrl || "",
      vote_average: rating || 0,
      isCustom: true,
      links,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Save to Firestore
    await adminDb.collection("customMovies").doc(customMovieId).set(movieData);

    return NextResponse.json(
      {
        message: "Custom movie added successfully",
        movieId: customMovieId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding custom movie:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Error adding custom movie", error: errorMessage },
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

    // Fetch all custom movies
    const snapshot = await adminDb.collection("customMovies").get();
    const customMovies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { customMovies },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching custom movies:", error);
    return NextResponse.json(
      { message: "Error fetching custom movies" },
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

    await adminDb.collection("customMovies").doc(movieId).delete();

    return NextResponse.json(
      { message: "Custom movie deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting custom movie:", error);
    return NextResponse.json(
      { message: "Error deleting custom movie" },
      { status: 500 }
    );
  }
}
