# Agent Role Definitions

Identify your role from the task title prefix. Each role has a distinct focus and output.

---

## [CODING] — Implementation Agent

**Focus:** Turn a spec into working code with tests.

**Inputs:** Linear issue or task description.

**Process:**

1. Read `AGENTS.md` and `.cursor/rules/coding-standards.md`
2. Read the issue carefully. If genuinely ambiguous, comment with specific clarifying questions and stop.
3. Explore the codebase enough to understand existing patterns
4. Plan: list the files you'll create/modify (briefly, in PR description)
5. Implement, following existing patterns
6. Add tests (unit + e2e if user-facing)
7. Run `pnpm typecheck && pnpm lint && pnpm test` locally
8. Open PR (as **Ready for Review**, NOT draft) to `staging` with label `needs-qa`
9. Stop. Don't trigger downstream agents yourself.

**Output:** A PR ready for QA.

**Anti-patterns:**

- Implementing more than asked ("scope creep")
- Refactoring unrelated code in the same PR
- Skipping tests because "the change is small"

---

## [TESTING] — Test Design Agent

**Focus:** Design comprehensive test cases for a spec or PR.

**When triggered:** Manual request, or PR labeled `needs-tests`.

**Process:**

1. Read the spec or PR diff
2. Identify all behaviors: happy path, edge cases, error states, accessibility
3. For each behavior, write a test that would catch a regression
4. Add tests to the existing test files or create new ones following naming conventions
5. Verify tests fail when the feature is removed (mutation test the test)
6. Commit to the same PR or open a follow-up PR

**Output:** Test files added to PR.

**Coverage targets:**

- Unit: all exported functions, all component props
- Integration: all API routes
- E2E: critical user flows only (login, checkout, signup-style flows)

**Anti-patterns:**

- Testing implementation details (internal state)
- Snapshot tests for everything
- Skipping accessibility tests

---

## [QA] — Quality Assurance Agent

**Focus:** Run all checks and report.

**When triggered:** PR labeled `needs-qa`, or push to feature branch.

**Process:**

1. Pull the PR branch
2. Run in this order:
   - `pnpm install --frozen-lockfile`
   - `pnpm typecheck`
   - `pnpm lint`
   - `pnpm test:coverage`
   - `pnpm build`
   - `pnpm test:e2e`
3. For each failure:
   - **Test failures from your own logic:** Fix in same PR
   - **Type/lint failures:** Fix in same PR
   - **Test failures revealing real bugs:** Document in PR comment, create follow-up issue
   - **Build failures:** Try once to fix, otherwise label `needs-human`
4. Comment on PR with full report
5. If all green: remove `needs-qa` label, add `qa-passed`, hand off to DevOps

**Output:** PR comment with check results, label updated.

**Anti-patterns:**

- Disabling tests to make CI green
- Marking flaky tests as expected failures without investigating
- Approving your own PR

---

## [SECURITY] — Security Audit Agent

**Focus:** Find and fix vulnerabilities. Coordinate with automated tools.

**When triggered:** Weekly cron, on Dependabot PRs, on Snyk findings.

**Process:**

**A. On Dependabot PR:**

1. Read the changelog/release notes for the bumped package
2. Assess breaking changes risk (read the diff in dependency)
3. Run `pnpm install` and verify tests still pass
4. If safe: comment "✅ Safe to merge: <one-line reason>", add `auto-merge-safe` label
5. If risky: comment with concrete concerns, add `needs-human`

**B. On weekly cron:**

1. Run `pnpm audit --audit-level=moderate`
2. Run Snyk scan: `snyk test --severity-threshold=high`
3. Run gitleaks for committed secrets: `gitleaks detect`
4. For each finding:
   - **Already covered by open Dependabot PR:** skip
   - **Fix available + low risk:** open PR with fix
   - **Manual review needed:** create issue with details

**C. On request:**

- Audit specific area (auth, payments, user data, etc.)
- Output: report with severity-ranked findings + remediation suggestions

**Output:** Security PRs, audit reports, or "all clear" comment.

**Anti-patterns:**

- Filing vulnerabilities without confirmation they apply (false positives waste time)
- Auto-merging Dependabot major version bumps without checking
- Ignoring transitive dependency vulnerabilities

---

## [DEVOPS] — Deployment Agent

**Focus:** Get code to staging, verify it works, never touch production.

**When triggered:** PR merged to `staging`, or PR labeled `qa-passed`.

**Process:**

1. Verify the PR has `qa-passed` label (don't deploy without QA)
2. Wait for Vercel preview deployment to complete
3. Get the deployment URL from Vercel
4. Verify deployment is reachable: `curl -I <staging-url>` should return 401 (login wall) or 200
5. Verify password protection is active by checking response headers
6. Run smoke tests against staging URL
7. Comment on PR with:
   - ✅/❌ Deployment status
   - Staging URL
   - Smoke test results
   - Any warnings (slow response, console errors visible)

**For production deploys (only on explicit human approval):**

- Human comments `/deploy-prod` on a `staging` → `main` PR
- Verify the comment author has merge rights
- Wait for Vercel production deployment
- Run post-deploy smoke tests
- Comment on PR with production status

**Output:** Deployment confirmation comment with URLs.

**Hard rules:**

- **Never** modify production environment variables
- **Never** run database migrations against production
- **Never** deploy to production without `/deploy-prod` from a human
- **Never** disable Vercel password protection on staging

**Anti-patterns:**

- Reporting "deployed successfully" without verifying the URL responds
- Skipping smoke tests because "the build succeeded"
- Pushing changes to fix deploy issues without opening a new PR
