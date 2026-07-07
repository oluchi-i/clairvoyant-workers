# CLAIRVOYANT

> AI-powered race walking rule violation analyzer built on Cloudflare Workers AI

🔴 **Live Demo:** https://my-ai-app.oluchi-ai.workers.dev

---

## What It Does

CLAIRVOYANT analyzes race walking athlete movement descriptions and automatically detects rule violations based on World Athletics Laws — the same two rules enforced in Olympic competition:

- **Loss of Contact**: both feet leaving the ground simultaneously
- **Bent Knee**: advancing leg not straightened at ground contact

The app returns a structured verdict: RED CARD, WARNING, or NO VIOLATION — with the specific rule violated, confidence level, reasoning, and recommended judge action.

---

## Why I Built This

This app extends a Senior Research project, also named CLAIRVOYANT, where we built a Python/OpenCV computer vision pipeline that analyzed race walk athlete footage frame-by-frame to detect violations automatically, achieving a high accuracy on the primary detection class.

This Cloudflare Workers version brings that same domain expertise to a serverless AI platform, replacing the CV pipeline with a natural language interface powered by Cloudflare Workers AI (Llama 3.3 70B).

---

## Tech Stack

- **Cloudflare Workers**: serverless edge deployment
- **Cloudflare Workers AI**: Llama 3.3 70B instruct model
- **TypeScript**: type-safe Worker implementation
- **Wrangler**: CLI deployment and local development

---

## How to Run Locally

```bash
git clone https://github.com/oluchi-i/clairvoyant-workers
cd clairvoyant-workers
npm install
wrangler dev --remote
```

Visit `http://localhost:8787`

---

## How to Deploy

```bash
wrangler deploy
```

---

## Example Input & Output

**Input:**
> The athlete's right foot leaves the ground as their left foot is still in the air, resulting in a brief moment where neither foot is in contact with the ground. The knee remains bent at ground contact.

**Output:**
```
VERDICT: RED CARD
RULE VIOLATED: Loss of Contact
SECONDARY VIOLATION: Bent Knee
CONFIDENCE: High
REASONING: The athlete clearly violates the Loss of Contact rule by having both feet off the ground simultaneously. The bent knee at ground contact constitutes a secondary violation of the Bent Knee rule.
RECOMMENDED ACTION: The judge should immediately issue a red card to the athlete.
```

---

## Related Project

See the full computer vision implementation of CLAIRVOYANT:
...

---

*Built by Oluchi Ikwuegbu: Drexel University CS 2026*
