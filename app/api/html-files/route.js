// app/api/html-files/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    // Point to the 'public' directory at the root of your project
    const publicDir = path.join(process.cwd(), 'public');

    try {
        const files = fs.readdirSync(publicDir);

        // Filter for .html files and map them to a clean app object
        const htmlFiles = files
            .filter(file => file.endsWith('.html'))
            .map(file => ({
                name: file.replace(/\.html$/, ''), // Remove .html for the display name
                path: `/${file}`, // The URL path to fetch the file
            }));

        return NextResponse.json(htmlFiles);
    } catch (error) {
        console.error('Failed to read public directory:', error);
        return NextResponse.json({ error: 'Failed to load apps' }, { status: 500 });
    }
}