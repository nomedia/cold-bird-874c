import Image from "next/image";
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const refer = searchParams.refer as string;
  
  // Check if refer parameter exists and starts with "uid"
  if (!refer || !refer.startsWith('uid')) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid User ID</h1>
         
        </div>
      </main>
    );
  }

  // Read the users.txt file
  const filePath = path.join(process.cwd(), 'src', 'data', 'users.txt');
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading users.txt file:', error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>Could not read subscription data. Please try again later.</p>
        </div>
      </main>
    );
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
      currentUser = trimmedLine;
      collectingAddresses = currentUser === refer;
    } else if (collectingAddresses) {
      // This is a subscription address for the current user
      subscriptionAddresses.push(trimmedLine);
      
      // Stop collecting if we encounter another user ID
      if (lines.indexOf(line) + 1 < lines.length && lines[lines.indexOf(line) + 1].startsWith('uid')) {
        break;
      }
    }
  }

  // Base64 encode the subscription addresses
  const encodedAddresses = subscriptionAddresses.map(address => {
    // The subscription addresses are already base64 encoded in the format
    // ss://BASE64_ENCODED_STRING@server:port#comment
    // We'll encode the entire string again
    return Buffer.from(address).toString('base64');
  });

  return (
    <>
        {encodedAddresses.length > 0 ? (
          <div className="space-y-4">
            {encodedAddresses.map((encodedAddress, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg">
                <p className="break-all">{encodedAddress}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No subscription addresses found for your user ID.</p>
        )}
    </>
  );
}
