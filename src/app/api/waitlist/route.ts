import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the waitlist file in the root directory
const WAITLIST_FILE = path.join(process.cwd(), 'waitlist.json');

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // Basic Email Validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: 'Inavlid email address' },
                { status: 400 }
            );
        }

        let waitlist: any[] = [];

        // Read existing file if it exists
        if (fs.existsSync(WAITLIST_FILE)) {
            const fileContent = fs.readFileSync(WAITLIST_FILE, 'utf-8');
            try {
                waitlist = JSON.parse(fileContent);
            } catch (error) {
                // If file is empty or invalid, start with empty array
                waitlist = [];
            }
        }

        // Check for duplicates
        if (waitlist.some((entry: any) => entry.email === email)) {
            return NextResponse.json(
                { message: 'You are already on the waitlist!' },
                { status: 200 }
            );
        }

        // Add new entry
        const newEntry = {
            email,
            date: new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || 'Unknown',
        };

        waitlist.push(newEntry);

        // Save back to file
        fs.writeFileSync(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));

        return NextResponse.json(
            { message: 'Success! You have been added to the waitlist.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Waitlist Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
