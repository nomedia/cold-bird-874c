import { NextRequest, NextResponse } from 'next/server';

// 定义环境变量接口
interface Env {
  USERS_DATA: string;
}

// 默认数据，仅在环境变量不可用时使用
const DEFAULT_USERS_DATA = `
uidvfdekseaskgea#me
vless://b420db6e-7338-49f6-bcb1-c9bf58572d57@144.34.227.17:11148?type=tcp&security=reality&pbk=jtsEpKCgK94SD1v1OPFMR_A9FQg4p5wWK4J0CftmpVQ&fp=chrome&sni=yahoo.com&sid=21fa7274&spx=%2F#Los Angeles
ss://YWVzLTI1Ni1nY206QmpsZlVRb0d6WEp5cnRXS3VYWmg4ZllUWkxsSG9NY0I2R1VTNlNOMFZObz0@tunnel-08301515.666888.biz:25595#Osaka
uidfpengsffegwwe#enpeng
vless://812890d9-00ae-4d76-82ac-d86dff7e9bf5@144.34.227.17:11148?type=tcp&security=reality&pbk=jtsEpKCgK94SD1v1OPFMR_A9FQg4p5wWK4J0CftmpVQ&fp=chrome&sni=yahoo.com&sid=21fa7274&spx=%2F#Los Angeles
uid23sf234sdf33ddf3#baide
vless://66ca1513-e405-4ca1-9b2a-725032010aae@144.34.227.17:11148?type=tcp&security=reality&pbk=jtsEpKCgK94SD1v1OPFMR_A9FQg4p5wWK4J0CftmpVQ&fp=chrome&sni=yahoo.com&sid=21fa7274&spx=%2F#Los Angeles
uidsfs33ff3j4j4jjsa#tt
vless://20ad3035-8d41-4055-9e08-1fc9ff9c9bac@144.34.227.17:11148?type=tcp&security=reality&pbk=jtsEpKCgK94SD1v1OPFMR_A9FQg4p5wWK4J0CftmpVQ&fp=chrome&sni=yahoo.com&sid=21fa7274&spx=%2F#Los Angeles
uid2fd33djfjj3j3jf#jw
vless://566539ec-07f7-4113-b8c3-8448a8548ecb@144.34.227.17:11148?type=tcp&security=reality&pbk=jtsEpKCgK94SD1v1OPFMR_A9FQg4p5wWK4J0CftmpVQ&fp=chrome&sni=yahoo.com&sid=21fa7274&spx=%2F#Los Angeles
uido37mimk6#mengge
vless://a21dcebd-cd4e-4ed3-a77a-3f295269c104@144.34.227.17:11148?type=tcp&security=reality&pbk=jtsEpKCgK94SD1v1OPFMR_A9FQg4p5wWK4J0CftmpVQ&fp=chrome&sni=yahoo.com&sid=21fa7274&spx=%2F#reality-o37mimk6

`;

// 移除 Edge Runtime 配置


const allowedUserAgents = [
  "Shadowrocket",
  "V2rayU",
  "curl",
];

export async function GET(request: NextRequest) {
  // 获取环境变量
  const env = process.env as unknown as Env;
  
  // 从环境变量获取用户数据，如果不存在则使用默认数据
  const usersData = env.USERS_DATA || DEFAULT_USERS_DATA;
  
  // Get the refer parameter from the URL
  const { searchParams } = new URL(request.url);
  const refer = searchParams.get('refer');


  const userAgent = request.headers.get("user-agent") || "";

  // 检查 User-Agent 是否允许访问
  if (!allowedUserAgents.some((ua) => userAgent.includes(ua))) {
    return new NextResponse('Invalid', {
      status: 400,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  
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