# Yasmina Embedded Insurance — Project Documentation

## What the Business Does

Yasmina is an API-first embedded insurance platform operating in Saudi Arabia and the broader region. Its core purpose is to sit as a middleware layer between licensed insurance providers and digital businesses (tech platforms, e-commerce stores, HR systems, car dealerships, banks, and more), enabling those businesses to offer insurance products natively within their own products without building direct relationships with insurers.

The business model is self-service and fully API-driven. A business signs up at `portal.yasmina.ai`, goes through an enrollment wizard, selects the insurance products it wants to offer, and upon approval gets API credentials to start integrating. The platform handles quoting, policy issuance, payment processing, document delivery, claims initiation, and webhook notifications. Yasmina never exposes its own branding on the payment page, keeping the experience white-labeled for the integrating business.

From the APIs, the business currently supports two integration modes. In the Single Provider model, the integrating business is pre-assigned to a fixed insurance company and issues policies directly. In the Multiple Providers model, the business requests quotes from several insurance companies simultaneously, presents a comparison to the end customer, and issues the policy once the customer selects a provider. Motor insurance supports both modes, property insurance supports both modes, and all other products (SME Medical, Travel, Life S&P, Horse) operate on the single-provider model.

## Project Structure

This repository is a Mintlify documentation site. The entry point and source of truth for structure is `docs.json`. All files and directories not referenced from `docs.json` are considered unused and are not part of the published site.

The published site is divided into four navigation tabs: Guide, API Reference, SDKs, and Changelog.

### Guide Tab

The Guide tab contains all human-readable integration documentation. It is organized into five groups.

**Getting Started** covers four pages. `introduction.mdx` explains what Yasmina is, lists all available products, and walks through the onboarding steps (signup at `portal.yasmina.ai/register`, enrollment wizard, approval within 24 hours on production, and auto-approval on sandbox). `environments.mdx` documents the three environments — production at `https://production.yasmina.ai`, sandbox at `https://sandbox.yasmina.ai`, and a staging environment. `authentication.mdx` explains the OAuth 2.0 client credentials flow used across all APIs, including how to retrieve credentials from the portal and exchange them for a JWT bearer token. `developer.mdx` links to the status page at `https://yasmina.statuspage.io/`.

**Insurance Integration Guides** is split into Single Provider and Multiple Provider sub-groups. The Single Provider sub-group contains seven integration guides covering SME Medical, Comprehensive Motor, TPL Motor, Property, Travel (Schengen), Life S&P, and Horse Insurance. The Multiple Provider sub-group covers three products where price comparison across insurers is available: Comprehensive Motor, TPL Motor, and Property Insurance.

**API Resources** contains three reference pages. `api-resources/data.mdx` lists common data types (ISO 8601 datetimes, ISO 3166 country codes, UUID client IDs, integer internal IDs, and PDF URL policy documents). `api-resources/errors.mdx` documents HTTP error codes from 400 through 502, including the 502 Bad Gateway that indicates a third-party insurer failure. `api-resources/rate.mdx` documents per-endpoint rate limits for Medical APIs (ranging from 30 to 120 requests per minute), Car APIs (30 to 120 requests per minute), the OAuth token endpoint (10 requests per minute), and the Payment API (120 requests per minute).

**Webhooks** contains `webhooks/guide.mdx`, which explains how to configure webhooks from the portal, the two available events (Status Update triggered when a policy status changes, and Document Update triggered when a policy document is uploaded), the `x-webhook-key` security header, how to test webhooks via the portal, and the JSON payload structure (which mirrors the policy object).

**White-labeling Solutions** contains two pages. `whitelabel/iframes.mdx` describes a plug-and-play IFrame widget currently available for SME Medical that can be embedded directly into a client's website. `whitelabel/snippets.mdx` describes ready-made Bootstrap 5 HTML snippets currently available for Motor Insurance that allow businesses to add a styled insurance selection UI without backend integration.

### API Reference Tab

The API Reference tab exposes interactive OpenAPI-powered reference pages for each product API. Each group points to an `openapi.json` source file within its corresponding directory. The groups are Authentication (`auth-api-reference/openapi.json`), SME Medical APIs (`medical-api-reference/openapi.json`), Motor Insurance APIs for Multiple Providers (`car-api-reference/openapi.json`), TPL Motor Insurance APIs (`cartpl-api-reference/openapi.json`), Property Insurance APIs (`property-api-reference/openapi.json`), Travel Insurance APIs (`yasmina-schengen-travel-insurance/openapi.json`), Life S&P Insurance APIs (`life-snp/openapi.json`), Horse Insurance APIs (`horse-api-reference/openapi.json`), and Payment APIs (`payments-api-reference/openapi.json`).

The playground is configured as interactive with the proxy disabled, meaning API calls hit the actual Yasmina servers directly from the browser.

### SDKs Tab

The SDKs tab currently contains a single page: `sdks/ios.mdx`, which documents the `YasminaSDKKit` iOS SDK. It is distributed as a prebuilt `.xcframework` via Swift Package Manager or CocoaPods from `https://github.com/YasminaAI/Yasmina-iOS.git`. The SDK wraps the multi-provider car quote flow including OTP verification, and targets iOS 13+, Xcode 15+, and Swift 5.9+.

### Changelog Tab

`changelog.mdx` tracks updates to both the docs and the APIs. The most recent entries include `custom_number` support as an alternative to `car_sequence_number` for newly imported cars (December 2025), car insurance start date documentation (December 2025), separation of multi-provider and single-provider products (October 2025), and earlier releases of Horse Insurance (February 2025), Webhooks (July 2025), Property Insurance with price comparison (July 2025), and a full documentation revamp (August 2025).

## Integration Patterns by Product

### SME Medical Insurance

The flow is: authenticate, create a company record via `POST /medical/companies`, list available packages from `GET /medical/products/categories`, issue policies for employees via `POST /medical/request-policies` (passing an `insured` array with each employee's name, nationality ID or Iqama ID, date of birth, category, and number of dependents), handle health declarations either by filling them on behalf of employees or dispatching them by email, and finally share the payment link returned in the response. An IFrame white-label option is also available.

### Comprehensive Motor Insurance (Single Provider)

The flow is: authenticate, call `POST /api/v1/car-comp/policies` with owner ID, email, phone, birthdate, car sequence number or custom number, ownership transfer flag, estimated car cost, and model year. The response includes a `payment_link` and a `price`. Policy status is `0` (pending) until the customer completes payment, after which status becomes `1` (issued) and `provider_policy` is populated with the PDF URL. Claims are submitted via `POST /api/v1/car-comp/policies/{id}/claims`.

### Comprehensive Motor Insurance (Multiple Providers)

The flow adds a quoting step. First request an OTP via `POST /api/v1/car-comp/quote-otp`, then call `POST /api/v1/car-comp/quote-requests` with car and owner details to receive quotes from multiple insurers (allow up to 2 minutes for this call). Each insurer returns a `quote_reference_id`, a `prices` array with different deductibles, and a `benefits` array. The customer selects a quote, a second OTP is requested via `POST /api/v1/car-comp/issue-otp`, and the policy is issued via `POST /api/v1/car-comp/policies` using the `quote_request_id`, `quote_reference_id`, `quote_price_id`, selected benefits, and OTP.

### TPL Motor Insurance

Follows the same structure as Comprehensive Motor Insurance for both the single-provider and multiple-provider modes, with the difference that TPL quotes have a single deductible (no multiple pricing tiers). No OTP step is required for the single-provider mode.

### Property Insurance

The flow is: optionally resolve a short address code via `GET /api/v1/property/address-from-short`, then issue a policy via `POST /api/v1/property/policies` with personal details, building details (type, age, apartment size), full address, property cost or contents cost, and terms acceptance. In the multiple-provider mode, prices from five insurers (Walaa, Medgulf, Tawuniya, Takaful Al-Rajhi, Wataniya) are retrieved first via the List Prices API. Cancellation status is checked via `GET /api/v1/property/policies/{id}/cancellation-status`. Supporting images are uploaded via the Upload Document API.

### Travel Insurance (Schengen)

The flow is a two-step quote-then-purchase model. A quote is requested via `POST /api/v1/travel/quotes` with traveller details (nationalities, passport numbers, date of birth, trip duration, start date, multi-entry flag). The response includes a `quote_id` and a `price`. The policy is then purchased via `POST /api/v1/yasmina-schengen-travel` using the `quote_id`. The response includes a `payment_link`. After payment, the policy object includes both `policy_url` and `invoice_url` for PDF downloads. An optional `redirect_url` with a `policyID` placeholder is supported for post-payment deep linking.

### Life Insurance (S&P)

Targeted at bank channel integrations. The flow is: generate offers via `POST /api/v1/life-snp/offers` with applicant details, policy term, premium frequency, target premium or desired sum assured, and optional riders (critical illness, waiver of premium). The response is an array of offers from different insurers. A policy is issued via `POST /api/v1/life-snp/policies` referencing the `offer_id` and supplying beneficiary details with their share percentages and an optional IBAN for premium collection. Policies can be cancelled via `POST /api/v1/life-snp/policies/{id}/cancellation` and claims submitted via `POST /api/v1/life-snp/policies/{id}/claims` with claim type (`death`, `critical_illness`, `total_permanent_disability`), event date, and supporting documents.

### Horse Insurance

The simplest flow. Authenticate, then issue policies via the Issue Policies API providing horse and owner details. Claims can also be submitted via API.

## Authentication

All APIs use OAuth 2.0 client credentials. A `client_id` and `client_secret` are obtained from `https://portal.yasmina.ai/api-management`. These are exchanged for a JWT bearer token via `POST /oauth/token`. The token is valid for one year (`expires_in: 31536000`). It must be included in the `Authorization: Bearer {token}` header on every request. Generating a new client secret invalidates the old one. The OAuth endpoint is rate-limited to 10 requests per minute.

## Environments

Production is at `https://production.yasmina.ai` and requires manual account approval (within 24 hours). Sandbox is at `https://sandbox.yasmina.ai` and auto-approves accounts for testing. Both environments use the same APIs and flows. On Sandbox, payments can be tested with card number `4111 1111 1111 1111`, expiry `02/27`, CVV `123`, cardholder `Yasmina test`. A staging environment also exists at `https://staging.yasmina.ai`.

## Deployment Strategy

This documentation site is deployed via Mintlify using a docs-as-code approach. The GitHub App from Mintlify is installed on the repository, which connects the repository to Mintlify's deployment pipeline. Any push to the `main` branch automatically triggers a deployment and the changes go live on the public documentation site with no manual steps required. The `docs.json` file at the repository root is the configuration entry point that Mintlify reads to build navigation, theming, API reference groups, and all other site settings.

To preview changes locally before pushing, install the Mintlify CLI with `npm i -g mintlify` and run `mintlify dev` at the project root.

## Configuration Highlights

The site uses the `linden` Mintlify theme with green brand colors (primary `#16A34A`, light `#07C983`, dark `#15803D`). The font is `Inter`. The primary navbar CTA is a Portal button linking to `https://portal.yasmina.ai`. The contextual AI assistant is configured to use ChatGPT. Intercom is integrated with app ID `yu8wo042`. The API playground is set to interactive mode with proxy disabled. Two URL redirects are configured to forward legacy `/integrations/property` and `/integrations/car` paths to the new multi-provider integration URLs.
