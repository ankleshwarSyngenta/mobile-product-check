---
title: Mobile Product Check Monorepo Architecture & Design
status: Draft v0.1
owner: Architecture Team
last-updated: 2025-11-14
---

# Mobile Product Check Monorepo Architecture & Design

## 1. Overview

The Mobile Product Check initiative will provide a shared, extensible SDK and UI component set for:

1. React Native (Android & iOS) applications.
2. React (Web) applications.

Primary focus: unified product scanning & verification experience, consistent localization, secure backend communication, easy future extension (e.g., additional verification modalities, offline caching, analytics, ML-based enhancements).

## 2. Goals

- Single monorepo hosting platform-agnostic core logic and platform-specialized adapters.
- Clean separation of domain logic from delivery/UI layers (Hexagonal Architecture / Ports & Adapters).
- High reusability + minimal duplication between Web and Mobile.
- Simple consumption for internal product teams (install scoped packages from company GitHub Packages registry).
- Predictable versioning & automated release pipeline (semantic versioning, changesets, CI/CD).
- Size optimization for bundle (tree-shaking, code splitting, minimal native modules).
- Pluggable backend integration supporting Drupal API or custom REST service behind a stable domain port.
- Strong extensibility: plugin system, theming, localization, analytics hooks.

## 3. Non-Goals

- Building a full backend now (we abstract backend; implementation decision deferred).
- Implementing advanced ML or computer vision beyond MVP scanning logic.
- Public open-source distribution (internal packages only at this stage).

## 4. High-Level Requirements

Functional:

- Decode multiple product codes (EAN/UPC/QR/DataMatrix where possible).
- Call backend to verify product authenticity & retrieve metadata.
- Provide consistent UI components (scanner view, result card, error states).
- Support localization & accessible UI.

Non-Functional:

- Fast cold start (< 2s RN, < 1s Web interactive target for core bundle).
- Secure transport (HTTPS/TLS + optional request signatures).
- Observability (logging, event bus, analytics hooks).
- Extensible with minimal breaking changes.

## 5. Proposed Monorepo Stack

- Package manager: `pnpm` (fast, disk-efficient, workspace support).
- Monorepo orchestrator: Turborepo (simple pipeline config, remote caching). Nx is a viable alternative; Turborepo chosen for lighter weight + existing JS ecosystem alignment.
- Language: TypeScript (strict mode, project references for boundary enforcement).
- Build / Bundling:
  - Libraries: `tsup` or `rollup` (ESM + CJS output, type declarations).
  - React Native code: Metro bundler (advanced config + Hermes engine enabled).
  - Web apps consuming SDK: Vite/Webpack optimized with tree-shaking.
- Linting: ESLint (workspace root config + boundary rules).
- Formatting: Prettier.
- Testing: Jest + React Testing Library + Detox (future for RN E2E) / Playwright (future for Web integration tests).
- Release: Changesets + GitHub Actions.
- Package registry: GitHub Packages (private scope `@company/mobile-product-check-*`).

## 6. Monorepo Package Layout

```text
mobile-product-check/
  packages/
    core-domain/          # Pure domain logic: entities, value objects, use cases (verifyProduct, decodeCode, etc.)
    core-utils/           # Cross-cutting utilities (logging facade, error types, result mappers)
    infra-http/           # Adapters: HTTP client, auth, retries, caching, backend port implementations
    infra-backend-drupal/ # Optional adapter implementing BackendPort via Drupal REST
    infra-backend-custom/ # Optional adapter implementing BackendPort via custom REST API
    scanning-engine/      # Code decoding logic; platform neutral (where feasible). Thin native wrappers in rn-web packages
    localization/         # i18n message catalogs, fallback strategy
    ui-react/             # Web-specific UI components (ScannerContainer, ProductCard, Hooks)
    ui-react-native/      # RN-specific UI components (RNScannerView, ProductDetailSheet)
    theming/              # Shared design tokens, theming system
    analytics-port/       # Defines AnalyticsPort + event contracts; no implementation
    plugin-sdk/           # Interfaces & registration for plugins (e.g., extra validation steps)
    cli-tools/            # Internal CLI (scaffold consumer app integration, validate config)

  apps/
    example-web/          # Web demo consuming ui-react + core packages
    example-rn/           # RN demo consuming ui-react-native + core packages

  tooling/
    tsconfig.base.json
    turbo.json
    .github/workflows/
    changeset/            # Release config
```

## 7. Architecture Style

Hexagonal (Ports & Adapters) layered over Domain-Driven principles.

Layers & Responsibilities:

1. Domain Layer (core-domain): business rules, invariants, use case orchestrators.
2. Application Layer: simple orchestrations invoking domain use cases (could live in core-domain or separate if grows).
3. Infrastructure Layer (infra-\* packages): external systems (HTTP, backend APIs, storage, analytics) implementing Ports.
4. Presentation Layer (ui-react, ui-react-native): UI components & platform-specific interaction patterns.

Data Flow (Verify Product):

UI Component → Use Case (verifyProduct) → BackendPort.verify(code) → HTTP Adapter → Backend Response → Mapper → Domain Result → UI Rendering.

Event Flow:

Use cases emit domain events (e.g., ProductVerified, ProductVerificationFailed) → AnalyticsPort / Plugin registry notified → Consumers attach handlers.

## 8. Key Ports (TypeScript Interfaces)

```ts
// BackendPort.ts
export interface BackendPort {
  verifyProduct(input: { code: string; type: CodeType }): Promise<VerificationResult>;
  fetchMetadata(productId: string): Promise<ProductMetadata>;
}

// AnalyticsPort.ts
export interface AnalyticsPort {
  track(event: AnalyticsEvent): void;
}

// LocalizationPort.ts
export interface LocalizationPort {
  t(key: string, params?: Record<string, string>): string;
}
```

Adapters implement these ports; UI never imports adapter concretes—only factories or dependency injection tokens.

## 9. Core Design Patterns

- Hexagonal Architecture (Ports & Adapters) – isolation & testability.
- Strategy – swappable code decoding strategies per code type.
- Adapter – backend variations (Drupal vs Custom REST).
- Facade – unified ProductVerificationService combining decode + verify flows.
- Dependency Injection (manual lightweight factory) – pass ports to services.
- Observer / Event Bus – internal domain events enabling analytics & plugins.
- Plugin Registry – dynamic extension (register pre-verification or post-verification hooks).

## 10. Backend Integration Options

Option A: Drupal API (Headless CMS / existing data)

Pros: Leverages existing content & workflows; rapid start if endpoints exist.
Cons: Potential performance limits; customization friction; version coupling.

Option B: Custom REST Service

Pros: Tailored performance, clearer contract, easier domain evolution.
Cons: Higher upfront build & maintenance cost.

Decision Approach:

- Start with abstraction: implement BackendPort for both; pick initial adapter based on available endpoints & latency tests.
- If Drupal response formats are verbose: create mapping layer to lean domain DTOs.
- Revisit after MVP usage metrics (Phase 2) to decide primary path.

## 11. HTTP & Auth

- HTTP Client: `fetch` wrapped with retry (exponential backoff), cancellation, and circuit breaker (open after N failures, half-open probe).
- Auth: Token injection via config provider (supports OAuth2/JWT); secrets never hard-coded.
- Security Enhancements: Optional request signing, pinned domains & TLS; input validation on responses.

## 12. Publishing & Consumption

Registry: GitHub Packages (private scope).

Package Names (examples):

- `@company/mobile-product-check-core-domain`
- `@company/mobile-product-check-ui-react`
- `@company/mobile-product-check-ui-react-native`

Consumption (Web app):

```ini
# .npmrc
@company:registry=https://npm.pkg.github.com
# Acquire token via GitHub PAT with read:packages
```

```bash
pnpm add @company/mobile-product-check-product-verification-service
```

Consumption (React Native app): identical `.npmrc` + install.

Injecting Package:

```ts
import { createProductVerificationService } from '@company/mobile-product-check-product-verification-service';
import { createDrupalBackendAdapter } from '@company/mobile-product-check-infra-backend-drupal';

const service = createProductVerificationService({ backend: createDrupalBackendAdapter(config) });
```

## 13. Versioning & Release Strategy

- Semantic Versioning (semver): MAJOR.MINOR.PATCH.
- Changesets: developer adds changeset markdown describing impact; CI composes release.
- Automated Workflow:
  1. On merge to `main` (or `stable`): build, test, publish packages.
  2. Tag creation (`vX.Y.Z`) triggers Release Notes generation.
- Pre-Release Channels: `next`, `beta` branches can publish suffixed versions (`1.2.0-beta.3`).
- Dependency Synchronization: internal packages pinned via workspace protocol; external consumers specify ranges for non-breaking MINOR upgrades.

## 14. Size Optimization

General:

- ESM first builds + `sideEffects: false` for pure modules.
- Strict tree-shaking through Rollup/tsup configuration.
- Avoid large polyfills; target modern browsers/mobile JS engines.
- Keep scanning logic modular—only import needed code types.

Web Specific:

- Dynamic imports for heavy optional components (e.g., advanced result analytics panel).
- Code splitting via Vite; leverage HTTP/2 multiplexing.
- Use bundle analyzer in CI; enforce size budgets.
- Defer non-critical localization bundles (load on language switch).

React Native Specific:

- Hermes engine for faster start & reduced memory.
- JSI native bindings only where necessary; prefer pure JS for portability.
- Metro config: blacklist unused locales/assets.
- Asset optimization: WebP images, vector icons.
- Minimize native dependencies (reduce linking overhead).

Caching & Performance:

- Memoize verification results for repeated scans (LRU cache in infra layer).
- Stagger network calls (debounce scanning verification to avoid bursts).
- Preload configuration & localization during splash screen.

## 15. Extensibility Roadmap

Near-Term (Phase 2):

- Plugin hook: preVerification (mutate input), postVerification (augment result).
- Theming extensibility (custom tokens injection).
- Enhanced analytics events (latency, error taxonomy).

Mid-Term (Phase 3):

- Offline verification fallback (signature list cache).
- ML-based anomaly detection plugin.
- Multi-backend failover strategy (primary custom REST, secondary Drupal).

Long-Term:

- Federation with other company SDKs (shared event bus standard).
- Config-driven feature flags.

## 16. Security & Compliance

- Input validation on all backend responses (schema via Zod or custom validator).
- Sanitization: guard against code injection in product metadata.
- Secret management: tokens provided via native secure storage (RN) / environment variables injection (Web build).
- Logging: omit PII; central redaction.
- Transport: enforce HTTPS; optional pinned certificates.

## 17. Observability & Monitoring

- Unified logger facade with levels; adapters route to mobile native logs or browser console/devtools.
- AnalyticsPort allows injection of Segment, Firebase, or in-house system.
- Metrics: time to verification, scan success ratio, average backend latency, error rate by code type.

## 18. Testing Strategy

- Unit: Domain use cases (Jest).
- Integration: Port + Adapter combos with mock servers.
- Contract: Schemas for backend responses validated in CI.
- E2E: Example apps exercise scanning flow; RN (Detox), Web (Playwright) later.
- Performance: Synthetic tests measuring verification latency across network conditions.

## 19. Implementation Phases

Phase 0 (Foundation): Monorepo scaffolding, core-domain, infra-http stub, basic backend port interface.
Phase 1 (MVP): Drupal adapter OR stub custom adapter, scanning-engine initial code types, ui-react-native & ui-react minimal scanner component, release pipeline.
Phase 2 (Hardening): AnalyticsPort, plugin-sdk, size optimization pass, caching strategy, thorough tests.
Phase 3 (Enhancement): Dual backend adapter selection, offline cache, advanced theming, E2E test automation.
Phase 4 (Expansion): ML plugin, federation features, feature flags & config CLI.

## 20. Risks & Mitigations

- Risk: Backend abstraction drift if Drupal + custom diverge drastically. Mitigation: strict domain DTO mapping layer.
- Risk: Bundle size creep. Mitigation: CI size budget & analyzer.
- Risk: Over-engineering early. Mitigation: Phase gating; minimal interfaces at MVP.
- Risk: Auth complexity differences between backends. Mitigation: discrete Auth strategy interface separate from BackendPort.
- Risk: Plugin system abuse causing instability. Mitigation: plugin sandbox & validation.

## 21. Decision Records (ADR Format – examples)

ADR-001: Monorepo tooling = Turborepo over Nx (simplicity, team familiarity).
ADR-002: Ports & Adapters chosen for backend flexibility.
ADR-003: GitHub Packages for internal distribution (integrated with company SSO & existing infra).

## 22. Confluence Migration Notes

- Use same section numbering for internal discoverability.
- Add page labels: `architecture`, `mobile`, `web`, `sdk`, `product-check`.
- Embed sequence diagram (PlantUML) for verification flow (future addition).

## 23. Future Diagrams (Placeholder)

Sequence (Verify Product):
User → UI Component → VerificationService → BackendPort → HTTP Adapter → Backend API → Adapter → VerificationService → UI.

Component Diagram: Show separation of packages & ports.

## 24. Open Questions

- Which backend adapter to prioritize first (Drupal vs Custom)?
- Preferred analytics provider for initial release?
- Do we enforce strict code type support list or allow dynamic plugin addition?

## 25. Next Immediate Actions

1. Confirm Turborepo + pnpm choice.
2. Approve package naming convention & scope.
3. Finalize initial backend adapter target.
4. Scaffold repository structure & CI skeleton.

## 26. Appendix

Glossary:

- Port: Interface representing an external system capability.
- Adapter: Concrete implementation of a Port.
- DTO: Data Transfer Object mapping external data to domain model.

Coding Conventions:

- Strict TypeScript (`"strict": true`).
- No dynamic `any`; prefer narrow types.
- Domain objects are immutable (no direct property mutation).

Performance Budget Targets:

- RN cold start incremental increase < 100KB from SDK.
- Web initial JS < 120KB gzipped for mandatory core + scanning.

End of Document.

## 27. Requirements Traceability (JIRA Ticket Alignment)

| JIRA Requirement                                                                                    | Architectural Mapping                                                      | Package / Layer                        | Notes / Design References                                                |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| Module Packaging (NPM, docs, versioning)                                                            | Sections 12, 13                                                            | All packages + CI                      | Uses GitHub Packages + Changesets; summary in DESIGN_SUMMARY.md          |
| Camera Integration (activate device camera)                                                         | Sections 6 (Package Layout), 7 (Architecture Style)                        | `ui-react-native`, `react-web` adapter | RN: vision-camera; Web: qr-scanner; exposed via Facade `scan()`          |
| Fallback for no camera access                                                                       | Section 18 (Testing), 14 (Size Optimization - platform specifics)          | Presentation layer + core-domain       | Needs explicit error code + localized message (Gap: define message keys) |
| Code Decoding (extract identifiers)                                                                 | Sections 6 (scanning-engine), 9 (Patterns: Strategy)                       | `scanning-engine`                      | Strategy pattern per code type (QR/DataMatrix)                           |
| Validate format/integrity                                                                           | Sections 9 (Patterns), 12 (Security)                                       | `scanning-engine` + domain             | Add checksum / structural validators (Gap: specify algorithm)            |
| Product Verification (backend call)                                                                 | Sections 7 (Data Flow), 8 (Ports), 10 (Backend options), 11 (HTTP)         | `infra-backend-*`, `core-domain`       | Port abstraction; maps API response to `VerificationResult`              |
| Success UI (check mark + message + details)                                                         | Section 6 (UI packages), 15 (Extensibility)                                | `ui-*`                                 | Domain result includes product metadata; design summary lists fields     |
| Product Details Fields: Name, Manufacturer, Marketed By, Manufactured On, Expiry Date, Batch Number | Section 4 (Requirements), 8 (Ports)                                        | Domain DTO                             | Field naming alignment needed (Produced date vs Manufactured On)         |
| Additional Fields (Serial Number, Raw material batch number)                                        | Not fully covered                                                          | Domain DTO (future extension)          | Gap: Add to ProductDetails interface; confirm backend availability       |
| Global Compatibility (i18n)                                                                         | Sections 6 (localization), 11 (Internationalization)                       | `localization` + `LocalizationPort`    | Uses i18next; lazy-loaded resources                                      |
| Scan Reset method                                                                                   | Section 7 (Public API concept), DESIGN_SUMMARY API                         | `core-domain` / Facade                 | Implement `resetScan()` clearing ephemeral state                         |
| Home Page Entry → Scan Flow (Web)                                                                   | Section 23 (Future Diagrams)                                               | Example apps                           | Needs sequence diagram; traceability placeholder                         |
| Standard Scan API call                                                                              | Section 10 (Backend)                                                       | `infra-backend-*`                      | Gap: Need formal API contract + error code schema                        |
| Scenario 1 Valid Product (display NA for missing)                                                   | Sections 4, 21 (ADR re DTO mapping)                                        | `core-domain` / UI                     | `NA` rendering policy (Gap: localization key for NA)                     |
| Scenario 2 Invalid Product (Non Syngenta)                                                           | Sections 14 (Size - error budgets), 12 (Security)                          | Domain + UI                            | Error code mapping table required (Gap)                                  |
| 13 Error Codes (0–12)                                                                               | Not enumerated currently                                                   | Domain constants                       | Gap: Add `errorCodes.ts` with mappings + translations                    |
| Scenario 3 Counterfeit (>10 distinct retailers in 1 year)                                           | Sections 15 (Extensibility Roadmap), 13 (Counterfeit heuristic in summary) | Domain use case                        | Threshold configurable; needs retailer identifier source (Gap)           |
| JWT + Secure transport                                                                              | Sections 11 (HTTP & Auth), 16 (Security)                                   | `infra-http`                           | Token injection via config; may need refresh workflow (Gap)              |
| Retry & Timeout strategies                                                                          | Section 11                                                                 | `infra-http`                           | Circuit breaker & backoff described; implement metrics hooks             |
| Lazy camera loading                                                                                 | Section 14 (Size Optimization)                                             | `ui-*`                                 | Dynamic import / conditional mount                                       |
| Web Worker for decoding                                                                             | Section 14 (Web Specific)                                                  | `scanning-engine` (web adapter)        | Worker wrapper planned; not implemented (Gap)                            |
| Localization of error & status messages                                                             | Sections 11 (i18n), 24 (Open Questions)                                    | `localization`                         | Need key namespace design (`verification.errors.code_X`)                 |
| Message: “This product is authentic...”                                                             | Section 12 (Publishing & Consumption)                                      | UI components                          | Provide localized string; confirm marketing-approved phrasing (Gap)      |
| Counterfeit Warning Message                                                                         | Section 15 (Extensibility)                                                 | Domain + UI                            | Requires final copy & escalation workflow (Gap)                          |

## 28. Gaps & Ambiguities Needing Clarification

1. Error Codes: Precise semantics for codes 0–12; duplication (0 and 2 both "Tracking id is not available?")—need authoritative list.
2. Data Fields: Difference between Manufactured On vs Produced date vs Serial Number vs Tracking ID; confirm canonical naming.
3. Raw Material Batch Number: Backend availability & field name; is it always present?
4. Retailer Identification: Source of retailer/user identity for counterfeit heuristic (app auth? passed parameter?).
5. Standard Scan API: Full request/response schema (URL, method, auth headers, body shape, example payload, error structure).
6. NA Rendering: Should "NA" be localized? Provide i18n key or constant? Accessibility implications (screen reader should read “Not Available”).
7. Code Format Validation: Any checksum or pattern rules for Syngenta QR beyond length? Provide spec.
8. Security: JWT acquisition & refresh mechanism—handled externally or SDK responsibility? Token rotation strategy?
9. Counterfeit Threshold: Static (10) or environment config? Time window definition (rolling 365 days vs calendar year?).
10. Web Fallback: Behavior on desktop without camera—manual code entry, file upload, or disable feature?
11. Accessibility: UI semantics (aria labels for camera region, color contrast for check mark).
12. Logging & Compliance: Required audit fields (scan timestamp, geo, user ID?) any retention policies? PII handling.
13. Performance SLAs: Target latency for verification API (e.g., <800ms p95) not yet defined.
14. Worker Strategy: Which functions offloaded to Web Worker—decoding only or also integrity validation?
15. Internationalization: List of launch locales; fallback hierarchy (e.g., `en-GB` → `en`).
16. Message Copy Approval: Authentic, invalid, counterfeit warning text needs product/legal sign-off.
17. Offline Mode: Not MVP—confirm deferral explicitly to Phase 2.
18. Plugin Governance: Validation & security model for third-party plugins; sandbox boundary.
19. Analytics: Event schema (fields, naming) for `scan_start`, `scan_success`, `scan_error`, `counterfeit_warning`.
20. Rate Limiting: Client-side vs server enforcement for repeated scans.

## 29. Recommended Backlog Items (Derived from Gaps)

- Define `errorCodes.ts` + localized messages (codes 0–12) + counterfeit warning.
- Extend `ProductDetails` interface to include Serial Number & Raw Material Batch Number.
- Author Standard Scan API spec (OpenAPI YAML) & commit to `doc/api/`.
- Implement Web Worker wrapper for decoding (feature flag).
- Add retailer/user identifier parameter to `scan()` or `initialize()` config.
- Create `localization` package with base `en` resources including NA key.
- Add accessibility checklist to documentation (`doc/ACCESSIBILITY.md`).
- Implement code validation utilities (length/pattern/checksum) in `scanning-engine`.
- Add configuration for counterfeit threshold & time window in `Config` object.
- Draft Metrics & Analytics event schema in `doc/ANALYTICS.md`.
- Setup size budget CI job (bundle analyzer + threshold).
- Create ADR for counterfeit heuristic (ADR-004).
- Add Web fallback (manual code entry component) to `react-web` package.
- Prepare Open Questions issue template linking Section 28.

## 30. Cross-Links

See `DESIGN_SUMMARY.md` for executive overview; keep Sections 27–29 synchronized when new requirements emerge.
