import { useState, useEffect } from 'react'
import './index.css'

const TIERS = {
  SMART_MONEY: {
    name: 'SMART MONEY',
    color: '#00FFA7',
    emoji: '5Head',
    description: "You don't follow alpha. You ARE the alpha. Wallets are tracking YOU, ser.",
    curvePosition: 5,
  },
  WHALE_ADJACENT: {
    name: 'WHALE ADJACENT',
    color: '#00FFA7',
    emoji: 'Galaxy Brain',
    description: "You swim with whales but you're not one yet. 73% win rate is KOL territory.",
    curvePosition: 15,
  },
  DEGEN: {
    name: 'DEGEN',
    color: '#fbbf24',
    emoji: 'Degen',
    description: "50/50 win rate but 100% degen energy. You've aped more rugs than most have trades.",
    curvePosition: 35,
  },
  TOURIST: {
    name: 'TOURIST',
    color: '#ef4444',
    emoji: 'NPC',
    description: "You buy after the CoinDesk article drops. Your portfolio is a museum of local tops.",
    curvePosition: 50,
  },
  EXIT_LIQUIDITY: {
    name: 'EXIT LIQUIDITY',
    color: '#ef4444',
    emoji: 'Exit Liquidity',
    description: "VCs love you. KOLs love you. You're their exit.",
    curvePosition: 65,
  },
  NGMI: {
    name: 'NGMI',
    color: '#ef4444',
    emoji: 'NGMI',
    description: "Ser, you bought LUNA at $80, aped SafeMoon, and your best trade was selling early.",
    curvePosition: 85,
  },
}

const LOADING_MESSAGES = [
  "Scanning transactions...",
  "Checking for rug pulls...",
  "Analyzing entry points...",
  "Calculating bag holding duration...",
  "Detecting paper hands moments...",
  "Measuring degen energy levels...",
  "Consulting the blockchain oracles...",
  "Checking if you bought the top...",
  "Evaluating your diamond hands...",
  "Searching for your L's...",
]

const generateMockStats = (tier) => {
  const tierStats = {
    SMART_MONEY: { winRate: 78 + Math.random() * 15, pnl: 450 + Math.random() * 300, trades: 150 + Math.floor(Math.random() * 100), holdTime: '4.2 days', rugs: 2 },
    WHALE_ADJACENT: { winRate: 68 + Math.random() * 10, pnl: 180 + Math.random() * 150, trades: 200 + Math.floor(Math.random() * 150), holdTime: '2.8 days', rugs: 5 },
    DEGEN: { winRate: 45 + Math.random() * 15, pnl: -20 + Math.random() * 80, trades: 500 + Math.floor(Math.random() * 300), holdTime: '6.2 hours', rugs: 23 },
    TOURIST: { winRate: 35 + Math.random() * 15, pnl: -40 + Math.random() * 30, trades: 30 + Math.floor(Math.random() * 40), holdTime: '12.4 days', rugs: 8 },
    EXIT_LIQUIDITY: { winRate: 20 + Math.random() * 15, pnl: -65 + Math.random() * 20, trades: 80 + Math.floor(Math.random() * 60), holdTime: '34.2 days', rugs: 15 },
    NGMI: { winRate: 10 + Math.random() * 15, pnl: -85 + Math.random() * 15, trades: 45 + Math.floor(Math.random() * 30), holdTime: '∞ (still holding)', rugs: 31 },
  }

  const base = tierStats[tier]
  const bestTrades = ['$PEPE +2,400%', '$WIF +1,800%', '$BONK +890%', '$SHIB +340%', '$DOGE +120%', 'ETH +45%']
  const worstTrades = ['$LUNA -99.9%', '$FTT -97%', '$SQUID -100%', '$TITAN -100%', '$ICP -94%', '$SAFE -88%']

  return {
    winRate: base.winRate.toFixed(1),
    pnl: base.pnl.toFixed(1),
    trades: base.trades,
    avgHoldTime: base.holdTime,
    bestTrade: bestTrades[Math.floor(Math.random() * bestTrades.length)],
    worstTrade: worstTrades[Math.floor(Math.random() * worstTrades.length)],
    rugsSurvived: base.rugs,
  }
}

const getRandomTier = () => {
  const tiers = Object.keys(TIERS)
  const weights = [5, 10, 30, 25, 20, 10]
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight

  for (let i = 0; i < tiers.length; i++) {
    random -= weights[i]
    if (random <= 0) return tiers[i]
  }
  return tiers[tiers.length - 1]
}

function WalletInput({ onSubmit, isLoading }) {
  const [wallet, setWallet] = useState('')
  const [error, setError] = useState('')

  const validateWallet = (address) => {
    const evmRegex = /^0x[a-fA-F0-9]{40}$/
    return evmRegex.test(address)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!wallet.trim()) {
      setError('Enter a wallet address, ser')
      return
    }
    if (!validateWallet(wallet)) {
      setError('Invalid EVM address. Must be 0x followed by 40 hex characters')
      return
    }
    setError('')
    onSubmit(wallet)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={wallet}
          onChange={(e) => {
            setWallet(e.target.value)
            setError('')
          }}
          placeholder="0x..."
          disabled={isLoading}
          className="w-full px-6 py-4 bg-[#111111] border-2 border-[#333] rounded-xl text-white text-lg font-mono
                     placeholder-gray-500 focus:outline-none focus:border-[#00FFA7] transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#00FFA7] hover:bg-[#33ffbb]
                     text-black font-bold rounded-lg transition-all duration-300 font-heading
                     disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
        >
          {isLoading ? 'SCANNING...' : 'ANALYZE'}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-red-400 text-sm animate-fade-in">{error}</p>
      )}
    </form>
  )
}

function LoadingScreen({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-[#00FFA7] rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-2 border-4 border-[#00FFA7] rounded-full animate-pulse"></div>
        <div className="absolute inset-4 border-4 border-t-[#00FFA7] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-xl text-[#00FFA7] font-mono loading-dots">{message}</p>
    </div>
  )
}

function BellCurve({ position, tier }) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 mb-4">
      <div className="relative h-64">
        {/* Animated YOU marker */}
        <div
          className="absolute top-0 z-10 animate-marker transition-all duration-1000"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="flex flex-col items-center">
            <div
              className="px-4 py-1.5 rounded-full text-black font-bold text-sm font-heading"
              style={{ backgroundColor: TIERS[tier].color }}
            >
              YOU
            </div>
            <div
              className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent"
              style={{ borderTopColor: TIERS[tier].color }}
            ></div>
          </div>
        </div>

        {/* Bell curve SVG */}
        <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FFA7" />
              <stop offset="20%" stopColor="#00FFA7" />
              <stop offset="35%" stopColor="#a3e635" />
              <stop offset="45%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="55%" stopColor="#ef4444" />
              <stop offset="65%" stopColor="#f97316" />
              <stop offset="75%" stopColor="#fbbf24" />
              <stop offset="85%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#00FFA7" />
            </linearGradient>
          </defs>

          {/* Curve fill for glow effect */}
          <path
            d="M 0 180 C 50 180, 100 175, 150 160 C 200 140, 220 100, 250 40 C 280 100, 300 140, 350 160 C 400 175, 450 180, 500 180 L 500 200 L 0 200 Z"
            fill="url(#curveGradient)"
            opacity="0.15"
          />

          {/* Main curve line */}
          <path
            d="M 0 180 C 50 180, 100 175, 150 160 C 200 140, 220 100, 250 40 C 280 100, 300 140, 350 160 C 400 175, 450 180, 500 180"
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Emoji faces */}
          <text x="60" y="140" textAnchor="middle" fill="white" fontSize="32" fontFamily="Inter, system-ui">B-)</text>
          <text x="250" y="85" textAnchor="middle" fill="white" fontSize="28" fontFamily="Inter, system-ui">:'(</text>
          <text x="440" y="140" textAnchor="middle" fill="white" fontSize="32" fontFamily="Inter, system-ui">:o)</text>
        </svg>

        {/* Labels below curve */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8">
          <span className="text-sm text-gray-400 font-heading">Smart</span>
          <span className="text-sm text-gray-400 font-heading">Average</span>
          <span className="text-sm text-gray-400 font-heading">NGMI</span>
        </div>
      </div>
    </div>
  )
}

function StatsGrid({ stats }) {
  const statItems = [
    { label: 'Win Rate', value: `${stats.winRate}%`, color: parseFloat(stats.winRate) > 50 ? '#00FFA7' : '#ef4444' },
    { label: 'Total PnL', value: `${parseFloat(stats.pnl) >= 0 ? '+' : ''}${stats.pnl}%`, color: parseFloat(stats.pnl) >= 0 ? '#00FFA7' : '#ef4444' },
    { label: 'Total Trades', value: stats.trades, color: '#00FFA7' },
    { label: 'Avg Hold Time', value: stats.avgHoldTime, color: '#fbbf24' },
    { label: 'Best Trade', value: stats.bestTrade, color: '#00FFA7' },
    { label: 'Worst Trade', value: stats.worstTrade, color: '#ef4444' },
    { label: 'Rugs Survived', value: stats.rugsSurvived, color: stats.rugsSurvived > 10 ? '#ef4444' : '#fbbf24' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {statItems.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-[#111111] border border-[#333] rounded-xl p-4 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
          <p className="text-xl font-bold font-mono" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function EmailGate({ onSubmit, onSkip }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.includes('@')) {
      onSubmit(email)
    }
  }

  return (
    <div className="bg-[#111111] border border-[#333] rounded-xl p-6 mt-8 animate-fade-in">
      <h3 className="text-xl font-bold text-[#00FFA7] mb-2 font-heading">Want the full report?</h3>
      <p className="text-gray-400 mb-4">
        Get detailed analysis including your top tokens, best entry/exit times, and personalized tips.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white
                     placeholder-gray-500 focus:outline-none focus:border-[#00FFA7]"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-[#00FFA7] hover:bg-[#00ffb3] text-black font-bold rounded-lg transition-all"
        >
          GET REPORT
        </button>
      </form>
      <button
        onClick={onSkip}
        className="mt-3 text-gray-500 hover:text-gray-300 text-sm underline"
      >
        No thanks, I can't handle the truth
      </button>
    </div>
  )
}

function ShareButton({ tier, wallet, stats }) {
  const handleShare = () => {
    const tierData = TIERS[tier]
    const tierEmojis = {
      SMART_MONEY: '🧠💰',
      WHALE_ADJACENT: '🐋✨',
      DEGEN: '🎰🔥',
      TOURIST: '📸🗺️',
      EXIT_LIQUIDITY: '🚪💸',
      NGMI: '🤡📉',
    }
    const emoji = tierEmojis[tier] || '👀'
    const pnlEmoji = parseFloat(stats.pnl) >= 0 ? '📈' : '📉'

    const tweetText = encodeURIComponent(
      `${emoji} I'm ${tierData.name}\n\n${tierData.description}\n\n${pnlEmoji} PnL: ${parseFloat(stats.pnl) >= 0 ? '+' : ''}${stats.pnl}%\n🎯 Win Rate: ${stats.winRate}%\n💀 Rugs Survived: ${stats.rugsSurvived}\n\nAre you smart money or exit liquidity?`
    )
    const url = encodeURIComponent('https://ingridsia.github.io/am-i-smart-money/')
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`, '_blank')
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 bg-black border-2 border-[#333] hover:border-[#00FFA7]
                 rounded-xl font-bold transition-all duration-300 mt-6"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Share on X
    </button>
  )
}

function Results({ tier, stats, wallet, onReset }) {
  const [showEmailGate, setShowEmailGate] = useState(true)
  const tierData = TIERS[tier]

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      {/* Tier Badge */}
      <div className="text-center mb-8">
        <div
          className="inline-block px-6 py-2 rounded-full text-2xl font-bold mb-4 animate-glow font-heading"
          style={{ backgroundColor: tierData.color, color: '#0a0a0a' }}
        >
          {tierData.name}
        </div>
        <p className="text-xl text-gray-300 max-w-lg mx-auto leading-relaxed">
          {tierData.description}
        </p>
      </div>

      {/* Bell Curve */}
      <BellCurve position={tierData.curvePosition} tier={tier} />

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Email Gate */}
      {showEmailGate && (
        <EmailGate
          onSubmit={(email) => {
            setShowEmailGate(false)
            alert(`Thanks! Full report will be sent to ${email} (jk, this is just a meme)`)
          }}
          onSkip={() => setShowEmailGate(false)}
        />
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <ShareButton tier={tier} wallet={wallet} stats={stats} />
        <button
          onClick={onReset}
          className="px-6 py-3 bg-[#111111] border-2 border-[#333] hover:border-[#00FFA7]
                     rounded-xl font-bold transition-all duration-300"
        >
          Try Another Wallet
        </button>
      </div>
    </div>
  )
}

function App() {
  const [state, setState] = useState('input') // input, loading, results
  const [wallet, setWallet] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0])
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (state !== 'loading') return

    let messageIndex = 0
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[messageIndex])
    }, 800)

    const timeout = setTimeout(() => {
      const tier = getRandomTier()
      const stats = generateMockStats(tier)
      setResult({ tier, stats })
      setState('results')
    }, 4000 + Math.random() * 2000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [state])

  const handleSubmit = (address) => {
    setWallet(address)
    setState('loading')
  }

  const handleReset = () => {
    setState('input')
    setWallet('')
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-heading">
            Am I <span className="text-[#00FFA7]">Smart Money</span>? 🤓
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {state === 'input' && "Paste your wallet address and find out if you're the alpha or the exit liquidity."}
            {state === 'loading' && "Analyzing your on-chain history..."}
            {state === 'results' && `Analysis complete for ${wallet.slice(0, 6)}...${wallet.slice(-4)}`}
          </p>
        </header>

        {/* Main Content */}
        <main>
          {state === 'input' && (
            <WalletInput onSubmit={handleSubmit} isLoading={false} />
          )}

          {state === 'loading' && (
            <LoadingScreen message={loadingMessage} />
          )}

          {state === 'results' && result && (
            <Results
              tier={result.tier}
              stats={result.stats}
              wallet={wallet}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>This is satire. Not financial advice. DYOR. NFA. Probably nothing.</p>
          <p className="mt-2">
            Built with degen energy | <span className="text-[#00FFA7]">Nansen</span> vibes
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
