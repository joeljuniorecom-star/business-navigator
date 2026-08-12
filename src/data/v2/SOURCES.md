# Business Fit V2 — Research sources

These sources inform the architecture and questionnaire. They do not imply that the app's 0–100 business requirement values are empirically validated.

## Personality — Big Five

- International Personality Item Pool (IPIP): https://ipip.ori.org/
- NIH listing for IPIP Big Five: https://www.nih.gov/node/21481

Implementation note: IPIP items/scales are public domain. V2 uses a compact, balanced Big Five structure with four items per factor and reverse-keyed items. The app must describe the output as a lightweight personality profile, not a diagnosis.

## Vocational interests — RIASEC

- O*NET Interest Profiler documentation: https://services.onetcenter.org/reference/mnm/ip
- O*NET Mini-IP 30-question mobile format: https://services.onetcenter.org/reference/mnm/ip/ip_questions_30

Implementation note: O*NET demonstrates why RIASEC should use multiple activity-interest items and five response levels. V2 uses original French activity items mapped to all six RIASEC dimensions rather than pretending that one question per dimension is sufficient.

## Entrepreneurial competencies

- European Commission JRC — EntreComp: https://publications.jrc.ec.europa.eu/repository/handle/JRC101581
- OECD — Developing entrepreneurship competencies: https://www.oecd.org/en/publications/strengthening-smes-and-entrepreneurship-for-productivity-and-inclusive-growth_c19b6f97-en/full-report/component-10.html
- OECD — Entrepreneurship skills training (2026): https://www.oecd.org/en/publications/incubation-in-entrepreneurial-ecosystems_21be9d03-en/full-report/entrepreneurship-skills-training_f77ad336.html

Implementation note: these sources support measuring opportunity orientation, creativity, resource mobilisation, initiative, planning, problem solving, collaboration, leadership and tolerance of uncertainty as competencies/preferences rather than treating personality as destiny.

## E-commerce model taxonomy

- Shopify dropshipping documentation: https://help.shopify.com/en/manual/products/dropshipping
- Shopify types of dropshipping: https://help.shopify.com/en/manual/products/dropshipping/what-is-dropshipping/types-of-dropshipping
- Shopify subscriptions: https://help.shopify.com/en/manual/products/purchase-options/subscriptions/model-types
- Shopify e-commerce business model overview: https://www.shopify.com/uk/blog/business-model
- Etsy creativity standards: https://www.etsy.com/legal/creativity/

Implementation note: V2 separates business models (dropshipping, POD, private label, wholesale, subscription, marketplace, arbitrage, etc.) from product niches (beauty, pets, fitness, etc.).

## Software monetisation

- Stripe recurring pricing models: https://docs.stripe.com/products-prices/pricing-models
- Stripe usage-based billing: https://docs.stripe.com/billing/subscriptions/usage-based/implementation-guide

Implementation note: V2 distinguishes software delivery/distribution models such as SaaS, mobile subscription, API-as-a-Service, marketplace, plugin/extension, open-core, self-hosted licence and usage-based infrastructure.

## Product policy

- Personality and reasoning have low weights and never act as hard filters.
- The reasoning module is not an IQ test and must not output an IQ number.
- Economic thresholds (EUR, hours, weeks) are stored in real units.
- Business fit is an explainable recommendation score, not a success probability.
