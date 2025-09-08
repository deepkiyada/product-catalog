import { NextRequest, NextResponse } from 'next/server';

// Predefined gradient combinations for consistent, attractive placeholders
const gradientCombinations = [
  // Purple gradients
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  
  // Blue gradients
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3'],
  
  // Green gradients
  ['#d299c2', '#fef9d7'],
  ['#89f7fe', '#66a6ff'],
  ['#fdbb2d', '#22c1c3'],
  
  // Orange/Red gradients
  ['#ff9a9e', '#fecfef'],
  ['#ffecd2', '#fcb69f'],
  ['#ff8a80', '#ffab91'],
  
  // Cool gradients
  ['#a18cd1', '#fbc2eb'],
  ['#fad0c4', '#ffd1ff'],
  ['#ffeef4', '#e0c3fc'],
  
  // Professional gradients
  ['#e3ffe7', '#d9e7ff'],
  ['#f6d365', '#fda085'],
  ['#96fbc4', '#f9f586'],
  
  // Modern gradients
  ['#fbc2eb', '#a6c1ee'],
  ['#fdcbf1', '#e6dee9'],
  ['#a1c4fd', '#c2e9fb']
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const width = parseInt(searchParams.get('width') || '400');
    const height = parseInt(searchParams.get('height') || '300');
    const text = searchParams.get('text') || 'Product Image';
    
    // Select a random gradient
    const randomGradient = gradientCombinations[Math.floor(Math.random() * gradientCombinations.length)];
    const [color1, color2] = randomGradient;
    
    // Create SVG with gradient background
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <circle cx="50%" cy="40%" r="30" fill="rgba(255,255,255,0.2)" />
        <circle cx="20%" cy="70%" r="20" fill="rgba(255,255,255,0.1)" />
        <circle cx="80%" cy="20%" r="15" fill="rgba(255,255,255,0.15)" />
        <text x="50%" y="60%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="500" filter="url(#shadow)">
          ${text}
        </text>
        <text x="50%" y="80%" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-size="12">
          Kitchen365
        </text>
      </svg>
    `;
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error generating placeholder image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate placeholder image' },
      { status: 500 }
    );
  }
}
