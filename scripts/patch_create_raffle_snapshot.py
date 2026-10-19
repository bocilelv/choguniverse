# Patch create-raffle: snapshot ownership + clean URL
s = open('public/create-raffle.html').read()

if 'const DS' not in s:
    s = s.replace('async function loadMyTokens() {',
"""const DS = location.port === '8901' ? 'http://' + location.hostname + ':8902' : '/api/mapfeed';

async function loadMyTokens() {""")

old = """  if (!state.account) return;
  try {
    const cur = await prov.getBlockNumber();
    const logs = await prov.getLogs({ address: NET.nft, fromBlock: Math.max(0, cur - (NET.key === 'MO' ? 90000 : 60000)), topics: [ethers.utils.id('Transfer(address,address,uint256)')] });
    const owners = {};
    for (const lg of logs) {
      const e = ifaceN.parseLog(lg).args;
      owners[e.tokenId.toString()] = e.to.toLowerCase();
    }
    state.myTokens = Object.entries(owners).filter(([t, o]) => o === state.account.toLowerCase()).map(([t]) => t);"""
new = """  if (!state.account) return;
  try {
    // 1) snapshot dari data server (instan, scan penuh) — RH only
    let owners = {};
    if (NET.key === 'RH') {
      try {
        const snap = await fetch(DS + '/state', { headers: { 'Accept': 'application/json' } }).then(r => r.json());
        if (snap && snap.owners) owners = snap.owners;
      } catch (e) {}
    }
    // 2) fallback RPC window kalau snapshot kosong / network lain
    if (!Object.keys(owners).length) {
      const cur = await prov.getBlockNumber();
      const logs = await prov.getLogs({ address: NET.nft, fromBlock: Math.max(0, cur - (NET.key === 'MO' ? 90000 : 60000)), topics: [ethers.utils.id('Transfer(address,address,uint256)')] });
      for (const lg of logs) {
        const e = ifaceN.parseLog(lg).args;
        owners[e.tokenId.toString()] = e.to.toLowerCase();
      }
    }
    state.myTokens = Object.entries(owners).filter(([t, o]) => o === state.account.toLowerCase()).map(([t]) => t);"""
assert old in s, 'ownership anchor not found'
s = s.replace(old, new)
open('public/create-raffle.html', 'w').write(s)
print('create-raffle patched')

nc = open('next.config.js').read()
old_r = "      { source: '/map', destination: '/map.html' },"
new_r = "      { source: '/map', destination: '/map.html' },\n      { source: '/create-raffle', destination: '/create-raffle.html' },"
assert old_r in nc, 'rewrite anchor'
nc = nc.replace(old_r, new_r)
old_d = "      { source: '/map.html', destination: '/map', permanent: true },"
new_d = "      { source: '/map.html', destination: '/map', permanent: true },\n      { source: '/create-raffle.html', destination: '/create-raffle', permanent: true },"
assert old_d in nc, 'redirect anchor'
nc = nc.replace(old_d, new_d)
open('next.config.js', 'w').write(nc)
print('next.config ok')
