# Security Standards

## Secrets & Credentials

- **Never** commit `.env`, `.env.local`, or any file with real secrets.
- **`.env.example`** must be checked in with placeholder values and comments.
- **All env vars** accessed via `process.env.X` and validated with Zod at startup.
- **Production secrets** live ONLY in Vercel environment settings (not in code, not in CI).
- **gitleaks** runs in CI and pre-commit (configured in `.github/workflows/security.yml`).

## Input Validation

- **All user input** validated with Zod schemas before processing.
- **API route handlers** validate request body, query params, and route params.
- **Form submissions** use React Hook Form + Zod resolver.
- **No raw SQL.** Use the ORM (Prisma/Drizzle) or parameterized queries.

## Authentication & Authorization

- **Sessions** via secure HTTP-only cookies, SameSite=Lax minimum.
- **Passwords** hashed with bcrypt or argon2 (never plaintext, never SHA).
- **JWT** if used: short-lived (15 min) access tokens, refresh tokens stored server-side.
- **Authorization checks** at the route handler level, not in the UI.
- **Role-based access** documented in `lib/auth/roles.ts`.

## Data Protection

- **PII handling:** documented in code with `// PII:` comments, never logged.
- **GDPR compliance:** explicit consent for data collection, right-to-delete implemented.
- **TTDSG (German cookie law):** cookie banner before any non-essential cookie.
- **Privacy headers** in `next.config.js`: HSTS, X-Frame-Options, CSP.

## Dependencies

- **Snyk** scans all dependencies on every PR.
- **Dependabot** opens PRs for security updates weekly.
- **No package** with critical or high severity vulnerabilities (Snyk threshold).
- **License check:** no GPL or AGPL packages in production dependencies.

## API Security

- **Rate limiting** on all public endpoints (use Vercel's built-in or Upstash).
- **CORS** configured explicitly, never `*`.
- **CSRF tokens** on state-changing requests.
- **API keys** for third-party services rotated quarterly (track in `docs/secrets-rotation.md`).

## Frontend Security

- **No `dangerouslySetInnerHTML`** without sanitization (use DOMPurify).
- **External links** with `rel="noopener noreferrer"`.
- **CSP** headers configured to block inline scripts (use nonces if needed).
- **`window.postMessage`** with explicit origin checks.

## Logging & Monitoring

- **Never log:** passwords, tokens, full request bodies (may contain PII).
- **Sanitize logs:** strip auth headers, cookies, sensitive query params.
- **Error tracking:** Sentry or similar, with PII filtering enabled.
- **Audit logs** for admin actions: who, what, when.

## Incident Response

- Security finding from Snyk/audit:
  1. Assess severity
  2. If critical: open PR within 24h
  3. If high: PR within 1 week
  4. If medium/low: include in next sprint
- Reported vulnerability:
  1. Acknowledge within 24h
  2. Fix in private, disclose after deploy
  3. Credit reporter if requested
