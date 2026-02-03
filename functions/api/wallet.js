// Cloudflare Pages Function - Nansen API Proxy
// This keeps the API key secure on the server side

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return new Response(JSON.stringify({ error: 'Address is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Validate EVM address format
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!evmRegex.test(address)) {
      return new Response(JSON.stringify({ error: 'Invalid EVM address' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Get API key from environment variable
    const apiKey = env.NANSEN_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Fetch wallet labels from Nansen
    const labelsResponse = await fetch('https://api.nansen.ai/api/beta/profiler/address/labels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        parameters: {
          chain: 'ethereum',
          address: address,
        },
        pagination: {
          page: 1,
          recordsPerPage: 100,
        },
      }),
    });

    // Fetch wallet transactions from Nansen (last 90 days)
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const transactionsResponse = await fetch('https://api.nansen.ai/api/v1/profiler/address/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        address: address,
        chain: 'ethereum',
        date: {
          from: ninetyDaysAgo.toISOString(),
          to: now.toISOString(),
        },
        hide_spam_token: true,
        pagination: {
          page: 1,
          per_page: 100,
        },
      }),
    });

    let labels = [];
    let transactions = [];
    let labelsError = null;
    let transactionsError = null;

    if (labelsResponse.ok) {
      const labelsData = await labelsResponse.json();
      labels = labelsData.data || labelsData || [];
    } else {
      labelsError = `Labels API error: ${labelsResponse.status}`;
    }

    if (transactionsResponse.ok) {
      const transactionsData = await transactionsResponse.json();
      transactions = transactionsData.data || [];
    } else {
      transactionsError = `Transactions API error: ${transactionsResponse.status}`;
    }

    // Determine tier based on labels
    const tier = determineTier(labels);

    // Calculate stats from transactions
    const stats = calculateStats(transactions, tier);

    return new Response(JSON.stringify({
      success: true,
      address,
      tier,
      labels,
      stats,
      debug: {
        labelsCount: labels.length,
        transactionsCount: transactions.length,
        labelsError,
        transactionsError,
      },
    }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function determineTier(labels) {
  // Check for Smart Money labels
  const labelNames = labels.map(l => l.label?.toLowerCase() || '');
  const categories = labels.map(l => l.category?.toLowerCase() || '');

  // Smart Money tier checks
  const isSmartMoney = categories.includes('smart_money') ||
    labelNames.some(l => l.includes('smart trader') || l.includes('smart money'));

  const is30DSmartTrader = labelNames.some(l => l.includes('30d smart trader'));
  const is90DSmartTrader = labelNames.some(l => l.includes('90d smart trader'));
  const is180DSmartTrader = labelNames.some(l => l.includes('180d smart trader'));

  const isFund = labelNames.some(l => l.includes('fund') || l.includes('venture'));
  const isWhale = labelNames.some(l => l.includes('whale'));
  const isInfluencer = labelNames.some(l => l.includes('influencer') || l.includes('kol'));

  // Determine tier based on labels
  if (is30DSmartTrader || (isSmartMoney && isFund)) {
    return 'SMART_MONEY';
  }
  if (is90DSmartTrader || is180DSmartTrader || isWhale) {
    return 'WHALE_ADJACENT';
  }
  if (isInfluencer || isSmartMoney) {
    return 'DEGEN';
  }
  if (labels.length > 0) {
    return 'TOURIST';
  }

  // No labels - could be exit liquidity or NGMI
  return 'EXIT_LIQUIDITY';
}

function calculateStats(transactions, tier) {
  // If we have real transaction data, calculate from it
  if (transactions && transactions.length > 0) {
    let totalBuys = 0;
    let totalSells = 0;
    let profitableTrades = 0;
    let totalTrades = transactions.length;

    transactions.forEach(tx => {
      const volumeUsd = tx.volume_usd || 0;
      if (tx.method === 'received' || tx.tokens_received?.length > 0) {
        totalBuys += volumeUsd;
      }
      if (tx.method === 'sent' || tx.tokens_sent?.length > 0) {
        totalSells += volumeUsd;
        if (volumeUsd > 0) profitableTrades++;
      }
    });

    const pnl = totalBuys > 0 ? ((totalSells - totalBuys) / totalBuys * 100) : 0;
    const winRate = totalTrades > 0 ? (profitableTrades / totalTrades * 100) : 50;

    return {
      winRate: Math.min(95, Math.max(5, winRate)).toFixed(1),
      pnl: pnl.toFixed(1),
      trades: totalTrades,
      avgHoldTime: calculateAvgHoldTime(transactions),
      bestTrade: findBestTrade(transactions),
      worstTrade: findWorstTrade(transactions),
      rugsSurvived: Math.floor(Math.random() * 10) + 1,
    };
  }

  // Fallback to tier-based mock stats if no transaction data
  return generateMockStats(tier);
}

function calculateAvgHoldTime(transactions) {
  if (transactions.length < 2) return '??';
  // Simplified - would need more complex logic with token tracking
  const hours = Math.floor(Math.random() * 100) + 1;
  if (hours > 24) {
    return `${(hours / 24).toFixed(1)} days`;
  }
  return `${hours} hours`;
}

function findBestTrade(transactions) {
  const tokens = ['ETH', 'PEPE', 'WIF', 'BONK', 'SHIB', 'ARB', 'OP', 'MATIC'];
  const gains = ['+120%', '+340%', '+890%', '+1,200%', '+2,400%'];
  return `$${tokens[Math.floor(Math.random() * tokens.length)]} ${gains[Math.floor(Math.random() * gains.length)]}`;
}

function findWorstTrade(transactions) {
  const tokens = ['LUNA', 'FTT', 'ICP', 'TITAN', 'SQUID', 'SAFE'];
  const losses = ['-88%', '-94%', '-97%', '-99%', '-100%'];
  return `$${tokens[Math.floor(Math.random() * tokens.length)]} ${losses[Math.floor(Math.random() * losses.length)]}`;
}

function generateMockStats(tier) {
  const tierStats = {
    SMART_MONEY: { winRate: 78 + Math.random() * 15, pnl: 450 + Math.random() * 300, trades: 150 + Math.floor(Math.random() * 100), holdTime: '4.2 days', rugs: 2 },
    WHALE_ADJACENT: { winRate: 68 + Math.random() * 10, pnl: 180 + Math.random() * 150, trades: 200 + Math.floor(Math.random() * 150), holdTime: '2.8 days', rugs: 5 },
    DEGEN: { winRate: 45 + Math.random() * 15, pnl: -20 + Math.random() * 80, trades: 500 + Math.floor(Math.random() * 300), holdTime: '6.2 hours', rugs: 23 },
    TOURIST: { winRate: 35 + Math.random() * 15, pnl: -40 + Math.random() * 30, trades: 30 + Math.floor(Math.random() * 40), holdTime: '12.4 days', rugs: 8 },
    EXIT_LIQUIDITY: { winRate: 20 + Math.random() * 15, pnl: -65 + Math.random() * 20, trades: 80 + Math.floor(Math.random() * 60), holdTime: '34.2 days', rugs: 15 },
    NGMI: { winRate: 10 + Math.random() * 15, pnl: -85 + Math.random() * 15, trades: 45 + Math.floor(Math.random() * 30), holdTime: '??? (still holding)', rugs: 31 },
  };

  const base = tierStats[tier] || tierStats.TOURIST;

  return {
    winRate: base.winRate.toFixed(1),
    pnl: base.pnl.toFixed(1),
    trades: base.trades,
    avgHoldTime: base.holdTime,
    bestTrade: findBestTrade([]),
    worstTrade: findWorstTrade([]),
    rugsSurvived: base.rugs,
  };
}
