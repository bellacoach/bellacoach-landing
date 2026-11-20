# Product Marketing Context

**Document version:** v3
**Last updated:** 2026-11-20

Drafted from the live site copy (index, pricing, product pages, blog, privacy, terms) plus the decisions in the 16 Oct 2026 SEO roadmap. Items marked **[confirm]** are inferred, not stated by the team.

**Private half:** this repo is public, so prices, sales numbers and customer counts live in `.agents/product-marketing.private.md` (git-ignored, on Nick's machine only). Read both. Never copy anything from the private file into this one, the site, or a commit.

**The one KPI (Nick, 2026-11-19):** get leads and convert them to sales. Every marketing task is judged by whether it moves **walkthroughs booked per week**, then **walkthroughs held**, then **offices paying**. The lead log is `bella-projects/outreach/leads.csv`.

## Product Overview
**One-liner:** Bella lets dental treatment coordinators rehearse the treatment-plan conversation against a realistic AI patient, then coaches them on the consults they actually had.
**What it does:** Three products in one loop (rehearse, present, review, improve). **Bella Coach**: AI role-play with 14 patient personas across specialties and three difficulty levels, a live warmth meter, and scoring against the practice's own playbook. **Bella Treatment Desk**: chairside estimates (treatment, insurance, patient portion, monthly options) from the practice's fee schedule, with follow-ups and case-acceptance tracking by coordinator and office. **Bella Voice**: with everyone's consent, records real consults and shows the coordinator where the case turned; the Rewind turns a moment into a new rep. Coming soon: **Bella Onboard** (new-hire training) and **Bella Credentials** (credentialing and payer enrollment).
**Product category:** Treatment coordinator training and coaching software; dental case acceptance software. Searches use "treatment coordinator training", "dental case presentation", "objection handling", "case acceptance".
**Product type:** B2B SaaS (web app at app.bellacoach.com, optional Chrome extension "Bella Companion" for Voice).
**Business model:** Monthly subscription, three tiers (Self-Serve, Customization, White-Glove). On 2026-10-18 Nick moved pricing to **per office** (figures in the private file) and then removed the public pricing page the same day: /pricing redirects to Book a demo, and the price is quoted after the walkthrough. **Never put a price in public copy, schema, cold email or reply drafts.** [confirm the current price list before quoting]

## Target Audience
**Target companies:** US dental practices, multi-location groups and DSOs. Lead specialty is pediatric (first partner: Children's Dental FunZone), but sold to all specialties (pediatric, orthodontics, oral surgery, general per the original brief) **[confirm list]**.
**Outbound ICP (cold email, since 2026-11-04):** pediatric dentists and orthodontists in Southern California, found city by city (`outreach/cities.json`). Existing customers are on the do-not-contact list.
**Decision-makers:** Practice owners, COOs and regional/office managers (buyers); treatment coordinators (users).
**Primary use case:** Giving coordinators reps on the conversation that decides the case before they have it with a real family.
**Jobs to be done:**
- Get a new or average coordinator presenting treatment confidently without learning on real patients.
- See which coordinator and office actually move case acceptance, measured on accepted and paid, not self-reported.
- Coach real consults without a manager sitting in on every one.
**Use cases:**
- Rehearsing a specific objection ("I need to think about it", "let me check with my husband", "he's not in pain").
- Building an estimate at the chair and tracking the follow-up.
- Reviewing a recorded consult and turning the moment it turned into a rehearsal.
- Interviewing/onboarding a new treatment coordinator **[confirm as supported use]**.

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Treatment coordinator (user) | Not fumbling the number; confidence; not feeling pushy | Learned by shadowing; first reps are on real families | Unlimited reps against a patient who pushes back, feedback during the rep |
| Office manager / regional (champion) | Consistent presentations across coordinators and offices | Can't sit in on every consult; coaching is anecdotal | Reports by coordinator and office; Voice reviews of real consults |
| Owner / COO / DSO leader (decision maker, financial buyer) | Production and case acceptance; ROI | Coordinators are the biggest lever on production but untrained | Case acceptance measured where it moves; ROI calculator on /pricing |
| Compliance / privacy owner (technical influencer) | HIPAA, consent, data retention | Recording patients is a risk | Recording gated behind a signed BAA and consent; audio deleted after 90 days |

## Problems & Pain Points
**Core problem:** Case acceptance turns on one conversation, and most coordinators never get to practice it; they learn by shadowing, on real families, with revenue on the line.
**Why alternatives fall short:**
- Courses are watched once; they can't interrupt you, go quiet, or say the thing you dread.
- Generic sales training teaches a script and isn't scored against the practice's playbook or real outcomes.
- Shadowing and role-play with a colleague are inconsistent and don't scale.
- PMS printouts hand the parent a billing document instead of a conversation.
**What it costs them:** Lost cases and unscheduled treatment; coordinators who quit; production that depends on one star coordinator.
**Emotional tension:** Coordinators feel guilt saying a big number to a parent; owners fear pushy selling that damages trust.

## Competitive Landscape
**Direct:** Other dental treatment-coordinator training or AI role-play tools: fall short if they're courses or generic scripts not tied to outcomes. Seen in search results on 2026-11-19 (third-party SEO audit; not yet profiled, so treat as a list of names, not facts about them):
- AI role-play and coaching: Trainio, RepLab, Dentra AI, Rilla, Bilanx Voice Coach.
- Courses and coaching: All-Star Dental Academy, DDS Success, The Team Training Institute, OrthoTeam University, Dental A Team.
**Secondary:** Dental sales/consulting programs and live coaching: expensive, episodic, not measured on accepted-and-paid.
**Indirect:** Shadowing an experienced coordinator; doing nothing and hiring "the friendliest person at the front desk".

## Differentiation
**Key differentiators:**
- A patient that pushes back like the real thing (personas built around specific objections; harder levels withhold information).
- Live warmth meter during the rep, not only a score after.
- Scored against the practice's own playbook, not a generic rubric.
- One loop: rehearse (Coach) → present (Treatment Desk) → review (Voice) → rehearse the line that stopped you (Rewind).
- Outcomes measured on accepted and paid, by coordinator and office.
- Patient data only behind a signed BAA, with consent recorded first.
**How we do it differently:** Built from real consults that went badly ("came from the operatory, not a whiteboard").
**Why that's better:** The reps happen before the stakes are real, and the improvement shows in the number the practice already tracks.
**Why customers choose us:** **[confirm from sales calls]**

## Objections
| Objection | Response |
|-----------|----------|
| "Is this a training course?" | No. A course is watched once; Bella is a loop run every week. |
| "Do we have to record real patients?" | No. Role-play is fully synthetic, no patient data, no BAA needed to start. |
| "Does it work for our specialty?" | Personas run across specialties and difficulty levels; estimates price from your fee schedule. |
| "What happens to recordings?" | Consent first; audio deleted after 90 days; recording off until a BAA is in place. |
| "Does it replace our PMS?" | No. It's the case conversation and what happens to the case afterwards. |

**Anti-persona:** Practices looking for a script to push more treatment regardless of need; anyone who wants high-pressure sales techniques.

## Switching Dynamics
**Push:** Inconsistent case acceptance; new coordinators fumbling the number; no visibility into what happens in consults.
**Pull:** Unlimited realistic reps; measured case acceptance; coaching on real consults.
**Habit:** Shadowing, printouts, "the doctor recommends it".
**Anxiety:** Patient privacy and recording; staff feeling surveilled; setup effort; whether AI patients are realistic.

## Customer Language
**How they describe the problem:**
- "I need to think about it" / "Let me check with my husband" / "Can we just do the one tooth?" / "She's not in any pain" (parent objections the coordinator faces)
**How they describe us:**
- "The coordinators who rehearse in Bella walk into the consult ready. You can hear it in the first thirty seconds." (Evelyn Lahiji, COO, Children's Dental FunZone)
**Words to use:** treatment coordinator, case acceptance, treatment presentation, rehearse, reps, objection, playbook, accepted and paid, chairside, consent, BAA, HIPAA.
**Words to avoid:** "HIPAA certified" (no such certification), "close" as pressure language, "platform" (unconfirmed), UK spellings, any promised result such as "increase case acceptance 10–15%" (no evidence yet; ask about their numbers instead).
**Glossary:**
| Term | Meaning |
|------|---------|
| Rep | One rehearsal session against an AI patient |
| Persona | A scripted AI patient built around one objection, at a difficulty level |
| Warmth meter | Live 0–100 read of how the conversation is going |
| The Rewind | Bella Voice feature: a marked moment in a real consult becomes a rehearsal |
| Workspace | A customer's account containing offices, users and data |
| Per user | Pricing unit: one login, usually a coordinator |

## Brand Voice
| Attribute | Means | Doesn't mean | Example line |
|-----------|-------|--------------|--------------|
| Plainspoken | Short declaratives, concrete nouns | Jargon, hype | "A course is watched; this is run." |
| Honest | Says what it can't do | Self-deprecation | "This is your arithmetic, not a forecast." |
| From the operatory | Specific scenes from real consults | Generic sales talk | "It dies at a kitchen table you are not sitting at." |
| Respectful of patients | Never pushy; trust over closing | Soft on outcomes | "This is not a technique for extracting yes." |

**Tone by context:**
- Support: direct, step-by-step.
- Launch: understated; say what shipped and who it's for.
- Errors: plain ("Something went wrong — please try again or email us directly").
- Sales: specific numbers and the practice's own data.
- Social: one sharp line from a blog post.
**Terms we own:** reps, the Rewind, warmth meter, "practice the conversation before it counts".
**Never use (and why):** "HIPAA certified" (doesn't exist); "AI Sales Coach" for the company (old naming).
**Spelling:** US English throughout ("practice" as noun and verb, "behavior", "itemize", "Mom").
**Naming:** company = **Bella**; products = **Bella Coach**, **Bella Treatment Desk**, **Bella Voice**. Don't call the company "Bella Coach". Legal entity: Bella Coach LLC (legal pages only). For search engines and AI answers the Organization schema is named **"Bella Dental Coach"** (alternateName "Bella"), because "Bella" and "Bellacoach" alone collide with unrelated companies. Visible copy still says "Bella".

## Proof Points
**Metrics:** None published yet **[need real numbers]**.
**Customers:** Children's Dental FunZone (partner; Evelyn Lahiji's testimonial approved 2026-09-08). Other customers are listed in the private file; never name one publicly without its written OK.
**Testimonials:**
> "The coordinators who rehearse in Bella walk into the consult ready. You can hear it in the first thirty seconds." — Evelyn Lahiji, COO, Children's Dental FunZone
**Value themes:**
| Theme | Proof |
|-------|-------|
| Reps before real patients | 14 personas, unlimited sessions |
| Measured outcomes | Accepted-and-paid tracking by coordinator and office |
| Safe with patient data | BAA gate, consent first, 90-day audio deletion |

## Goals
**Business goal:** New paying offices (Nick's reasoning is in the private file).
**Conversion action:** Book a 15-minute walkthrough. Two ways in, on every page since 2026-11-19 (`book.js`):
- **Pick a time:** Nick's 15-minute "Book a Demo" Google Calendar schedule (`BOOKING_URL` in `book.js`), live since 2026-11-20, with a Meet link added to each booking. Saturdays are open on purpose.
- **Leave details:** the short Formspree form; Nick replies within 24 hours.

**Funnel and where each number comes from:**
| Stage | Source of truth |
|-------|-----------------|
| Lead | `outreach/leads.csv`: cold-email replies, Formspree submissions, calendar bookings, referrals |
| Walkthrough booked | Google Calendar invite, or a time agreed by email, logged in leads.csv |
| Walkthrough held | leads.csv (Nick marks it) |
| Paying | leads.csv (Nick marks it) |

**Current metrics:** in the private file. Count from `outreach/leads.csv`, not GA4.

## Paid Ads (optional)
**Target CPA / ROAS:** [unknown]
**Conversions that count:**
| Action | Means | Value | Feeds bidding? |
|--------|-------|-------|----------------|
| generate_lead (demo) | Walkthrough requested through the form | 0 (no public price) | Yes |
| booking_calendar_open | Opened the Google Calendar booking page | none | No: intent only, not a booking |
| sign_up | Newsletter / template / waitlist | 0 | No |
**Known tracking weaknesses:** Calendar bookings happen on Google's site, so neither GA4 nor the Pixel sees them; count them from the calendar invites in leads.csv. The Pixel and lead events are live (fixed in roadmap Phase 1).
**Agent may:** read, compare, flag, draft, recommend
**Agent may not (without approval):** change budgets or bids, pause or launch, edit tracking, publish ads

## Learnings
*Decisions and tested lessons. Newest first. Keep it to about 20 active entries.*
| Date | Learning | Evidence | Applies to | Status |
|------|----------|----------|------------|--------|
| 2026-11-19 | Only email addresses Reoon marks "verified" are safe to cold-email; "risky" ones bounce | Risky addresses bounced far more often than verified ones (2026-11-16; counts in the private file); Nick made it the rule 2026-11-20 | cold-email, prospecting | active |
| 2026-11-19 | Organization schema says "Bella Dental Coach" (alternateName "Bella"); visible brand stays "Bella" | SEO audit: "Bella" alone is ambiguous in search | schema, about page | active |
| 2026-11-15 | Every cold email is about case acceptance; never promise a lift | Nick's direction; FTC substantiation | cold-email, ads, copy | active |
| 2026-11-10 | No links or web addresses in emails sent through the Gmail connector | It rewrote bellacoach.com into a dead google.com redirect | cold-email, reply drafts | active |
| 2026-10-18 | No public pricing; the price comes after the walkthrough | Nick removed the pricing page | site, schema, emails | active |
| 2026-10-16 | Company is "Bella"; "Bella Coach" is only the role-play product | SEO audit: brand/product name collision | all copy, titles, schema | active |
| 2026-10-16 | Price unit is "per user" everywhere | Terms say seats, pricing says user, home said coordinator | pricing, schema, copy | retired: pricing moved to per office, then off the site (2026-10-18) |
| 2026-10-16 | Say "BAA-backed, built to support HIPAA"; never "HIPAA certified" | No certification exists | product, privacy copy | active |

## Changelog
*Newest first. One line per revision: what changed and why.*
- v3 (2026-11-20) — Split for a public repo: prices, current metrics, customer count and Nick's quote moved to the git-ignored private file. Calendar booking live; cold email resumed verified-only.
- v2 (2026-11-19) — Set the one KPI (walkthroughs booked → held → paying) and the lead log; pricing now off the site; outbound ICP; competitor names from the Nov 19 audit; "Bella Dental Coach" in schema; real current metrics; new learnings from cold email.
- v1 (2026-10-16) — Initial context, auto-drafted from site copy plus SEO-roadmap decisions.
