import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const TIERS = {
  SMART_MONEY: {
    name: 'SMART MONEY',
    color: '#00FFA7',
    description: "You don't follow alpha. You ARE the alpha. Wallets are tracking YOU, ser.",
    position: 85,
  },
  WHALE_ADJACENT: {
    name: 'WHALE ADJACENT',
    color: '#00FFA7',
    description: "You swim with whales but you're not one yet. 73% win rate is KOL territory.",
    position: 75,
  },
  DEGEN: {
    name: 'DEGEN',
    color: '#fbbf24',
    description: "50/50 win rate but 100% degen energy. You've aped more rugs than most have trades.",
    position: 40,
  },
  TOURIST: {
    name: 'TOURIST',
    color: '#f97316',
    description: "You buy after the CoinDesk article drops. Your portfolio is a museum of local tops.",
    position: 50,
  },
  EXIT_LIQUIDITY: {
    name: 'EXIT LIQUIDITY',
    color: '#ef4444',
    description: "VCs love you. KOLs love you. You're their exit.",
    position: 55,
  },
  NGMI: {
    name: 'NGMI',
    color: '#ef4444',
    description: "Ser, you bought LUNA at $80, aped SafeMoon, and your best trade was selling early.",
    position: 15,
  },
};

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const tier = searchParams.get('tier')?.toUpperCase() || 'DEGEN';
  const data = TIERS[tier] || TIERS.DEGEN;

  // Calculate YOU marker position
  const youLeft = 100 + (data.position / 100) * 1000;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#0a0a0a',
          padding: '40px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Tier Badge */}
        <div
          style={{
            display: 'flex',
            backgroundColor: data.color,
            padding: '12px 32px',
            borderRadius: '30px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#0a0a0a' }}>
            {data.name}
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            fontSize: '28px',
            color: 'white',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.4,
            marginBottom: '30px',
          }}
        >
          {data.description}
        </div>

        {/* Bell Curve Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
            marginTop: '20px',
          }}
        >
          {/* YOU Marker */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'absolute',
              left: `${youLeft}px`,
              top: '-10px',
              transform: 'translateX(-50%)',
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: data.color,
                padding: '8px 20px',
                borderRadius: '20px',
                marginBottom: '4px',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#0a0a0a' }}>YOU</span>
            </div>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderTop: `12px solid ${data.color}`,
              }}
            />
          </div>

          {/* Bell Curve SVG */}
          <svg width="1100" height="280" viewBox="0 0 1100 280">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00FFA7" />
                <stop offset="25%" stopColor="#a3e635" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="55%" stopColor="#ef4444" />
                <stop offset="60%" stopColor="#f97316" />
                <stop offset="75%" stopColor="#fbbf24" />
                <stop offset="85%" stopColor="#a3e635" />
                <stop offset="100%" stopColor="#00FFA7" />
              </linearGradient>
            </defs>
            <path
              d="M 50 250 C 100 250, 150 245, 230 220 C 330 180, 430 100, 500 60 C 550 30, 570 20, 600 20 C 630 20, 650 30, 700 60 C 770 100, 870 180, 970 220 C 1050 245, 1000 250, 1050 250"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="5"
            />
            <path
              d="M 50 250 C 100 250, 150 245, 230 220 C 330 180, 430 100, 500 60 C 550 30, 570 20, 600 20 C 630 20, 650 30, 700 60 C 770 100, 870 180, 970 220 C 1050 245, 1000 250, 1050 250 L 1050 260 L 50 260 Z"
              fill="url(#grad)"
              opacity="0.2"
            />
          </svg>

          {/* Emojis */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '1000px',
              position: 'absolute',
              bottom: '60px',
            }}
          >
            <span style={{ fontSize: '50px' }}>💀</span>
            <span style={{ fontSize: '45px', marginTop: '-120px' }}>😌</span>
            <span style={{ fontSize: '50px' }}>🤓</span>
          </div>

          {/* Labels */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '1000px',
              marginTop: '10px',
            }}
          >
            <span style={{ fontSize: '18px', color: '#666' }}>NGMI</span>
            <span style={{ fontSize: '18px', color: '#666' }}>Avg</span>
            <span style={{ fontSize: '18px', color: '#666' }}>Smart Money</span>
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '5px',
            backgroundColor: '#00FFA7',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
