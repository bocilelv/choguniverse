// X (Twitter) follow check service
// Saat ini MOCK: selalu return true.
// Ganti isi fungsi ini dengan X API v2 "connection_status" saat siap go-live.
//
// Cara ganti ke real API nanti:
// 1. Pastikan user login X dengan scope tambahan "follows.read"
//    (set di TwitterProvider: authorization params scope).
// 2. Simpan userAccessToken (OAuth 2.0 access token user) saat login.
// 3. Call X API v2:
//    GET https://api.x.com/2/users/by/username/{targetUsername}
//      -> dapat targetUserId
//    GET https://api.x.com/2/users/{me}/following
//      atau lookup connection_status via:
//    GET https://api.x.com/2/users/by/username/{targetUsername}?user.fields=... dengan
//    relationship lookup: GET /2/users/:id/following/:target_id
// 4. Response berisi "data.following: true/false" -> return itu.

export async function checkIfUserFollows(
  targetUsername: string,
  userAccessToken: string
): Promise<boolean> {
  // === MOCK MODE (auto-pass) ===
  // TODO: ganti dengan X API v2 connection_status lookup:
  //   const res = await fetch(`https://api.x.com/2/users/${meId}/following/${targetUserId}`, {
  //     headers: { Authorization: `Bearer ${userAccessToken}` },
  //   })
  //   const data = await res.json()
  //   return !!data?.data?.following
  return true
}
