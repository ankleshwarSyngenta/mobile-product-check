---
title: Syngenta Product Verification Module – Executive Summary
status: Draft v0.1
owner: Architecture Team
last-updated: 2025-11-14
links:
  - ARCHITECTURE: ./ARCHITECTURE_DESIGN.md
---

# Executive Summary

This document summarizes the design for the Syngenta Product Verification module, aligning your initial design draft with the comprehensive architecture blueprint found in `ARCHITECTURE_DESIGN.md`.

## 1. Purpose

Provide a reusable, lightweight, secure SDK enabling QR / 2D matrix scanning, product identifier decoding, and authenticity verification against Syngenta backend services across React Native (Android/iOS) and React (Web).

## 2. Primary Objectives

- Reusable cross-platform SDK (single monorepo).
- Simple, ergonomic public API (Facade pattern).
- Performance & bundle size optimization (lazy camera, tree-shaking).
- Global rollout (i18n + accessibility).
- Security & integrity (validated input, secure transport, counterfeit detection heuristics).

## 3. Core Features

| Feature               | Description                                            | Notes                                                             |
| --------------------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| Camera Integration    | Activate device camera, scan QR / DataMatrix           | RN: `react-native-vision-camera`; Web: `@yudiel/react-qr-scanner` |
| Code Decoding         | Extract product identifiers, validate format           | Lib options: `jsQR`, `@zxing/library`                             |
| Product Verification  | Secure backend call (Drupal or custom REST)            | Abstract via `BackendPort`                                        |
| UI Feedback           | Authentic / invalid / counterfeit states               | Re-usable UI components per platform                              |
| Error Handling        | Camera access denied, invalid code, network errors     | Unified error codes & mapping                                     |
| Scan Reset            | Allow immediate re-scan                                | Clear internal state                                              |
| Localization          | Multi-language support                                 | `i18next` integration                                             |
| Counterfeit Heuristic | >10 distinct retailer scans in 1 year triggers warning | Domain rule in use case                                           |

## 4. Scenarios

1. Valid Product: Display product metadata; missing fields shown as `NA`.
2. Invalid Product: Show non-Syngenta message; map 13 error codes (0–12).
3. Counterfeit Suspect: Trigger warning if heuristic threshold exceeded.

## 5. Monorepo Overview

```text
/syngenta-verification
  /packages
    /core-sdk        # Facade: scanning + verification orchestration (depends on ports)
    /react-web       # Web presentation layer + camera adapter
    /react-native    # RN presentation layer + camera adapter
    /backend-drupal  # BackendPort implementation (Drupal)
    /backend-custom  # BackendPort implementation (Custom REST)
    /localization    # i18n resource bundles
    /analytics-port  # AnalyticsPort interface (optional implementations external)
    /plugin-sdk      # Hook registry (preVerification/postVerification)
  /apps
    /example-web
    /example-rn
  /docs
    ARCHITECTURE_DESIGN.md
    DESIGN_SUMMARY.md
```

For full package breakdown & extended roadmap see `ARCHITECTURE_DESIGN.md` sections 6, 15, 19.

## 6. Key Design Patterns

- Facade: `ProductVerificationService` main entry.
- Adapter: Platform-specific camera + backend implementations.
- Ports & Adapters (Hexagonal): `BackendPort`, `AnalyticsPort`, `LocalizationPort`.
- Strategy: Multiple code decoding strategies (QR/DataMatrix, future NFC).
- Singleton: Configuration + shared HTTP client (avoid excessive instantiation).
- Plugin Hooks: Pre/Post verification extension.

## 7. Public API (Draft)

```ts
interface Config {
  backend: BackendPort;
  analytics?: AnalyticsPort;
  locale?: string;
  counterfeitThreshold?: number; // e.g. 10
}

interface ProductDetails {
  name: string;
  manufacturer: string;
  marketedBy: string;
  manufacturedOn: string;
  expiryDate: string;
  batchNumber: string;
}

interface ScanResult {
  status: 'success' | 'error' | 'suspect';
  message: string;
  productDetails?: ProductDetails;
  code?: string;
  errorCode?: number; // maps 0–12
}

interface ProductVerificationService {
  initialize(config: Config): void; // idempotent
  scan(): Promise<ScanResult>; // opens camera, decodes, verifies
  resetScan(): void; // clears ephemeral state
}
```

Extended interfaces & ports in architecture doc section 8.

## 8. Backend Integration Strategy

- Abstract via `BackendPort`: permits switching between Drupal & Custom REST without UI changes.
- Recommended MVP: implement Drupal adapter first if endpoints stable; custom REST for performance iteration phase.
- Security: HTTPS + JWT; add request signing if needed; implement retry + exponential backoff + timeout.

## 9. Versioning & Distribution

- Semantic Versioning (MAJOR.MINOR.PATCH).
- GitHub Packages private scope `@syngenta/product-verification`.
- Automated releases: Changesets + GitHub Actions pipeline (build, test, publish, generate changelog).
- Pre-release channels: `beta` / `next` tags.

## 10. Performance & Size Optimization

- Tree-shaking (ESM modules, `sideEffects: false`).
- Lazy-load camera & heavy decoding logic.
- Web: Offload decoding to Web Worker when scanning; avoid blocking UI thread.
- Mobile: Hermes engine, avoid unnecessary native modules.
- Asset optimization (vector icons, minimal images).
- Bundle analysis in CI with size budgets (fail on regression).

## 11. Internationalization (i18n)

- Library: `i18next` + per-locale resource packages.
- Auto locale detection: device / browser fallback chain → `en`.
- Namespaced keys: `verification.success`, `verification.errors.code_0` etc.
- Lazy-load locale resources.

## 12. Security Considerations

- Validate code structure before backend call (length, character set, checksum if applicable).
- Rate limiting / debounce scanning to prevent spam or replay attempts.
- JWT renewal & refresh tokens handled outside core (injected backend adapter).
- Sensitive data only in memory (no persistent storage unless explicitly required for offline roadmap).

## 13. Counterfeit Detection Heuristic

- Maintain per-product scan events with retailer identifier (provided by consumer app).
- Threshold configurable (default 10 per year). On exceed → classify as `suspect` and return warning message/user guidance.
- Future: Replace heuristic with anomaly scoring plugin.

## 14. Future Extensions Roadmap

| Phase | Extension           | Description                                               |
| ----- | ------------------- | --------------------------------------------------------- |
| 2     | NFC support         | Alternate data capture modality                           |
| 2     | Offline cache       | Sync signed authenticity lists for disconnected operation |
| 3     | Loyalty integration | Reward verified scans                                     |
| 3     | Advanced analytics  | Latency + error taxonomy dashboards                       |
| 4     | ML anomaly plugin   | Pattern-based counterfeit detection                       |

See detailed phases in architecture doc section 19.

## 15. Hosting & Injection

Installation:

```bash
npm install @syngenta/product-verification
```

Usage (Web):

```ts
import { createProductVerificationService } from '@syngenta/product-verification';
import { createDrupalBackendAdapter } from '@syngenta/product-verification-backend-drupal';

const service = createProductVerificationService();
service.initialize({ backend: createDrupalBackendAdapter({ baseUrl, token }) });
const result = await service.scan();
```

React Native usage similar with mobile camera adapter.

## 16. Cross-Document Alignment

This summary intentionally omits deep architectural justifications (e.g., ADRs, plugin sandboxing, metrics taxonomy). Those remain in `ARCHITECTURE_DESIGN.md`. Keep both documents synchronized during release planning.

## 17. Immediate Action Checklist

1. Approve API surface (section 7) & result statuses.
2. Confirm backend adapter priority (Drupal vs Custom).
3. Finalize counterfeit threshold default.
4. Scaffold monorepo (Turborepo + pnpm) and initial packages.
5. Implement `BackendPort` + stub adapters.
6. Integrate camera adapters & scanning prototype.
7. Set up CI (lint, test, build, size check, publish dry-run).

## 18. Open Questions

- Source of retailer identifier for counterfeit heuristic? Provided externally or derived?
- Need for offline mode in MVP or defer to Phase 2?
- Do we support DataMatrix beyond QR in initial release?
- Required compliance logging fields for regulated markets?

## 19. Confluence Publishing Notes

- Use this summary as top-level page; link full architecture as child.
- Add labels: `verification`, `sdk`, `architecture`, `mobile`, `web`.
- Embed future diagrams (sequence, component, data flow) from architecture doc.

---

End of Executive Summary.
