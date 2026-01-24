
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const token = searchParams.get('token');

    if (!url || !token) {
        return NextResponse.json({ error: 'Missing url or token parameter' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': token,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `API responded with status ${response.status}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
