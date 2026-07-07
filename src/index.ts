/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  AI: Ai;
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CLAIRVOYANT - Sports Performance Analyzer </title>
<style>
* {box-sizing: border-box; margin: 0; padding:0; }
body {font-family: 'Segoe UI', sans-serif; background: #928f8e; color: #f0f0f0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center ; padding: 2rem;}
.container {max-width: 700px; width: 100%;}
h1 {font-size: 2rem; color: #f97316; margin-bottom: 0.25rem;}
.subtitle{ color: #1a1717; margin-bottom: 2rem; font-size: 0.95rem;}
textarea {width:100%; padding: 0.85rem; background: #f97316; color:white; border:none; border-radius: 8px; font-size: 1rem; font-weight:bold; cursor:pointer; transition:background 0.2s;}
button:hover {background: #555; cursor: not-allowed;}
.result {margin-top:1.5rem; background: #0b0b0b; border: 1px solid #333; border-radius: 8px; padding:1.25rem; line-height:1.7;white-space:pre-wrap; min-height:60px;}
.badge {display: inline-block; margin-bottom: 1.5rem; background:#1a1a1a; border: 1px solid #f97316; color: #f97316; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.85rem;} 
.loading {color: #888; font-style: italic;}
</style>
</head>
<body>
<div class="container">
<span class="badge"> Powered by Cloudflare Workers AI </span>
<h1>CLAIRVOYANT</h1>
<p class="subtitle">Sports Performance & Rule Violation Analyzer - built on Cloudflare Workers AI </p>
<textarea id="input" placeholder="Describe an athlete's movement or action (e.g. 'During the race walk, the athlete's knee was visibly bent at contact and both feet left the ground simultaneously for 3 frames...')"></textarea>
<button id="btn" onclick="analyze()">Analyze Performance</button>
<div class ="result" id="result"></div>
</div>
<script>
async function analyze() {
  const input = document.getElementById('input').value.trim();
  if (!input) return;
  const btn = document.getElementById('btn');
  const result = document.getElementById('result');
  btn.disabled = true;
  btn.textContent = 'Analyzing...';
  result.innerHTML = '<span class="loading">Running analysis...</span>';
  try {
	const res = await fetch('/analyze', {
	  method: 'POST',
	  headers: {'Content-Type': 'application/json'},
	  body: JSON.stringify({input})
});
	const data = await res.json();
	result.textContent = data.response || JSON.stringify(data);
}
	catch (e) {
	result.textContent= 'Error: ' + e.message;}
	finally {
	btn.disabled = false;
	btn.textContent = 'Analyze Performance';
}
}
</script>
</body>
</html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);

	if (request.method === "GET" && url.pathname === "/") {
		return new Response(HTML, {
			headers: {"Content-Type": "text/html" },
		});
	}

	//handle analysis
	if (request.method === "POST" && url.pathname === "/analyze") {
		try {
			const { input } = await request.json() as {input: string};
		
    		const response = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
      			messages: [
        	{
          		role: "system",
				content: `You are CLAIRVOYANT, an AI race walking rule violation detector based on World Athletics Laws.
				Base your analysis ONLY on the specific movements described. Do not invent actions not mentioned.

				Race walking has TWO specific rules:
				- RULE 1 — Loss of Contact: At least one foot must be in contact with the ground at all times. If both feet leave the ground simultaneously, it is a violation.
				- RULE 2 — Bent Knee: The advancing leg must be straightened (not bent at the knee) from the moment of first contact with the ground until the vertical upright position.

				Use these guidelines:
				- RED CARD: Clear violation of Loss of Contact OR Bent Knee rule — judge is certain
				- WARNING: Suspected violation but not conclusive enough for red card
				- NO VIOLATION: Movement complies with both race walking rules

				You MUST respond ONLY in this exact format:

				VERDICT: [RED CARD / WARNING / NO VIOLATION]
				RULE VIOLATED: [Loss of Contact / Bent Knee / N/A]
				SECONDARY VIOLATION: [Loss of Contact / Bent Knee / None]
				CONFIDENCE: [High / Medium / Low]
				REASONING: [2-3 sentences based strictly on the described movement]
				RECOMMENDED ACTION: [what the race walking judge should do]`
        },
        {
          role: 'user',
          content: input
		}
      ]
	}
);

return new Response(JSON.stringify(response), {
  headers: {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*"
  },
  });
} catch (error) {
	return new Response(
		JSON.stringify({ error: String(error) }),
		{
			status: 500,
			headers: {"Content-Type": "application/json" }
		}
	);
	}	
}

return new Response("Not Found", {status: 404});
},
} satisfies ExportedHandler<Env>;