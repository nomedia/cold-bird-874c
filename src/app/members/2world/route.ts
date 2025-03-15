import { NextRequest, NextResponse } from 'next/server';

// 定义环境变量接口
interface Env {
  USERS_DATA: string;
}

// 默认数据，仅在环境变量不可用时使用
const DEFAULT_USERS_DATA = `
uidvfdekseaskgea#me
ss://YWVzLTI1Ni1nY206Z01iTHl6eUc0TlhCSkZTSkAxNDQuMzQuMTgxLjIwOjMxOTE4#JMS-142053@c36s1.portablesubmarines.com:31918
ss://YWVzLTI1Ni1nY206Z01iTHl6eUc0TlhCSkZTSkA5Ni40NS4xOTAuNTY6MzE5MTg#JMS-142053@c36s2.portablesubmarines.com:31918
vmess://eyJwcyI6IkpNUy0xNDIwNTNAYzM2czMucG9ydGFibGVzdWJtYXJpbmVzLmNvbTozMTkxOCIsInBvcnQiOiIzMTkxOCIsImlkIjoiNDk5ZDczMjktYmI0NS00NDk4LTlhMmMtZTBhNGMzZTMwNTA1IiwiYWlkIjowLCJuZXQiOiJ0Y3AiLCJ0eXBlIjoibm9uZSIsInRscyI6Im5vbmUiLCJhZGQiOiIxOTguMTgxLjM1LjgwIn0
vmess://eyJwcyI6IkpNUy0xNDIwNTNAYzM2czQucG9ydGFibGVzdWJtYXJpbmVzLmNvbTozMTkxOCIsInBvcnQiOiIzMTkxOCIsImlkIjoiNDk5ZDczMjktYmI0NS00NDk4LTlhMmMtZTBhNGMzZTMwNTA1IiwiYWlkIjowLCJuZXQiOiJ0Y3AiLCJ0eXBlIjoibm9uZSIsInRscyI6Im5vbmUiLCJhZGQiOiIxNzguMTU3LjYzLjIxOSJ9
vmess://eyJwcyI6IkpNUy0xNDIwNTNAYzM2czUucG9ydGFibGVzdWJtYXJpbmVzLmNvbTozMTkxOCIsInBvcnQiOiIzMTkxOCIsImlkIjoiNDk5ZDczMjktYmI0NS00NDk4LTlhMmMtZTBhNGMzZTMwNTA1IiwiYWlkIjowLCJuZXQiOiJ0Y3AiLCJ0eXBlIjoibm9uZSIsInRscyI6Im5vbmUiLCJhZGQiOiIxMDQuMTkzLjkuMTIzIn0
vmess://eyJwcyI6IkpNUy0xNDIwNTNAYzM2czgwMS5wb3J0YWJsZXN1Ym1hcmluZXMuY29tOjMxOTE4IiwicG9ydCI6IjMxOTE4IiwiaWQiOiI0OTlkNzMyOS1iYjQ1LTQ0OTgtOWEyYy1lMGE0YzNlMzA1MDUiLCJhaWQiOjAsIm5ldCI6InRjcCIsInR5cGUiOiJub25lIiwidGxzIjoibm9uZSIsImFkZCI6IjIzLjgzLjIyNi4xNzIifQ
uidfpengsffegwwe#enpeng
vless://c2a2fb61-19d4-43e3-a232-4fa14bb7e4a4@144.34.227.17:23896?headerType=none&type=raw&encryption=none&fp=chrome&fp=chrome&pbk=4XOdbVo6bz252ooxwE-g4jrsqpAvWO33zqihemLCp0M&sid=6ba85179e30d4fc2&flow=xtls-rprx-vision&security=reality&alpn=default&sni=cdn-dynmedia-1.microsoft.com
ss://YWVzLTI1Ni1nY206QmpsZlVRb0d6WEp5cnRXS3VYWmg4ZllUWkxsSG9NY0I2R1VTNlNOMFZObz0@tunnel-08301515.666888.biz:25595#JP-tunnel
uid23sf234sdf33ddf3#baide
vless://c2a2fb61-19d4-43e3-a232-4fa14bb7e4a4@144.34.227.17:23896?headerType=none&type=raw&encryption=none&fp=chrome&fp=chrome&pbk=4XOdbVo6bz252ooxwE-g4jrsqpAvWO33zqihemLCp0M&sid=6ba85179e30d4fc2&flow=xtls-rprx-vision&security=reality&alpn=default&sni=cdn-dynmedia-1.microsoft.com
uidsfs33ff3j4j4jjsa#tt
vless://c2a2fb61-19d4-43e3-a232-4fa14bb7e4a4@144.34.227.17:23896?headerType=none&type=raw&encryption=none&fp=chrome&fp=chrome&pbk=4XOdbVo6bz252ooxwE-g4jrsqpAvWO33zqihemLCp0M&sid=6ba85179e30d4fc2&flow=xtls-rprx-vision&security=reality&alpn=default&sni=cdn-dynmedia-1.microsoft.com
uid2fd33djfjj3j3jf#jw
vless://c2a2fb61-19d4-43e3-a232-4fa14bb7e4a4@144.34.227.17:23896?headerType=none&type=raw&encryption=none&fp=chrome&fp=chrome&pbk=4XOdbVo6bz252ooxwE-g4jrsqpAvWO33zqihemLCp0M&sid=6ba85179e30d4fc2&flow=xtls-rprx-vision&security=reality&alpn=default&sni=cdn-dynmedia-1.microsoft.com

`;

// 移除 Edge Runtime 配置

export async function GET(request: NextRequest) {
  // 获取环境变量
  const env = process.env as unknown as Env;
  
  // 从环境变量获取用户数据，如果不存在则使用默认数据
  const usersData = env.USERS_DATA || DEFAULT_USERS_DATA;
  
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

  try {
    // Parse the user data to find the user's subscription addresses
    const lines = usersData.split('\n');
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

        // Join the encoded addresses with newlines for raw text output
    const responseRawText = subscriptionAddresses.join('\n');

    // Base64 encode the subscription addresses
    const encodedAddresses = Buffer.from(responseRawText).toString('base64');
  

    // Join the encoded addresses with newlines for raw text output
    const responseText = encodedAddresses.length > 0 
      ? encodedAddresses
      : 'No subscription addresses found for your user ID.';

    // Return the response as plain text
    return new NextResponse(responseText, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error processing subscription data:', error);
    return new NextResponse('Could not process subscription data. Please try again later.', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
} 