# Testing Standards

## Tools

- **Unit / Integration:** Vitest + React Testing Library
- **E2E:** Playwright
- **Mocking:** MSW (Mock Service Worker) for HTTP, vi.mock for modules

## File Locations & Naming

- Unit tests: next to the file under test, `<n>.test.ts(x)`
  ```
  src/components/ui/Button.tsx
  src/components/ui/Button.test.tsx
  ```
- E2E tests: `e2e/` at repo root, `<feature>.spec.ts`
- Test utilities: `test/` at repo root

## What to Test

### Unit (Vitest)

Test:

- All exported functions in `lib/`
- All component prop variations
- All custom hooks
- Edge cases (empty input, null, max length, etc.)
- Error states

Don't test:

- Implementation details (internal state, private methods)
- Third-party library behavior
- Generated code

### E2E (Playwright)

Test ONLY critical user flows:

- Authentication (signup, login, logout, password reset)
- Core conversion flow (signup → first action)
- Payment flows
- Anything that, if broken, would lose money or trust

Don't E2E test:

- Every page renders (use unit tests + visual regression)
- Static content
- Edge cases that unit tests already cover

## Test Structure

Use Arrange-Act-Assert. Be explicit:

```ts
describe("CookieBanner", () => {
  it("dismisses when user clicks Accept All", async () => {
    // Arrange
    const onAccept = vi.fn();
    render(<CookieBanner onAccept={onAccept} onReject={vi.fn()} />);

    // Act
    await userEvent.click(screen.getByRole("button", { name: /accept all/i }));

    // Assert
    expect(onAccept).toHaveBeenCalledOnce();
  });
});
```

## Coverage Targets

- New code in PRs: minimum 80% coverage on changed lines
- Critical paths (auth, payments, data mutations): minimum 95%
- UI components: behavior coverage > line coverage

We use `pnpm test:coverage` to enforce.

## Anti-Patterns

- **Don't snapshot test components.** They break on every change and provide no signal.
- **Don't test framework code.** No tests for "does Next.js render this page".
- **Don't share state between tests.** Each test sets up its own fixtures.
- **Don't use `setTimeout` in tests.** Use `waitFor` from Testing Library.
- **Don't skip flaky tests.** Investigate and fix, or delete and document why.

## Running Tests

```bash
pnpm test                # Run unit tests once
pnpm test --watch        # Watch mode for development
pnpm test:coverage     # With coverage report
pnpm test:e2e           # Run Playwright E2E tests
pnpm test:e2e --ui      # Playwright UI mode for debugging
```

## CI Test Strategy

Pull requests run:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm test:coverage` (must pass coverage threshold)
4. `pnpm build`
5. `pnpm test:e2e` (against the Vercel preview deploy)

If any fails: PR cannot merge.
