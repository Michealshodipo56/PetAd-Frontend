/**
 * Lighthouse CI configuration.
 *
 * Performance budget: the CI job fails when the Lighthouse **mobile** performance
 * score for the built landing page drops below 85 (see .github/workflows/lighthouse.yml).
 *
 * NOTE: this package is `"type": "module"`, but LHCI loads rc files with `require()`.
 * The named `ci` export (mirrored by the default export) is what surfaces the config
 * at the top level for LHCI's loader — keep both exports in place.
 */
const config = {
  ci: {
    collect: {
      staticDistDir: "dist",
      url: ["http://localhost/"],
      numberOfRuns: 1,
      settings: {
        // Headless Chrome on CI runners frequently fails with NO_FCP (no first
        // contentful paint) because there is no GPU and /dev/shm is tiny.
        // Force software rendering so the page paints reliably in CI.
        chromeFlags: "--no-sandbox --disable-gpu --disable-dev-shm-usage",
        // Give the app a generous window to reach first paint before the run
        // is considered done (default 45s; CI runners can be slow).
        maxWaitForLoad: 60_000,
      },
    },
    assert: {
      assertions: {
        // Fail CI if the mobile performance score falls below the agreed budget of 85.
        "categories:performance": ["error", { minScore: 0.85 }],
      },
    },
  },
};

export const ci = config.ci;
export default config;
