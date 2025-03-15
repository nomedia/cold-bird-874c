import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  // Get the refer parameter from the URL
  const { searchParams } = new URL(request.url);
  const refer = searchParams.get('refer');
  
  // Check if refer parameter exists and starts with "uid"
  if (!refer || !refer.startsWith('uid')) {
    return new NextResponse('Invalid User ID', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // Read the users.txt file
  const filePath = path.join(process.cwd(), 'src', 'data', 'users.txt');
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading users.txt file:', error);
    return new NextResponse('Could not read subscription data. Please try again later.', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // Parse the file content to find the user's subscription addresses
  const lines = fileContent.split('\n');
  const subscriptionAddresses: string[] = [];
  
  let currentUser = '';
  let collectingAddresses = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    if (trimmedLine.startsWith('uid')) {
      // This is a user ID line
      // Extract the user ID part before any # comment
      const userIdParts = trimmedLine.split('#');
      currentUser = userIdParts[0].trim();
      
      // Check if this user ID matches the refer parameter
      // Also trim the refer parameter in case it has any whitespace
      collectingAddresses = currentUser === refer.trim();
    } else if (collectingAddresses) {
      // This is a subscription address for the current user
      subscriptionAddresses.push(trimmedLine);
      
      // Stop collecting if we encounter another user ID
      if (lines.indexOf(line) + 1 < lines.length && 
          lines[lines.indexOf(line) + 1].trim().startsWith('uid')) {
        break;
      }
    }
  }

  // Base64 encode the subscription addresses
  const encodedAddresses = subscriptionAddresses.map(address => {
    return Buffer.from(address).toString('base64');
  });

  // Join the encoded addresses with newlines for raw text output
  const responseText = encodedAddresses.length > 0 
    ? encodedAddresses.join('\n') 
    : 'No subscription addresses found for your user ID.';

  // Return the response as plain text
  return new NextResponse(responseText, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 