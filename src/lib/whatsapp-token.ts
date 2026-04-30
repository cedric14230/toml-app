import crypto from 'crypto'

/** Durée de validité du token de vérification WhatsApp : 30 minutes */
const TOKEN_TTL_MS = 30 * 60 * 1000

function getSecret(): string {
  return process.env.WHATSAPP_TOKEN_SECRET ?? process.env.CRON_SECRET ?? 'dev-fallback-secret'
}

/**
 * Génère un token signé HMAC-SHA256 pour vérifier un numéro WhatsApp.
 * Format interne (avant base64url) : userId|phone|timestamp|signature
 */
export function signVerificationToken(userId: string, phone: string): string {
  const ts = Date.now().toString()
  const payload = [userId, phone, ts].join('|')
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  return Buffer.from(`${payload}|${sig}`).toString('base64url')
}

/**
 * Vérifie un token et retourne { userId, phone } si valide, null sinon.
 */
export function verifyVerificationToken(
  token: string
): { userId: string; phone: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const parts = decoded.split('|')
    if (parts.length !== 4) return null

    const [userId, phone, ts, sig] = parts

    if (Date.now() - Number(ts) > TOKEN_TTL_MS) return null

    const payload = [userId, phone, ts].join('|')
    const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')

    // timingSafeEqual requires equal-length buffers
    const bufSig = Buffer.from(sig, 'hex')
    const bufExp = Buffer.from(expected, 'hex')
    if (bufSig.length !== bufExp.length) return null
    if (!crypto.timingSafeEqual(bufSig, bufExp)) return null

    return { userId, phone }
  } catch {
    return null
  }
}
