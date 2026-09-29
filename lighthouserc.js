/**
 * Lighthouse CI configuration.
 *
 * Performance budget: the CI job fails when the Lighthouse **mobile** performance
 * score for the built landing page drops below 85 (see .github/workflows/lighthouse.yml).
 *
 * CI reliability notes (NO_FCP fix):
 * - Headless Chrome on CI runners has no GPU and a tiny /dev/shm, which can stop
 *   the renderer from ever producing a first paint — hence the software-rendering
 *   chromeFlags below.
 * - `index.html` loads Google Fonts with a render-blocking stylesheet. If that
 *   third-party request stalls on a runner, nothing paints at all (observed as
 *   NO_FCP at Lighthouse's default 30s FCP timeout). We block those hosts for
 *   hermetic CI runs so first paint never depends on third-party reachability,
 *   and raise maxWaitForFcp/maxWaitForLoad for slow runners.
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
        // Force software rendering: no GPU on CI runners, small /dev/shm.
        chromeFlags: "--no-sandbox --disable-gpu --disable-dev-shm-usage",
        // Generous paint/load windows for slow runners (defaults: 30s / 45s).
        maxWaitForFcp: 60_000,
        maxWaitForLoad: 90_000,
        // Render-blocking third-party fonts: make first paint hermetic in CI.
        blockedUrlPatterns: ["*fonts.googleapis.com*", "*fonts.gstatic.com*"],
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
