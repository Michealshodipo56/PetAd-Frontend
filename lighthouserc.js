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
