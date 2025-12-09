import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { movieId: string } }) {
  const { movieId } = params;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.READ_ACCESS_TOKEN}`,
    },
    next: { revalidate: 3600 } // Revalidate every hour
  };

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Failed to fetch recommendations', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
