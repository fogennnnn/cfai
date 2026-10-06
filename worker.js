var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));

// worker.js
var worker_default = {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "allow": "GET, HEAD, OPTIONS",
          ...corsHeaders()
        }
      });
    }
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          ...corsHeaders()
        }
      });
    }
    if (url.pathname === "/health") {
      return Response.json(
        {
          ok: true,
          app: "ctrl46-research-interface",
          route: url.pathname
        },
        {
          headers: {
            "cache-control": "no-store",
            ...corsHeaders()
          }
        }
      );
    }
    return new Response("Not Found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        ...corsHeaders()
      }
    });
  }
};
function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, HEAD, OPTIONS",
    "access-control-allow-headers": "content-type"
  };
}
__name(corsHeaders, "corsHeaders");
var _a;
var HTML = String.raw(_a || (_a = __template([`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CTRL46 Research Interface | Refined Workspace</title>
  <style>
    :root{
      --bg:#050814;
      --bg2:#071022;
      --panel:rgba(12,18,34,.72);
      --panel-strong:rgba(15,22,40,.88);
      --line:rgba(144,179,255,.12);
      --line-strong:rgba(144,179,255,.22);
      --text:#edf2ff;
      --muted:#9faecc;
      --soft:#7784a3;
      --cyan:#6fd6ff;
      --blue:#5f84ff;
      --violet:#8f73ff;
      --pink:#d87eff;
      --green:#71ffc8;
      --amber:#ffd57a;
      --danger:#ff8ca8;
      --shadow:0 22px 70px rgba(0,0,0,.36);
      --radius:28px;
      --radius-sm:18px;
      --chip:rgba(255,255,255,.04);
      --grid:rgba(255,255,255,.022);
    }

    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0;
      min-height:100vh;
      color:var(--text);
      font-family:Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      background:
        radial-gradient(circle at 18% 10%, rgba(95,132,255,.16), transparent 28%),
        radial-gradient(circle at 85% 18%, rgba(216,126,255,.11), transparent 24%),
        radial-gradient(circle at 50% 76%, rgba(111,214,255,.08), transparent 28%),
        linear-gradient(180deg, var(--bg) 0%, var(--bg2) 46%, var(--bg) 100%);
      overflow-x:hidden;
    }

    body::before{
      content:"";
      position:fixed;
      inset:0;
      background-image:
        linear-gradient(var(--grid) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid) 1px, transparent 1px);
      background-size:42px 42px;
      pointer-events:none;
      mask-image:linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,.02));
    }

    canvas,.glow,.noise{
      position:fixed;
      inset:0;
      pointer-events:none;
    }

    .glow{
      background:
        radial-gradient(circle at 30% 12%, rgba(111,214,255,.08), transparent 28%),
        radial-gradient(circle at 72% 34%, rgba(143,115,255,.08), transparent 26%),
        radial-gradient(circle at 58% 82%, rgba(216,126,255,.06), transparent 24%);
      filter:blur(40px);
      opacity:.85;
      animation:pulse 12s ease-in-out infinite alternate;
    }

    .noise{
      opacity:.028;
      background-image:
        radial-gradient(circle at 22% 34%, rgba(255,255,255,.7) 0 .8px, transparent 1.2px),
        radial-gradient(circle at 70% 64%, rgba(255,255,255,.55) 0 .7px, transparent 1.2px),
        radial-gradient(circle at 40% 80%, rgba(255,255,255,.4) 0 .8px, transparent 1.3px);
      background-size:160px 160px, 190px 190px, 210px 210px;
      mix-blend-mode:screen;
      animation:drift 26s linear infinite;
    }

    @keyframes pulse{
      from{transform:scale(1) translateY(0)}
      to{transform:scale(1.04) translateY(-8px)}
    }

    @keyframes drift{
      from{transform:translate3d(0,0,0) scale(1)}
      to{transform:translate3d(-42px, 22px, 0) scale(1.05)}
    }

    .app{
      position:relative;
      z-index:2;
      width:min(1120px, calc(100% - 24px));
      margin:0 auto;
      padding:18px 0 36px;
    }

    .topbar{
      position:sticky;
      top:14px;
      z-index:20;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      padding:14px 16px;
      border-radius:24px;
      border:1px solid var(--line);
      background:rgba(7,12,25,.62);
      backdrop-filter:blur(18px);
      box-shadow:var(--shadow);
    }

    .brand{
      display:flex;
      align-items:center;
      gap:12px;
      min-width:0;
    }

    .mark{
      width:46px;
      height:46px;
      border-radius:15px;
      display:grid;
      place-items:center;
      font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size:.82rem;
      letter-spacing:.08em;
      color:var(--cyan);
      background:
        linear-gradient(135deg, rgba(111,214,255,.22), rgba(95,132,255,.14)),
        rgba(255,255,255,.04);
      border:1px solid var(--line-strong);
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.04), 0 0 22px rgba(111,214,255,.12);
    }

    .brand h1{
      margin:0;
      font-size:1rem;
      letter-spacing:.04em;
      font-weight:650;
    }

    .brand p{
      margin:2px 0 0;
      color:var(--muted);
      font-size:.8rem;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width:320px;
    }

    .topbar-actions{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
      justify-content:flex-end;
    }

    button,input,textarea{font:inherit}

    .button{
      appearance:none;
      border:none;
      border-radius:999px;
      padding:11px 14px;
      color:var(--text);
      background:transparent;
      border:1px solid transparent;
      cursor:pointer;
      transition:.22s ease;
      text-decoration:none;
    }

    .button:hover{
      transform:translateY(-1px);
      background:rgba(255,255,255,.04);
      border-color:var(--line-strong);
    }

    .button.primary{
      background:linear-gradient(135deg, rgba(111,214,255,.18), rgba(95,132,255,.20));
      border-color:rgba(111,214,255,.24);
      box-shadow:0 12px 28px rgba(95,132,255,.16);
    }

    .button.subtle{
      color:var(--muted);
      border-color:rgba(255,255,255,.06);
      background:rgba(255,255,255,.02);
    }

    .workspace,
    .surface,
    .statusline,
    .footer{
      border-radius:var(--radius);
      border:1px solid var(--line);
      background:
        linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.018)),
        var(--panel);
      box-shadow:var(--shadow);
    }

    .workspace{
      margin-top:18px;
      padding:26px;
      position:relative;
      overflow:hidden;
    }

    .workspace::before{
      content:"";
      position:absolute;
      width:260px;
      height:260px;
      right:-80px;
      top:-80px;
      background:radial-gradient(circle, rgba(111,214,255,.13), transparent 70%);
      filter:blur(12px);
      pointer-events:none;
    }

    .eyebrow{
      display:inline-flex;
      align-items:center;
      gap:10px;
      padding:8px 12px;
      border-radius:999px;
      border:1px solid var(--line-strong);
      background:rgba(255,255,255,.03);
      color:var(--muted);
      font-size:.78rem;
      letter-spacing:.06em;
      text-transform:uppercase;
    }

    .eyebrow::before{
      content:"";
      width:8px;
      height:8px;
      border-radius:50%;
      background:var(--green);
      box-shadow:0 0 16px rgba(113,255,200,.55);
    }

    .headline{
      display:grid;
      grid-template-columns:1.12fr .88fr;
      gap:24px;
      align-items:end;
      margin-top:18px;
    }

    .headline h2{
      margin:0;
      font-size:clamp(2rem, 5vw, 3.7rem);
      line-height:.96;
      letter-spacing:-.05em;
      max-width:11ch;
    }

    .headline .grad{
      background:linear-gradient(135deg, #ffffff 8%, #a7ddff 40%, #b09eff 70%, #ffd3fd 100%);
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent;
    }

    .headline p{
      margin:0;
      color:var(--muted);
      line-height:1.7;
      max-width:58ch;
      justify-self:end;
    }

    .input-wrap{
      margin-top:22px;
      display:grid;
      gap:14px;
    }

    .input-shell{
      position:relative;
      border-radius:24px;
      border:1px solid rgba(255,255,255,.10);
      background:rgba(255,255,255,.035);
      overflow:hidden;
    }

    .input-meta{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:14px 16px 0;
      color:var(--soft);
      font-size:.8rem;
    }

    .mono{font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace}

    textarea{
      width:100%;
      min-height:156px;
      resize:vertical;
      border:none;
      outline:none;
      background:transparent;
      color:var(--text);
      padding:14px 16px 18px;
      font-size:1rem;
      line-height:1.65;
    }

    .toolrow{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
    }

    .toolrow .spacer{flex:1 1 auto}

    .statusline{
      margin-top:14px;
      padding:14px 16px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      flex-wrap:wrap;
    }

    .status-left,
    .status-right{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
    }

    .chip{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:9px 12px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.08);
      background:var(--chip);
      color:var(--muted);
      font-size:.84rem;
    }

    .chip b{
      color:var(--text);
      font-weight:600;
    }

    .surface{
      margin-top:18px;
      padding:12px;
    }

    .surface-head{
      padding:16px 16px 10px;
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:16px;
      flex-wrap:wrap;
    }

    .surface-head h3{
      margin:0;
      font-size:1.16rem;
      letter-spacing:-.02em;
    }

    .surface-head p{
      margin:6px 0 0;
      color:var(--muted);
      line-height:1.6;
      max-width:58ch;
    }

    .section{
      border-radius:22px;
      border:1px solid rgba(255,255,255,.07);
      background:rgba(255,255,255,.025);
      margin-top:10px;
      overflow:hidden;
    }

    details.section > summary{
      list-style:none;
      cursor:pointer;
      padding:16px 16px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      user-select:none;
    }

    details.section > summary::-webkit-details-marker{display:none}

    .summary-copy strong{
      display:block;
      font-size:1rem;
      letter-spacing:-.02em;
    }

    .summary-copy span{
      display:block;
      margin-top:4px;
      color:var(--muted);
      font-size:.88rem;
      line-height:1.5;
    }

    .summary-side{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
      justify-content:flex-end;
      color:var(--soft);
      font-size:.8rem;
    }

    .chev{
      transition:.2s ease;
      color:var(--soft);
      font-size:1rem;
    }

    details[open] .chev{transform:rotate(180deg)}

    .section-body{
      padding:0 16px 16px;
      border-top:1px solid rgba(255,255,255,.06);
    }

    .score-grid{
      display:grid;
      grid-template-columns:repeat(4, minmax(0,1fr));
      gap:12px;
      margin-top:16px;
    }

    .score-card{
      border-radius:18px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.03);
      padding:15px;
    }

    .score-card .label{
      color:var(--soft);
      font-size:.78rem;
      text-transform:uppercase;
      letter-spacing:.08em;
    }

    .score-card .value{
      margin-top:8px;
      font-size:1.8rem;
      font-weight:700;
      letter-spacing:-.04em;
    }

    .score-card .hint{
      margin-top:4px;
      color:var(--muted);
      font-size:.82rem;
    }

    .bars{
      display:grid;
      gap:12px;
      margin-top:16px;
    }

    .bar{
      display:grid;
      grid-template-columns:148px 1fr 42px;
      align-items:center;
      gap:12px;
      color:var(--muted);
      font-size:.9rem;
    }

    .track{
      height:12px;
      border-radius:999px;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.07);
      overflow:hidden;
      position:relative;
    }

    .fill{
      position:absolute;
      inset:0 auto 0 0;
      width:0;
      border-radius:inherit;
      background:linear-gradient(90deg, rgba(111,214,255,.82), rgba(143,115,255,.84), rgba(216,126,255,.78));
      box-shadow:0 0 22px rgba(143,115,255,.28);
      transition:width .28s ease;
    }

    .snapshot{
      margin-top:16px;
      display:grid;
      grid-template-columns:1.2fr .8fr;
      gap:12px;
    }

    .card{
      border-radius:18px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.03);
      padding:15px;
    }

    .card h4{
      margin:0 0 8px;
      font-size:.95rem;
      letter-spacing:-.02em;
    }

    .card p{
      margin:0;
      color:var(--muted);
      line-height:1.65;
    }

    .tag-cloud,
    .memory-cloud,
    .concept-grid,
    .feedback-row,
    .meta-row{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
    }

    .tag-chip,
    .memory-chip,
    .feedback-pill,
    .concept-chip,
    .meta-pill{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:10px 12px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.04);
      color:var(--muted);
      font-size:.85rem;
    }

    .feedback-pill,
    .concept-chip{
      cursor:pointer;
      transition:.2s ease;
    }

    .feedback-pill:hover,
    .feedback-pill.active,
    .concept-chip:hover,
    .concept-chip.active{
      color:var(--text);
      background:linear-gradient(135deg, rgba(111,214,255,.14), rgba(143,115,255,.12));
      border-color:var(--line-strong);
    }

    .narrative,
    .inspector,
    .empty,
    .learning-grid .pane,
    .mut,
    .history-item,
    .evidence-item,
    .log-item{
      border-radius:18px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.03);
    }

    .narrative,
    .inspector,
    .empty{
      padding:16px;
      line-height:1.72;
      color:var(--muted);
    }

    .mutation-grid,
    .history-list,
    .evidence-list,
    .log-list,
    .probe-grid{
      display:grid;
      gap:12px;
      margin-top:14px;
    }

    .mutation-grid{
      grid-template-columns:repeat(2, minmax(0,1fr));
    }

    .mut,
    .history-item,
    .evidence-item,
    .log-item,
    .learning-grid .pane{
      padding:14px;
    }

    .mut code,
    .history-item code{
      display:block;
      color:#f3f7ff;
      font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      line-height:1.55;
      word-break:break-word;
    }

    .mut span,
    .history-item span,
    .evidence-item span,
    .log-item span,
    .learning-grid .pane span{
      display:block;
      color:var(--muted);
      margin-top:8px;
      line-height:1.58;
      font-size:.88rem;
    }

    .history-head{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:12px;
    }

    .tiny{
      color:var(--soft);
      font-size:.78rem;
    }

    .learning-grid{
      display:grid;
      grid-template-columns:repeat(2, minmax(0,1fr));
      gap:12px;
      margin-top:14px;
    }

    .learning-grid .pane strong{
      display:block;
      font-size:.94rem;
      letter-spacing:-.02em;
    }

    .footer{
      margin-top:18px;
      padding:16px 18px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      flex-wrap:wrap;
      color:var(--soft);
      background:rgba(7,12,25,.5);
    }

    .toast{
      position:fixed;
      left:50%;
      bottom:18px;
      transform:translateX(-50%) translateY(18px);
      min-width:min(460px, calc(100% - 24px));
      max-width:min(560px, calc(100% - 24px));
      padding:13px 16px;
      border-radius:18px;
      border:1px solid rgba(255,255,255,.09);
      background:rgba(8,13,28,.88);
      color:var(--text);
      box-shadow:var(--shadow);
      opacity:0;
      pointer-events:none;
      transition:.24s ease;
      z-index:40;
      backdrop-filter:blur(12px);
    }

    .toast.show{
      opacity:1;
      transform:translateX(-50%) translateY(0);
    }

    @media (max-width: 900px){
      .headline,
      .snapshot,
      .learning-grid,
      .mutation-grid,
      .score-grid{grid-template-columns:1fr}
      .bar{grid-template-columns:1fr}
    }

    @media (max-width: 720px){
      .app{width:min(100% - 14px, 1120px)}
      .topbar,
      .statusline,
      .surface-head{align-items:flex-start; flex-direction:column}
      .topbar-actions,
      .status-right{justify-content:flex-start}
      .workspace{padding:18px}
      .surface{padding:10px}
      .headline h2{max-width:none}
      .headline p{justify-self:start}
      .toolrow{align-items:stretch}
      .toolrow .button{width:100%; text-align:center}
    }
  </style>
</head>
<body>
  <canvas id="bg"></canvas>
  <div class="glow"></div>
  <div class="noise"></div>

  <div class="app">
    <header class="topbar">
      <div class="brand">
        <div class="mark">C46</div>
        <div>
          <h1>CTRL46 Research Interface</h1>
          <p>Refined single-surface workspace with local analysis memory and a quiet learning loop.</p>
        </div>
      </div>
      <div class="topbar-actions">
        <button class="button subtle" id="loadDemoTop">Load demo</button>
        <button class="button primary" id="analyzeTop">Analyze</button>
      </div>
    </header>

    <main class="workspace">
      <div class="eyebrow">case file: ctrl46 / search friction / token anomalies</div>

      <div class="headline">
        <h2><span class="grad">One specimen.</span> One instrument.</h2>
        <p>
          The interface now behaves more like a field tool than a dashboard. Drop a specimen once, read a single structured output surface, and let the local loop quietly bias future passes from saved usage.
        </p>
      </div>

      <div class="input-wrap">
        <div class="input-shell">
          <div class="input-meta">
            <span>Primary specimen input</span>
            <span class="mono">baseline: "Hello world"</span>
          </div>
          <textarea id="consoleInput" class="mono" placeholder='Example: <ctrl46><ctrl94> \u0C3E\u0C17,'></textarea>
        </div>

        <div class="toolrow">
          <button class="button primary" id="analyzeBtn">Analyze specimen</button>
          <button class="button subtle" id="saveNoteBtn">Save result</button>
          <button class="button subtle" id="seedConsole">Insert demo</button>
          <button class="button subtle" id="toggleLoopBtn">AI loop off</button>
          <button class="button subtle" id="runLoopBtn">Run cycle</button>
          <div class="spacer"></div>
          <button class="button subtle" id="exportData">Export</button>
          <button class="button subtle" id="clearData">Clear local data</button>
        </div>
      </div>

      <div class="statusline">
        <div class="status-left">
          <span class="chip" id="agentStatusBadge"><b>Loop</b> idle</span>
          <span class="chip" id="agentCycleBadge"><b>Cycles</b> 0</span>
          <span class="chip" id="agentDominantBadge"><b>Dominant</b> none</span>
          <span class="chip" id="entryCountChip"><b>Saved</b> <span id="entryCount">0</span></span>
        </div>
        <div class="status-right">
          <span class="chip"><b>Last mode</b> <span id="lastMode">none</span></span>
          <span class="chip"><b>Weights</b> <span id="agentWeightsInline">0.34 / 0.28 / 0.38</span></span>
        </div>
      </div>
    </main>

    <section class="surface">
      <div class="surface-head">
        <div>
          <h3>Analysis surface</h3>
          <p>Scores, interpretations, evidence, mutations, local history, and model concepts live here in a single expandable flow.</p>
        </div>
        <div class="meta-row">
          <span class="meta-pill" id="currentModeMeta">mode: none</span>
          <span class="meta-pill" id="currentTimeMeta">awaiting specimen</span>
        </div>
      </div>

      <details class="section" open>
        <summary>
          <div class="summary-copy">
            <strong>Signal summary</strong>
            <span>Core scores and a quick snapshot of the current specimen.</span>
          </div>
          <div class="summary-side">
            <span id="summaryFrictionLabel">friction 0</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="score-grid">
            <div class="score-card">
              <div class="label">Control pressure</div>
              <div class="value" id="scoreControl">0</div>
              <div class="hint">Structure and ctrl-tag density</div>
            </div>
            <div class="score-card">
              <div class="label">Unicode mix</div>
              <div class="value" id="scoreUnicode">0</div>
              <div class="hint">Script mixing and non-ASCII load</div>
            </div>
            <div class="score-card">
              <div class="label">Pipeline oddity</div>
              <div class="value" id="scorePipeline">0</div>
              <div class="hint">Cross-layer handling pressure</div>
            </div>
            <div class="score-card">
              <div class="label">Friction sketch</div>
              <div class="value" id="scoreFriction">0</div>
              <div class="hint">Overall anomaly read</div>
            </div>
          </div>

          <div class="bars">
            <div class="bar">
              <span>Structure</span>
              <div class="track"><div class="fill" id="barStructure"></div></div>
              <span id="valStructure">0</span>
            </div>
            <div class="bar">
              <span>Unicode</span>
              <div class="track"><div class="fill" id="barUnicode"></div></div>
              <span id="valUnicode">0</span>
            </div>
            <div class="bar">
              <span>Pipeline</span>
              <div class="track"><div class="fill" id="barPipeline"></div></div>
              <span id="valPipeline">0</span>
            </div>
            <div class="bar">
              <span>Friction</span>
              <div class="track"><div class="fill" id="barFriction"></div></div>
              <span id="valFriction">0</span>
            </div>
          </div>

          <div class="snapshot">
            <div class="card">
              <h4>Specimen snapshot</h4>
              <p id="specimenSnapshot">Analyze a specimen to populate the snapshot.</p>
            </div>
            <div class="card">
              <h4>Current read</h4>
              <p id="summaryRead">The surface is waiting for a specimen.</p>
            </div>
          </div>
        </div>
      </details>

      <details class="section" open>
        <summary>
          <div class="summary-copy">
            <strong>Tags and narrative</strong>
            <span>Descriptive tags, interpretation, and user feedback for the current pass.</span>
          </div>
          <div class="summary-side">
            <span id="tagCountMeta">0 tags</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="tag-cloud" id="tagCloud"></div>
          <div class="narrative" id="narrativeBox" style="margin-top:14px">Analyze a specimen and the narrative will appear here.</div>
          <div class="feedback-row" id="feedbackRow" style="margin-top:14px">
            <button class="feedback-pill" data-feedback="stronger">Stronger than expected</button>
            <button class="feedback-pill" data-feedback="accurate">About right</button>
            <button class="feedback-pill" data-feedback="weaker">Weaker than expected</button>
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Mutation suggestions</strong>
            <span>Compact next variants for paired testing and boundary checks.</span>
          </div>
          <div class="summary-side">
            <span id="mutationCountMeta">0 variants</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="mutation-grid" id="mutationGrid">
            <div class="empty">
              No mutations yet. Analyze a specimen first.
            </div>
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Learning state</strong>
            <span>The loop stays quiet by default, but its memory, hypotheses, and probes can be inspected here.</span>
          </div>
          <div class="summary-side">
            <span id="agentReadText">No saved entries yet.</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="learning-grid">
            <div class="pane">
              <strong>Session memory</strong>
              <span id="agentWeightsText">structure 0.34, unicode 0.28, pipeline 0.38</span>
              <div class="memory-cloud" id="agentMemoryCloud" style="margin-top:12px">
                <span class="memory-chip"><b>memory</b> empty</span>
              </div>
            </div>
            <div class="pane">
              <strong>Working hypothesis</strong>
              <span id="agentHypothesisBox">The loop has not built a working hypothesis yet.</span>
            </div>
          </div>

          <div class="probe-grid" id="agentProbeGrid">
            <div class="mut">
              <code>No next probes yet.</code>
              <span>Run a cycle and the loop will suggest where to poke next.</span>
            </div>
          </div>

          <div class="log-list" id="agentLogList">
            <div class="log-item">
              <span>No loop activity yet.</span>
            </div>
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Evidence notes</strong>
            <span>Compact conceptual anchors for why the specimen family is interesting.</span>
          </div>
          <div class="summary-side">
            <span>4 notes</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="evidence-list" id="evidenceList">
            <div class="evidence-item">
              <code class="mono">&lt;ctrl0000&gt; / &lt;ctrl0001&gt;</code>
              <span>Bracketed numbering feels more like internal residue or scheme-like markup than casual text noise.</span>
            </div>
            <div class="evidence-item">
              <code class="mono">"Hello world"</code>
              <span>A calm baseline matters because the asymmetry between ordinary handling and irregular handling is often the real signal.</span>
            </div>
            <div class="evidence-item">
              <code class="mono">&lt;ctrl46&gt;&lt;ctrl94&gt; \u0C3E\u0C17,</code>
              <span>Mixed control tags and Unicode are useful because they stress encoding, normalization, escaping, tokenization, and search indexing at once.</span>
            </div>
            <div class="evidence-item">
              <code class="mono">cross-layer handoff</code>
              <span>The anomaly may not live in one layer. Small assumptions can collide at tokenizer, moderation, transport, and index boundaries.</span>
            </div>
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Model concepts</strong>
            <span>Click a concept to inspect the current conceptual map without orbit theatrics.</span>
          </div>
          <div class="summary-side">
            <span>6 concepts</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="concept-grid" id="conceptGrid">
            <button class="concept-chip active" data-copy="Tokenizer pressure: unusual delimiters and mixed scripts may split or fuse in unstable ways.">Tokenizer pressure</button>
            <button class="concept-chip" data-copy="Normalization drift: search or ingestion layers may rewrite the probe before it is truly searched.">Normalization drift</button>
            <button class="concept-chip" data-copy="Safety interception: a strange string can trip classifier or policy branches without looking obviously unsafe.">Safety interception</button>
            <button class="concept-chip" data-copy="Index mismatch: stored text and incoming query text may not survive the same transformation path.">Index mismatch</button>
            <button class="concept-chip" data-copy="Transport escaping: the glitch can begin before search, in quoting, encoding, or parameter handling.">Transport escaping</button>
            <button class="concept-chip" data-copy="Cross-layer resonance: no single bug, just several small assumptions colliding at once.">Cross-layer resonance</button>
          </div>
          <div class="inspector" id="modelInspector" style="margin-top:14px">
            Tokenizer pressure: unusual delimiters and mixed scripts may split or fuse in unstable ways.
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Session history</strong>
            <span>Saved runs only. The loop learns from what survives here.</span>
          </div>
          <div class="summary-side">
            <span id="historyCountMeta">0 saved</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="history-list" id="sessionList">
            <div class="empty">No saved session entries yet.</div>
          </div>
        </div>
      </details>
    </section>

    <footer class="footer">
      <div>CTRL46 Research Interface, refined workspace edition.</div>
      <div>Single-file HTML, offline-capable, localStorage-backed, no external dependencies.</div>
    </footer>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');
    const bgState = { dots: [] };

    function resizeCanvas(){
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const count = Math.min(54, Math.floor(window.innerWidth / 26));
      bgState.dots = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + .5,
        vx: (Math.random() - .5) * .1,
        vy: (Math.random() - .5) * .1,
        a: Math.random() * .45 + .12
      }));
    }

    function drawBg(){
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for(const d of bgState.dots){
        d.x += d.vx;
        d.y += d.vy;
        if(d.x < -20) d.x = window.innerWidth + 20;
        if(d.x > window.innerWidth + 20) d.x = -20;
        if(d.y < -20) d.y = window.innerHeight + 20;
        if(d.y > window.innerHeight + 20) d.y = -20;
      }

      for(let i = 0; i < bgState.dots.length; i++){
        const a = bgState.dots[i];
        ctx.beginPath();
        ctx.fillStyle = \`rgba(155, 214, 255, \${a.a})\`;
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for(let j = i + 1; j < bgState.dots.length; j++){
          const b = bgState.dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if(dist < 120){
            ctx.beginPath();
            ctx.strokeStyle = \`rgba(110, 156, 255, \${0.055 * (1 - dist / 120)})\`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawBg);
    }

    resizeCanvas();
    drawBg();
    window.addEventListener('resize', resizeCanvas);

    function getStore(key, fallback){
      try{
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
      } catch {
        return fallback;
      }
    }

    function setStore(key, value){
      localStorage.setItem(key, JSON.stringify(value));
    }

    function escapeHtml(value){
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function showToast(message){
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => toast.classList.remove('show'), 1900);
    }

    const consoleInput = document.getElementById('consoleInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analyzeTop = document.getElementById('analyzeTop');
    const loadDemoTop = document.getElementById('loadDemoTop');
    const seedConsole = document.getElementById('seedConsole');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const toggleLoopBtn = document.getElementById('toggleLoopBtn');
    const runLoopBtn = document.getElementById('runLoopBtn');
    const exportData = document.getElementById('exportData');
    const clearData = document.getElementById('clearData');

    const scoreControl = document.getElementById('scoreControl');
    const scoreUnicode = document.getElementById('scoreUnicode');
    const scorePipeline = document.getElementById('scorePipeline');
    const scoreFriction = document.getElementById('scoreFriction');
    const valStructure = document.getElementById('valStructure');
    const valUnicode = document.getElementById('valUnicode');
    const valPipeline = document.getElementById('valPipeline');
    const valFriction = document.getElementById('valFriction');
    const barStructure = document.getElementById('barStructure');
    const barUnicode = document.getElementById('barUnicode');
    const barPipeline = document.getElementById('barPipeline');
    const barFriction = document.getElementById('barFriction');

    const tagCloud = document.getElementById('tagCloud');
    const narrativeBox = document.getElementById('narrativeBox');
    const mutationGrid = document.getElementById('mutationGrid');
    const sessionList = document.getElementById('sessionList');
    const entryCount = document.getElementById('entryCount');
    const lastMode = document.getElementById('lastMode');
    const currentModeMeta = document.getElementById('currentModeMeta');
    const currentTimeMeta = document.getElementById('currentTimeMeta');
    const historyCountMeta = document.getElementById('historyCountMeta');
    const mutationCountMeta = document.getElementById('mutationCountMeta');
    const tagCountMeta = document.getElementById('tagCountMeta');
    const summaryFrictionLabel = document.getElementById('summaryFrictionLabel');
    const summaryRead = document.getElementById('summaryRead');
    const specimenSnapshot = document.getElementById('specimenSnapshot');

    const agentStatusBadge = document.getElementById('agentStatusBadge');
    const agentCycleBadge = document.getElementById('agentCycleBadge');
    const agentDominantBadge = document.getElementById('agentDominantBadge');
    const agentWeightsInline = document.getElementById('agentWeightsInline');
    const agentWeightsText = document.getElementById('agentWeightsText');
    const agentReadText = document.getElementById('agentReadText');
    const agentMemoryCloud = document.getElementById('agentMemoryCloud');
    const agentHypothesisBox = document.getElementById('agentHypothesisBox');
    const agentProbeGrid = document.getElementById('agentProbeGrid');
    const agentLogList = document.getElementById('agentLogList');

    const feedbackButtons = [...document.querySelectorAll('[data-feedback]')];
    const conceptButtons = [...document.querySelectorAll('.concept-chip')];
    const modelInspector = document.getElementById('modelInspector');

    let currentAnalysis = null;
    let agentTimer = null;

    function defaultAgentState(){
      return {
        enabled: false,
        cycles: 0,
        weights: { structure: 0.34, unicode: 0.28, pipeline: 0.38 },
        memory: {},
        hypotheses: [],
        nextProbes: [],
        log: [],
        dominant: 'none',
        lastRun: null
      };
    }

    function normalizeWeights(weights){
      const total = Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;
      return {
        structure: Number((weights.structure / total).toFixed(3)),
        unicode: Number((weights.unicode / total).toFixed(3)),
        pipeline: Number((weights.pipeline / total).toFixed(3))
      };
    }

    function getAgentState(){
      const stored = getStore('ctrl46_agent_state', defaultAgentState());
      return {
        ...defaultAgentState(),
        ...stored,
        weights: normalizeWeights({ ...defaultAgentState().weights, ...(stored.weights || {}) }),
        memory: stored.memory || {},
        hypotheses: stored.hypotheses || [],
        nextProbes: stored.nextProbes || [],
        log: stored.log || []
      };
    }

    function setAgentState(state){
      state.weights = normalizeWeights(state.weights);
      setStore('ctrl46_agent_state', state);
    }

    function getEntries(){
      return getStore('ctrl46_console_entries', []);
    }

    function setEntries(entries){
      setStore('ctrl46_console_entries', entries);
      renderSession();
    }

    function countMatches(text, regex){
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    }

    function hasNonAscii(text){
      return /[^\0-\x7F]/.test(text);
    }

    function hasCtrlPattern(text){
      return /<ctrld+>/gi.test(text);
    }

    function detectScripts(text){
      const scripts = [];
      if(/[A-Za-z]/.test(text)) scripts.push('latin');
      if(/[\u0C00-\u0C7F]/.test(text)) scripts.push('telugu');
      if(/[^\0-\x7F]/.test(text) && !/[\u0C00-\u0C7F]/.test(text)) scripts.push('other-non-ascii');
      return scripts;
    }

    function clamp(n){
      return Math.max(0, Math.min(100, Math.round(n)));
    }

    function buildMutations(text){
      const trimmed = text.trim();
      const mutations = [
        { value: \`"\${trimmed}"\`, note: 'Quoted variant to test literal handling and normalization.' },
        { value: trimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;'), note: 'Escaped angle brackets for transport and rendering checks.' },
        { value: trimmed.replace(/></g, '> <'), note: 'Spaced tags to probe token boundary changes.' },
        { value: trimmed.toLowerCase(), note: 'Lowercase normalization probe.' }
      ];
      if(/[^\0-\x7F]/.test(trimmed)){
        mutations.push({
          value: trimmed.replace(/[^\0-\x7F]/g, ''),
          note: 'Unicode-stripped variant to isolate whether non-ASCII characters are part of the pressure.'
        });
      }
      return mutations.slice(0, 4);
    }

    function analyzeSpecimen(text){
      const clean = text.trim();
      const ctrlCount = countMatches(clean, /<ctrld+>/gi);
      const angleCount = countMatches(clean, /[<>]/g);
      const quoteCount = countMatches(clean, /["'\`]/g);
      const punctuationCount = countMatches(clean, /[.,;:!?()[]{}\\/_-]/g);
      const nonAscii = countMatches(clean, /[^\0-\x7F]/g);
      const length = clean.length;
      const scripts = detectScripts(clean);
      const mixedScripts = scripts.length > 1;
      const structure = clamp(ctrlCount * 24 + angleCount * 4 + Math.min(length, 40) * 0.4 + (hasCtrlPattern(clean) ? 18 : 0));
      const unicode = clamp(nonAscii * 8 + (mixedScripts ? 34 : 0) + (hasNonAscii(clean) ? 18 : 0));

      const agent = getAgentState();
      const weights = agent.weights;

      const pipeline = clamp(
        structure * (0.22 + weights.structure * 0.55) +
        unicode * (0.18 + weights.unicode * 0.62) +
        quoteCount * 8 +
        punctuationCount * 2 +
        (mixedScripts ? 8 : 0)
      );

      const friction = clamp(
        structure * (weights.structure + 0.08) +
        unicode * (weights.unicode + 0.05) +
        pipeline * (weights.pipeline + 0.07)
      );

      const tags = [];
      if(ctrlCount) tags.push(\`ctrl-tags:\${ctrlCount}\`);
      if(mixedScripts) tags.push('mixed-script');
      if(hasNonAscii(clean)) tags.push('non-ascii');
      if(quoteCount) tags.push('quoted-or-escapable');
      if(length > 20) tags.push('longer-specimen');
      if(pipeline > 70) tags.push('high-pipeline-pressure');
      if(friction > 70) tags.push('strong-friction-candidate');
      if(!tags.length) tags.push('low-structure');

      let mode = 'plain';
      if(ctrlCount && hasNonAscii(clean)) mode = 'ctrl+unicode';
      else if(ctrlCount) mode = 'ctrl-only';
      else if(hasNonAscii(clean)) mode = 'unicode-only';

      let narrative = 'This specimen looks ';
      if(friction > 75) narrative += 'like a strong anomaly candidate. ';
      else if(friction > 45) narrative += 'moderately interesting, with enough structure to justify paired testing. ';
      else narrative += 'relatively mild, though it may still be useful as a control or comparison sample. ';

      if(ctrlCount) narrative += 'The numbered ctrl-tag pattern suggests internal-style residue rather than casual text noise. ';
      if(mixedScripts) narrative += 'Multiple scripts are present, which can amplify tokenization and normalization pressure. ';
      else if(hasNonAscii(clean)) narrative += 'Non-ASCII characters add some encoding and normalization load. ';
      if(quoteCount || punctuationCount > 3) narrative += 'Its punctuation profile may encourage escaping or rewriting behavior in some pipelines. ';
      if(agent.cycles > 0) narrative += \`The local loop is currently weighting \${agent.dominant || 'mixed'} pressure most heavily, so later analyses may drift as it learns from the session. \`;
      narrative += 'The safest next move is to compare exact handling against a calm baseline and record every rewrite, sanitization, or empty-result shape.';

      return {
        text: clean,
        ctrlCount,
        structure,
        unicode,
        pipeline,
        friction,
        tags,
        mode,
        narrative,
        mutations: buildMutations(clean),
        createdAt: new Date().toISOString(),
        feedback: null
      };
    }

    function dominantKey(weights){
      return Object.entries(weights).sort((a, b) => b[1] - a[1])[0][0];
    }

    function deriveHypotheses(entries, state){
      if(!entries.length){
        return ['No saved entries yet, so the loop has nothing solid to chew on.'];
      }

      const avg = key => entries.reduce((sum, entry) => sum + entry[key], 0) / entries.length;
      const avgStructure = avg('structure');
      const avgUnicode = avg('unicode');
      const avgPipeline = avg('pipeline');
      const hypotheses = [];

      if(avgStructure > 60 && avgUnicode > 45){
        hypotheses.push('The session suggests mixed structural and Unicode pressure working together rather than a single isolated trigger.');
      }
      if(avgPipeline > 65){
        hypotheses.push('Cross-layer handoffs look louder than any one raw feature, which points toward normalization, escaping, or indexing collisions.');
      }
      if(entries.some(entry => entry.feedback === 'stronger')){
        hypotheses.push('User feedback has repeatedly marked outcomes as stronger than expected, so the loop is nudging weights upward around the dominant pattern.');
      }
      if(entries.every(entry => entry.mode === 'ctrl-only' || entry.mode === 'ctrl+unicode')){
        hypotheses.push('The archive leans heavily toward ctrl-tagged strings, which keeps the loop suspicious of internal-style residue.');
      }
      if(!hypotheses.length){
        hypotheses.push('The pattern is still diffuse. The best current reading is that the specimen family is interesting, but not yet sharply localized to one layer.');
      }
      return hypotheses.slice(0, 3);
    }

    function deriveNextProbes(entries){
      if(!entries.length){
        return [{ value: '<ctrl46><ctrl94> \u0C3E\u0C17,', note: 'Seed probe for mixed control and Unicode pressure.' }];
      }
      const latest = entries[0];
      const probes = buildMutations(latest.text).map(mut => ({ value: mut.value, note: mut.note }));
      probes.push({ value: '"Hello world"', note: 'Baseline control for comparison against the latest specimen.' });
      return probes.slice(0, 4);
    }

    function learnFromEntries(entries){
      const state = getAgentState();
      const recent = entries.slice(0, 12);
      if(!recent.length){
        updateLearningSurface(state);
        return state;
      }

      const avgStructure = recent.reduce((sum, e) => sum + e.structure, 0) / recent.length;
      const avgUnicode = recent.reduce((sum, e) => sum + e.unicode, 0) / recent.length;
      const avgPipeline = recent.reduce((sum, e) => sum + e.pipeline, 0) / recent.length;

      let target = normalizeWeights({
        structure: Math.max(0.2, avgStructure / 100),
        unicode: Math.max(0.16, avgUnicode / 100),
        pipeline: Math.max(0.24, avgPipeline / 100)
      });

      if(recent.some(e => e.feedback === 'stronger')){
        const dom = dominantKey(target);
        target[dom] += 0.05;
        target = normalizeWeights(target);
      }

      if(recent.some(e => e.feedback === 'weaker')){
        const dom = dominantKey(target);
        target[dom] = Math.max(0.16, target[dom] - 0.05);
        target = normalizeWeights(target);
      }

      state.weights = normalizeWeights({
        structure: state.weights.structure * 0.74 + target.structure * 0.26,
        unicode: state.weights.unicode * 0.74 + target.unicode * 0.26,
        pipeline: state.weights.pipeline * 0.74 + target.pipeline * 0.26
      });

      state.memory = {};
      recent.forEach(entry => {
        (entry.tags || []).forEach(tag => {
          state.memory[tag] = (state.memory[tag] || 0) + 1;
        });
      });

      state.hypotheses = deriveHypotheses(recent, state);
      state.nextProbes = deriveNextProbes(recent);
      state.dominant = dominantKey(state.weights);
      state.cycles += 1;
      state.lastRun = new Date().toISOString();
      state.log.unshift({ text: \`Cycle \${state.cycles}: dominant \${state.dominant}, weights \${state.weights.structure.toFixed(2)} / \${state.weights.unicode.toFixed(2)} / \${state.weights.pipeline.toFixed(2)}.\` });
      state.log = state.log.slice(0, 18);

      setAgentState(state);
      updateLearningSurface(state);
      return state;
    }

    function setBar(fillEl, valueEl, value){
      fillEl.style.width = \`\${value}%\`;
      valueEl.textContent = value;
    }

    function renderAnalysis(analysis){
      currentAnalysis = analysis;
      scoreControl.textContent = analysis.structure;
      scoreUnicode.textContent = analysis.unicode;
      scorePipeline.textContent = analysis.pipeline;
      scoreFriction.textContent = analysis.friction;

      setBar(barStructure, valStructure, analysis.structure);
      setBar(barUnicode, valUnicode, analysis.unicode);
      setBar(barPipeline, valPipeline, analysis.pipeline);
      setBar(barFriction, valFriction, analysis.friction);

      tagCloud.innerHTML = analysis.tags.map(tag => \`<span class="tag-chip">\${escapeHtml(tag)}</span>\`).join('');
      narrativeBox.textContent = analysis.narrative;
      mutationGrid.innerHTML = analysis.mutations.map(mut => \`
        <div class="mut">
          <code>\${escapeHtml(mut.value)}</code>
          <span>\${escapeHtml(mut.note)}</span>
        </div>
      \`).join('');

      lastMode.textContent = analysis.mode;
      currentModeMeta.textContent = \`mode: \${analysis.mode}\`;
      currentTimeMeta.textContent = new Date(analysis.createdAt).toLocaleString();
      summaryFrictionLabel.textContent = \`friction \${analysis.friction}\`;
      mutationCountMeta.textContent = \`\${analysis.mutations.length} variants\`;
      tagCountMeta.textContent = \`\${analysis.tags.length} tag\${analysis.tags.length === 1 ? '' : 's'}\`;
      specimenSnapshot.textContent = analysis.text;
      summaryRead.textContent = \`Mode \${analysis.mode}. Control \${analysis.structure}, Unicode \${analysis.unicode}, pipeline \${analysis.pipeline}, friction \${analysis.friction}.\`;
      feedbackButtons.forEach(btn => btn.classList.remove('active'));
    }

    function renderSession(){
      const entries = getEntries();
      entryCount.textContent = entries.length;
      historyCountMeta.textContent = \`\${entries.length} saved\`;

      if(!entries.length){
        sessionList.innerHTML = '<div class="empty">No saved session entries yet.</div>';
        return;
      }

      sessionList.innerHTML = entries.map((entry, idx) => \`
        <div class="history-item">
          <div class="history-head">
            <code>\${escapeHtml(entry.text)}</code>
            <span class="tiny">#\${String(idx + 1).padStart(2, '0')}</span>
          </div>
          <span>mode \${escapeHtml(entry.mode)} | control \${entry.structure} | unicode \${entry.unicode} | pipeline \${entry.pipeline} | friction \${entry.friction}\${entry.feedback ? \` | feedback \${escapeHtml(entry.feedback)}\` : ''}</span>
          <span>\${escapeHtml(entry.narrative)}</span>
        </div>
      \`).join('');
    }

    function updateLearningSurface(state = getAgentState()){
      agentStatusBadge.innerHTML = \`<b>Loop</b> \${state.enabled ? 'active' : 'idle'}\`;
      agentCycleBadge.innerHTML = \`<b>Cycles</b> \${state.cycles}\`;
      agentDominantBadge.innerHTML = \`<b>Dominant</b> \${state.dominant || 'none'}\`;
      agentWeightsInline.textContent = \`\${state.weights.structure.toFixed(2)} / \${state.weights.unicode.toFixed(2)} / \${state.weights.pipeline.toFixed(2)}\`;
      agentWeightsText.textContent = \`structure \${state.weights.structure.toFixed(2)}, unicode \${state.weights.unicode.toFixed(2)}, pipeline \${state.weights.pipeline.toFixed(2)}\`;
      toggleLoopBtn.textContent = state.enabled ? 'AI loop on' : 'AI loop off';

      const entries = getEntries();
      if(!entries.length){
        agentReadText.textContent = 'No saved entries yet.';
      } else {
        agentReadText.textContent = \`reading \${entries.length} saved entr\${entries.length === 1 ? 'y' : 'ies'}\`;
      }

      const memoryEntries = Object.entries(state.memory).sort((a, b) => b[1] - a[1]).slice(0, 8);
      agentMemoryCloud.innerHTML = memoryEntries.length
        ? memoryEntries.map(([tag, count]) => \`<span class="memory-chip"><b>\${escapeHtml(tag)}</b>\${count}</span>\`).join('')
        : '<span class="memory-chip"><b>memory</b> empty</span>';

      agentHypothesisBox.textContent = state.hypotheses && state.hypotheses.length
        ? state.hypotheses.join(' ')
        : 'The loop has not built a working hypothesis yet.';

      agentProbeGrid.innerHTML = state.nextProbes && state.nextProbes.length
        ? state.nextProbes.map(probe => \`
          <div class="mut">
            <code>\${escapeHtml(probe.value)}</code>
            <span>\${escapeHtml(probe.note)}</span>
          </div>
        \`).join('')
        : '<div class="mut"><code>No next probes yet.</code><span>Run a cycle and the loop will suggest where to poke next.</span></div>';

      agentLogList.innerHTML = state.log && state.log.length
        ? state.log.map((entry, idx) => \`
          <div class="log-item">
            <span>\${escapeHtml(entry.text)}</span>
            <span class="tiny">\${idx === 0 ? 'latest' : 'log'}</span>
          </div>
        \`).join('')
        : '<div class="log-item"><span>No loop activity yet.</span></div>';
    }

    function saveCurrent(){
      if(!currentAnalysis) return false;
      const entries = getEntries();
      const index = entries.findIndex(entry => entry.createdAt === currentAnalysis.createdAt && entry.text === currentAnalysis.text);
      if(index >= 0){
        entries[index] = { ...currentAnalysis };
      } else {
        entries.unshift({ ...currentAnalysis });
      }
      setEntries(entries.slice(0, 24));
      if(getAgentState().enabled) runAgentCycle();
      return true;
    }

    function runAgentCycle(){
      const entries = getEntries();
      const pool = currentAnalysis ? [currentAnalysis, ...entries] : entries;
      const unique = [];
      const seen = new Set();

      pool.forEach(entry => {
        const key = \`\${entry.text}::\${entry.createdAt || ''}\`;
        if(!seen.has(key)){
          seen.add(key);
          unique.push(entry);
        }
      });

      learnFromEntries(unique);
      if(currentAnalysis){
        renderAnalysis(analyzeSpecimen(currentAnalysis.text));
      }
    }

    function startAgentLoop(){
      const state = getAgentState();
      if(agentTimer) clearInterval(agentTimer);
      if(!state.enabled) return;
      agentTimer = setInterval(runAgentCycle, 8000);
    }

    function toggleAgentLoop(){
      const state = getAgentState();
      state.enabled = !state.enabled;
      state.log.unshift({ text: state.enabled ? 'Loop switched on.' : 'Loop switched off.' });
      state.log = state.log.slice(0, 18);
      setAgentState(state);
      if(state.enabled){
        startAgentLoop();
        runAgentCycle();
        showToast('Learning loop enabled.');
      } else {
        if(agentTimer){
          clearInterval(agentTimer);
          agentTimer = null;
        }
        updateLearningSurface(state);
        showToast('Learning loop disabled.');
      }
    }

    function applyFeedback(kind){
      if(!currentAnalysis) return;
      currentAnalysis.feedback = kind;
      feedbackButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.feedback === kind));

      const state = getAgentState();
      if(kind === 'stronger'){
        state.weights = normalizeWeights({
          structure: state.weights.structure + 0.02,
          unicode: state.weights.unicode + (currentAnalysis.unicode > 20 ? 0.02 : 0),
          pipeline: state.weights.pipeline + 0.03
        });
        state.log.unshift({ text: 'Feedback: stronger than expected. Weights nudged upward around the dominant pattern.' });
      } else if(kind === 'weaker'){
        const dom = dominantKey(state.weights);
        state.weights[dom] = Math.max(0.16, state.weights[dom] - 0.04);
        state.weights = normalizeWeights(state.weights);
        state.log.unshift({ text: 'Feedback: weaker than expected. Dominant weight trimmed back slightly.' });
      } else {
        state.log.unshift({ text: 'Feedback: about right. Current weighting reinforced lightly.' });
      }

      state.log = state.log.slice(0, 18);
      setAgentState(state);
      updateLearningSurface(state);
      showToast('Feedback applied to the current analysis. Save to commit it to history.');
    }

    function analyzeCurrent(){
      const value = consoleInput.value.trim();
      if(!value){
        showToast('Paste or type a specimen first.');
        return;
      }
      renderAnalysis(analyzeSpecimen(value));
      if(getAgentState().enabled) runAgentCycle();
      showToast('Specimen analyzed.');
    }

    function insertDemo(){
      consoleInput.value = '<ctrl46><ctrl94> \u0C3E\u0C17,';
      analyzeCurrent();
    }

    function exportPayload(){
      const payload = { entries: getEntries(), agent: getAgentState() };
      if(currentAnalysis) payload.current = currentAnalysis;
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'ctrl46-research-export.json';
      a.click();
      URL.revokeObjectURL(a.href);
      showToast('Local data exported as JSON.');
    }

    function resetSurface(){
      currentAnalysis = null;
      ['scoreControl', 'scoreUnicode', 'scorePipeline', 'scoreFriction'].forEach(id => document.getElementById(id).textContent = '0');
      setBar(barStructure, valStructure, 0);
      setBar(barUnicode, valUnicode, 0);
      setBar(barPipeline, valPipeline, 0);
      setBar(barFriction, valFriction, 0);
      tagCloud.innerHTML = '';
      narrativeBox.textContent = 'Analyze a specimen and the narrative will appear here.';
      mutationGrid.innerHTML = '<div class="empty">No mutations yet. Analyze a specimen first.</div>';
      specimenSnapshot.textContent = 'Analyze a specimen to populate the snapshot.';
      summaryRead.textContent = 'The surface is waiting for a specimen.';
      summaryFrictionLabel.textContent = 'friction 0';
      mutationCountMeta.textContent = '0 variants';
      tagCountMeta.textContent = '0 tags';
      lastMode.textContent = 'none';
      currentModeMeta.textContent = 'mode: none';
      currentTimeMeta.textContent = 'awaiting specimen';
      feedbackButtons.forEach(btn => btn.classList.remove('active'));
    }

    function clearAllData(){
      localStorage.removeItem('ctrl46_console_entries');
      localStorage.removeItem('ctrl46_agent_state');
      if(agentTimer){
        clearInterval(agentTimer);
        agentTimer = null;
      }
      renderSession();
      updateLearningSurface(defaultAgentState());
      resetSurface();
      showToast('Local session data cleared.');
    }

    feedbackButtons.forEach(btn => {
      btn.addEventListener('click', () => applyFeedback(btn.dataset.feedback));
    });

    conceptButtons.forEach(button => {
      button.addEventListener('click', () => {
        conceptButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        modelInspector.textContent = button.dataset.copy;
      });
    });

    analyzeBtn.addEventListener('click', analyzeCurrent);
    analyzeTop.addEventListener('click', analyzeCurrent);
    loadDemoTop.addEventListener('click', insertDemo);
    seedConsole.addEventListener('click', insertDemo);

    saveNoteBtn.addEventListener('click', () => {
      if(!currentAnalysis){
        showToast('Analyze a specimen before saving.');
        return;
      }
      saveCurrent();
      showToast('Result saved to local session history.');
    });

    toggleLoopBtn.addEventListener('click', toggleAgentLoop);
    runLoopBtn.addEventListener('click', () => {
      runAgentCycle();
      showToast('Learning cycle completed.');
    });
    exportData.addEventListener('click', exportPayload);
    clearData.addEventListener('click', clearAllData);

    consoleInput.addEventListener('keydown', (event) => {
      if((event.metaKey || event.ctrlKey) && event.key === 'Enter'){
        event.preventDefault();
        analyzeCurrent();
      }
    });

    renderSession();
    updateLearningSurface(getAgentState());
    resetSurface();
    if(getAgentState().enabled) startAgentLoop();
  <\/script>
</body>
</html>
`], [`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CTRL46 Research Interface | Refined Workspace</title>
  <style>
    :root{
      --bg:#050814;
      --bg2:#071022;
      --panel:rgba(12,18,34,.72);
      --panel-strong:rgba(15,22,40,.88);
      --line:rgba(144,179,255,.12);
      --line-strong:rgba(144,179,255,.22);
      --text:#edf2ff;
      --muted:#9faecc;
      --soft:#7784a3;
      --cyan:#6fd6ff;
      --blue:#5f84ff;
      --violet:#8f73ff;
      --pink:#d87eff;
      --green:#71ffc8;
      --amber:#ffd57a;
      --danger:#ff8ca8;
      --shadow:0 22px 70px rgba(0,0,0,.36);
      --radius:28px;
      --radius-sm:18px;
      --chip:rgba(255,255,255,.04);
      --grid:rgba(255,255,255,.022);
    }

    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0;
      min-height:100vh;
      color:var(--text);
      font-family:Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      background:
        radial-gradient(circle at 18% 10%, rgba(95,132,255,.16), transparent 28%),
        radial-gradient(circle at 85% 18%, rgba(216,126,255,.11), transparent 24%),
        radial-gradient(circle at 50% 76%, rgba(111,214,255,.08), transparent 28%),
        linear-gradient(180deg, var(--bg) 0%, var(--bg2) 46%, var(--bg) 100%);
      overflow-x:hidden;
    }

    body::before{
      content:"";
      position:fixed;
      inset:0;
      background-image:
        linear-gradient(var(--grid) 1px, transparent 1px),
        linear-gradient(90deg, var(--grid) 1px, transparent 1px);
      background-size:42px 42px;
      pointer-events:none;
      mask-image:linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,.02));
    }

    canvas,.glow,.noise{
      position:fixed;
      inset:0;
      pointer-events:none;
    }

    .glow{
      background:
        radial-gradient(circle at 30% 12%, rgba(111,214,255,.08), transparent 28%),
        radial-gradient(circle at 72% 34%, rgba(143,115,255,.08), transparent 26%),
        radial-gradient(circle at 58% 82%, rgba(216,126,255,.06), transparent 24%);
      filter:blur(40px);
      opacity:.85;
      animation:pulse 12s ease-in-out infinite alternate;
    }

    .noise{
      opacity:.028;
      background-image:
        radial-gradient(circle at 22% 34%, rgba(255,255,255,.7) 0 .8px, transparent 1.2px),
        radial-gradient(circle at 70% 64%, rgba(255,255,255,.55) 0 .7px, transparent 1.2px),
        radial-gradient(circle at 40% 80%, rgba(255,255,255,.4) 0 .8px, transparent 1.3px);
      background-size:160px 160px, 190px 190px, 210px 210px;
      mix-blend-mode:screen;
      animation:drift 26s linear infinite;
    }

    @keyframes pulse{
      from{transform:scale(1) translateY(0)}
      to{transform:scale(1.04) translateY(-8px)}
    }

    @keyframes drift{
      from{transform:translate3d(0,0,0) scale(1)}
      to{transform:translate3d(-42px, 22px, 0) scale(1.05)}
    }

    .app{
      position:relative;
      z-index:2;
      width:min(1120px, calc(100% - 24px));
      margin:0 auto;
      padding:18px 0 36px;
    }

    .topbar{
      position:sticky;
      top:14px;
      z-index:20;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      padding:14px 16px;
      border-radius:24px;
      border:1px solid var(--line);
      background:rgba(7,12,25,.62);
      backdrop-filter:blur(18px);
      box-shadow:var(--shadow);
    }

    .brand{
      display:flex;
      align-items:center;
      gap:12px;
      min-width:0;
    }

    .mark{
      width:46px;
      height:46px;
      border-radius:15px;
      display:grid;
      place-items:center;
      font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size:.82rem;
      letter-spacing:.08em;
      color:var(--cyan);
      background:
        linear-gradient(135deg, rgba(111,214,255,.22), rgba(95,132,255,.14)),
        rgba(255,255,255,.04);
      border:1px solid var(--line-strong);
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.04), 0 0 22px rgba(111,214,255,.12);
    }

    .brand h1{
      margin:0;
      font-size:1rem;
      letter-spacing:.04em;
      font-weight:650;
    }

    .brand p{
      margin:2px 0 0;
      color:var(--muted);
      font-size:.8rem;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width:320px;
    }

    .topbar-actions{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
      justify-content:flex-end;
    }

    button,input,textarea{font:inherit}

    .button{
      appearance:none;
      border:none;
      border-radius:999px;
      padding:11px 14px;
      color:var(--text);
      background:transparent;
      border:1px solid transparent;
      cursor:pointer;
      transition:.22s ease;
      text-decoration:none;
    }

    .button:hover{
      transform:translateY(-1px);
      background:rgba(255,255,255,.04);
      border-color:var(--line-strong);
    }

    .button.primary{
      background:linear-gradient(135deg, rgba(111,214,255,.18), rgba(95,132,255,.20));
      border-color:rgba(111,214,255,.24);
      box-shadow:0 12px 28px rgba(95,132,255,.16);
    }

    .button.subtle{
      color:var(--muted);
      border-color:rgba(255,255,255,.06);
      background:rgba(255,255,255,.02);
    }

    .workspace,
    .surface,
    .statusline,
    .footer{
      border-radius:var(--radius);
      border:1px solid var(--line);
      background:
        linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.018)),
        var(--panel);
      box-shadow:var(--shadow);
    }

    .workspace{
      margin-top:18px;
      padding:26px;
      position:relative;
      overflow:hidden;
    }

    .workspace::before{
      content:"";
      position:absolute;
      width:260px;
      height:260px;
      right:-80px;
      top:-80px;
      background:radial-gradient(circle, rgba(111,214,255,.13), transparent 70%);
      filter:blur(12px);
      pointer-events:none;
    }

    .eyebrow{
      display:inline-flex;
      align-items:center;
      gap:10px;
      padding:8px 12px;
      border-radius:999px;
      border:1px solid var(--line-strong);
      background:rgba(255,255,255,.03);
      color:var(--muted);
      font-size:.78rem;
      letter-spacing:.06em;
      text-transform:uppercase;
    }

    .eyebrow::before{
      content:"";
      width:8px;
      height:8px;
      border-radius:50%;
      background:var(--green);
      box-shadow:0 0 16px rgba(113,255,200,.55);
    }

    .headline{
      display:grid;
      grid-template-columns:1.12fr .88fr;
      gap:24px;
      align-items:end;
      margin-top:18px;
    }

    .headline h2{
      margin:0;
      font-size:clamp(2rem, 5vw, 3.7rem);
      line-height:.96;
      letter-spacing:-.05em;
      max-width:11ch;
    }

    .headline .grad{
      background:linear-gradient(135deg, #ffffff 8%, #a7ddff 40%, #b09eff 70%, #ffd3fd 100%);
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent;
    }

    .headline p{
      margin:0;
      color:var(--muted);
      line-height:1.7;
      max-width:58ch;
      justify-self:end;
    }

    .input-wrap{
      margin-top:22px;
      display:grid;
      gap:14px;
    }

    .input-shell{
      position:relative;
      border-radius:24px;
      border:1px solid rgba(255,255,255,.10);
      background:rgba(255,255,255,.035);
      overflow:hidden;
    }

    .input-meta{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:14px 16px 0;
      color:var(--soft);
      font-size:.8rem;
    }

    .mono{font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace}

    textarea{
      width:100%;
      min-height:156px;
      resize:vertical;
      border:none;
      outline:none;
      background:transparent;
      color:var(--text);
      padding:14px 16px 18px;
      font-size:1rem;
      line-height:1.65;
    }

    .toolrow{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
    }

    .toolrow .spacer{flex:1 1 auto}

    .statusline{
      margin-top:14px;
      padding:14px 16px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      flex-wrap:wrap;
    }

    .status-left,
    .status-right{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
    }

    .chip{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:9px 12px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.08);
      background:var(--chip);
      color:var(--muted);
      font-size:.84rem;
    }

    .chip b{
      color:var(--text);
      font-weight:600;
    }

    .surface{
      margin-top:18px;
      padding:12px;
    }

    .surface-head{
      padding:16px 16px 10px;
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:16px;
      flex-wrap:wrap;
    }

    .surface-head h3{
      margin:0;
      font-size:1.16rem;
      letter-spacing:-.02em;
    }

    .surface-head p{
      margin:6px 0 0;
      color:var(--muted);
      line-height:1.6;
      max-width:58ch;
    }

    .section{
      border-radius:22px;
      border:1px solid rgba(255,255,255,.07);
      background:rgba(255,255,255,.025);
      margin-top:10px;
      overflow:hidden;
    }

    details.section > summary{
      list-style:none;
      cursor:pointer;
      padding:16px 16px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      user-select:none;
    }

    details.section > summary::-webkit-details-marker{display:none}

    .summary-copy strong{
      display:block;
      font-size:1rem;
      letter-spacing:-.02em;
    }

    .summary-copy span{
      display:block;
      margin-top:4px;
      color:var(--muted);
      font-size:.88rem;
      line-height:1.5;
    }

    .summary-side{
      display:flex;
      align-items:center;
      gap:10px;
      flex-wrap:wrap;
      justify-content:flex-end;
      color:var(--soft);
      font-size:.8rem;
    }

    .chev{
      transition:.2s ease;
      color:var(--soft);
      font-size:1rem;
    }

    details[open] .chev{transform:rotate(180deg)}

    .section-body{
      padding:0 16px 16px;
      border-top:1px solid rgba(255,255,255,.06);
    }

    .score-grid{
      display:grid;
      grid-template-columns:repeat(4, minmax(0,1fr));
      gap:12px;
      margin-top:16px;
    }

    .score-card{
      border-radius:18px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.03);
      padding:15px;
    }

    .score-card .label{
      color:var(--soft);
      font-size:.78rem;
      text-transform:uppercase;
      letter-spacing:.08em;
    }

    .score-card .value{
      margin-top:8px;
      font-size:1.8rem;
      font-weight:700;
      letter-spacing:-.04em;
    }

    .score-card .hint{
      margin-top:4px;
      color:var(--muted);
      font-size:.82rem;
    }

    .bars{
      display:grid;
      gap:12px;
      margin-top:16px;
    }

    .bar{
      display:grid;
      grid-template-columns:148px 1fr 42px;
      align-items:center;
      gap:12px;
      color:var(--muted);
      font-size:.9rem;
    }

    .track{
      height:12px;
      border-radius:999px;
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.07);
      overflow:hidden;
      position:relative;
    }

    .fill{
      position:absolute;
      inset:0 auto 0 0;
      width:0;
      border-radius:inherit;
      background:linear-gradient(90deg, rgba(111,214,255,.82), rgba(143,115,255,.84), rgba(216,126,255,.78));
      box-shadow:0 0 22px rgba(143,115,255,.28);
      transition:width .28s ease;
    }

    .snapshot{
      margin-top:16px;
      display:grid;
      grid-template-columns:1.2fr .8fr;
      gap:12px;
    }

    .card{
      border-radius:18px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.03);
      padding:15px;
    }

    .card h4{
      margin:0 0 8px;
      font-size:.95rem;
      letter-spacing:-.02em;
    }

    .card p{
      margin:0;
      color:var(--muted);
      line-height:1.65;
    }

    .tag-cloud,
    .memory-cloud,
    .concept-grid,
    .feedback-row,
    .meta-row{
      display:flex;
      flex-wrap:wrap;
      gap:10px;
    }

    .tag-chip,
    .memory-chip,
    .feedback-pill,
    .concept-chip,
    .meta-pill{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:10px 12px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.04);
      color:var(--muted);
      font-size:.85rem;
    }

    .feedback-pill,
    .concept-chip{
      cursor:pointer;
      transition:.2s ease;
    }

    .feedback-pill:hover,
    .feedback-pill.active,
    .concept-chip:hover,
    .concept-chip.active{
      color:var(--text);
      background:linear-gradient(135deg, rgba(111,214,255,.14), rgba(143,115,255,.12));
      border-color:var(--line-strong);
    }

    .narrative,
    .inspector,
    .empty,
    .learning-grid .pane,
    .mut,
    .history-item,
    .evidence-item,
    .log-item{
      border-radius:18px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(255,255,255,.03);
    }

    .narrative,
    .inspector,
    .empty{
      padding:16px;
      line-height:1.72;
      color:var(--muted);
    }

    .mutation-grid,
    .history-list,
    .evidence-list,
    .log-list,
    .probe-grid{
      display:grid;
      gap:12px;
      margin-top:14px;
    }

    .mutation-grid{
      grid-template-columns:repeat(2, minmax(0,1fr));
    }

    .mut,
    .history-item,
    .evidence-item,
    .log-item,
    .learning-grid .pane{
      padding:14px;
    }

    .mut code,
    .history-item code{
      display:block;
      color:#f3f7ff;
      font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      line-height:1.55;
      word-break:break-word;
    }

    .mut span,
    .history-item span,
    .evidence-item span,
    .log-item span,
    .learning-grid .pane span{
      display:block;
      color:var(--muted);
      margin-top:8px;
      line-height:1.58;
      font-size:.88rem;
    }

    .history-head{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:12px;
    }

    .tiny{
      color:var(--soft);
      font-size:.78rem;
    }

    .learning-grid{
      display:grid;
      grid-template-columns:repeat(2, minmax(0,1fr));
      gap:12px;
      margin-top:14px;
    }

    .learning-grid .pane strong{
      display:block;
      font-size:.94rem;
      letter-spacing:-.02em;
    }

    .footer{
      margin-top:18px;
      padding:16px 18px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:16px;
      flex-wrap:wrap;
      color:var(--soft);
      background:rgba(7,12,25,.5);
    }

    .toast{
      position:fixed;
      left:50%;
      bottom:18px;
      transform:translateX(-50%) translateY(18px);
      min-width:min(460px, calc(100% - 24px));
      max-width:min(560px, calc(100% - 24px));
      padding:13px 16px;
      border-radius:18px;
      border:1px solid rgba(255,255,255,.09);
      background:rgba(8,13,28,.88);
      color:var(--text);
      box-shadow:var(--shadow);
      opacity:0;
      pointer-events:none;
      transition:.24s ease;
      z-index:40;
      backdrop-filter:blur(12px);
    }

    .toast.show{
      opacity:1;
      transform:translateX(-50%) translateY(0);
    }

    @media (max-width: 900px){
      .headline,
      .snapshot,
      .learning-grid,
      .mutation-grid,
      .score-grid{grid-template-columns:1fr}
      .bar{grid-template-columns:1fr}
    }

    @media (max-width: 720px){
      .app{width:min(100% - 14px, 1120px)}
      .topbar,
      .statusline,
      .surface-head{align-items:flex-start; flex-direction:column}
      .topbar-actions,
      .status-right{justify-content:flex-start}
      .workspace{padding:18px}
      .surface{padding:10px}
      .headline h2{max-width:none}
      .headline p{justify-self:start}
      .toolrow{align-items:stretch}
      .toolrow .button{width:100%; text-align:center}
    }
  </style>
</head>
<body>
  <canvas id="bg"></canvas>
  <div class="glow"></div>
  <div class="noise"></div>

  <div class="app">
    <header class="topbar">
      <div class="brand">
        <div class="mark">C46</div>
        <div>
          <h1>CTRL46 Research Interface</h1>
          <p>Refined single-surface workspace with local analysis memory and a quiet learning loop.</p>
        </div>
      </div>
      <div class="topbar-actions">
        <button class="button subtle" id="loadDemoTop">Load demo</button>
        <button class="button primary" id="analyzeTop">Analyze</button>
      </div>
    </header>

    <main class="workspace">
      <div class="eyebrow">case file: ctrl46 / search friction / token anomalies</div>

      <div class="headline">
        <h2><span class="grad">One specimen.</span> One instrument.</h2>
        <p>
          The interface now behaves more like a field tool than a dashboard. Drop a specimen once, read a single structured output surface, and let the local loop quietly bias future passes from saved usage.
        </p>
      </div>

      <div class="input-wrap">
        <div class="input-shell">
          <div class="input-meta">
            <span>Primary specimen input</span>
            <span class="mono">baseline: "Hello world"</span>
          </div>
          <textarea id="consoleInput" class="mono" placeholder='Example: <ctrl46><ctrl94> \u0C3E\u0C17,'></textarea>
        </div>

        <div class="toolrow">
          <button class="button primary" id="analyzeBtn">Analyze specimen</button>
          <button class="button subtle" id="saveNoteBtn">Save result</button>
          <button class="button subtle" id="seedConsole">Insert demo</button>
          <button class="button subtle" id="toggleLoopBtn">AI loop off</button>
          <button class="button subtle" id="runLoopBtn">Run cycle</button>
          <div class="spacer"></div>
          <button class="button subtle" id="exportData">Export</button>
          <button class="button subtle" id="clearData">Clear local data</button>
        </div>
      </div>

      <div class="statusline">
        <div class="status-left">
          <span class="chip" id="agentStatusBadge"><b>Loop</b> idle</span>
          <span class="chip" id="agentCycleBadge"><b>Cycles</b> 0</span>
          <span class="chip" id="agentDominantBadge"><b>Dominant</b> none</span>
          <span class="chip" id="entryCountChip"><b>Saved</b> <span id="entryCount">0</span></span>
        </div>
        <div class="status-right">
          <span class="chip"><b>Last mode</b> <span id="lastMode">none</span></span>
          <span class="chip"><b>Weights</b> <span id="agentWeightsInline">0.34 / 0.28 / 0.38</span></span>
        </div>
      </div>
    </main>

    <section class="surface">
      <div class="surface-head">
        <div>
          <h3>Analysis surface</h3>
          <p>Scores, interpretations, evidence, mutations, local history, and model concepts live here in a single expandable flow.</p>
        </div>
        <div class="meta-row">
          <span class="meta-pill" id="currentModeMeta">mode: none</span>
          <span class="meta-pill" id="currentTimeMeta">awaiting specimen</span>
        </div>
      </div>

      <details class="section" open>
        <summary>
          <div class="summary-copy">
            <strong>Signal summary</strong>
            <span>Core scores and a quick snapshot of the current specimen.</span>
          </div>
          <div class="summary-side">
            <span id="summaryFrictionLabel">friction 0</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="score-grid">
            <div class="score-card">
              <div class="label">Control pressure</div>
              <div class="value" id="scoreControl">0</div>
              <div class="hint">Structure and ctrl-tag density</div>
            </div>
            <div class="score-card">
              <div class="label">Unicode mix</div>
              <div class="value" id="scoreUnicode">0</div>
              <div class="hint">Script mixing and non-ASCII load</div>
            </div>
            <div class="score-card">
              <div class="label">Pipeline oddity</div>
              <div class="value" id="scorePipeline">0</div>
              <div class="hint">Cross-layer handling pressure</div>
            </div>
            <div class="score-card">
              <div class="label">Friction sketch</div>
              <div class="value" id="scoreFriction">0</div>
              <div class="hint">Overall anomaly read</div>
            </div>
          </div>

          <div class="bars">
            <div class="bar">
              <span>Structure</span>
              <div class="track"><div class="fill" id="barStructure"></div></div>
              <span id="valStructure">0</span>
            </div>
            <div class="bar">
              <span>Unicode</span>
              <div class="track"><div class="fill" id="barUnicode"></div></div>
              <span id="valUnicode">0</span>
            </div>
            <div class="bar">
              <span>Pipeline</span>
              <div class="track"><div class="fill" id="barPipeline"></div></div>
              <span id="valPipeline">0</span>
            </div>
            <div class="bar">
              <span>Friction</span>
              <div class="track"><div class="fill" id="barFriction"></div></div>
              <span id="valFriction">0</span>
            </div>
          </div>

          <div class="snapshot">
            <div class="card">
              <h4>Specimen snapshot</h4>
              <p id="specimenSnapshot">Analyze a specimen to populate the snapshot.</p>
            </div>
            <div class="card">
              <h4>Current read</h4>
              <p id="summaryRead">The surface is waiting for a specimen.</p>
            </div>
          </div>
        </div>
      </details>

      <details class="section" open>
        <summary>
          <div class="summary-copy">
            <strong>Tags and narrative</strong>
            <span>Descriptive tags, interpretation, and user feedback for the current pass.</span>
          </div>
          <div class="summary-side">
            <span id="tagCountMeta">0 tags</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="tag-cloud" id="tagCloud"></div>
          <div class="narrative" id="narrativeBox" style="margin-top:14px">Analyze a specimen and the narrative will appear here.</div>
          <div class="feedback-row" id="feedbackRow" style="margin-top:14px">
            <button class="feedback-pill" data-feedback="stronger">Stronger than expected</button>
            <button class="feedback-pill" data-feedback="accurate">About right</button>
            <button class="feedback-pill" data-feedback="weaker">Weaker than expected</button>
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Mutation suggestions</strong>
            <span>Compact next variants for paired testing and boundary checks.</span>
          </div>
          <div class="summary-side">
            <span id="mutationCountMeta">0 variants</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="mutation-grid" id="mutationGrid">
            <div class="empty">
              No mutations yet. Analyze a specimen first.
            </div>
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Learning state</strong>
            <span>The loop stays quiet by default, but its memory, hypotheses, and probes can be inspected here.</span>
          </div>
          <div class="summary-side">
            <span id="agentReadText">No saved entries yet.</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="learning-grid">
            <div class="pane">
              <strong>Session memory</strong>
              <span id="agentWeightsText">structure 0.34, unicode 0.28, pipeline 0.38</span>
              <div class="memory-cloud" id="agentMemoryCloud" style="margin-top:12px">
                <span class="memory-chip"><b>memory</b> empty</span>
              </div>
            </div>
            <div class="pane">
              <strong>Working hypothesis</strong>
              <span id="agentHypothesisBox">The loop has not built a working hypothesis yet.</span>
            </div>
          </div>

          <div class="probe-grid" id="agentProbeGrid">
            <div class="mut">
              <code>No next probes yet.</code>
              <span>Run a cycle and the loop will suggest where to poke next.</span>
            </div>
          </div>

          <div class="log-list" id="agentLogList">
            <div class="log-item">
              <span>No loop activity yet.</span>
            </div>
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Evidence notes</strong>
            <span>Compact conceptual anchors for why the specimen family is interesting.</span>
          </div>
          <div class="summary-side">
            <span>4 notes</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="evidence-list" id="evidenceList">
            <div class="evidence-item">
              <code class="mono">&lt;ctrl0000&gt; / &lt;ctrl0001&gt;</code>
              <span>Bracketed numbering feels more like internal residue or scheme-like markup than casual text noise.</span>
            </div>
            <div class="evidence-item">
              <code class="mono">"Hello world"</code>
              <span>A calm baseline matters because the asymmetry between ordinary handling and irregular handling is often the real signal.</span>
            </div>
            <div class="evidence-item">
              <code class="mono">&lt;ctrl46&gt;&lt;ctrl94&gt; \u0C3E\u0C17,</code>
              <span>Mixed control tags and Unicode are useful because they stress encoding, normalization, escaping, tokenization, and search indexing at once.</span>
            </div>
            <div class="evidence-item">
              <code class="mono">cross-layer handoff</code>
              <span>The anomaly may not live in one layer. Small assumptions can collide at tokenizer, moderation, transport, and index boundaries.</span>
            </div>
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Model concepts</strong>
            <span>Click a concept to inspect the current conceptual map without orbit theatrics.</span>
          </div>
          <div class="summary-side">
            <span>6 concepts</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="concept-grid" id="conceptGrid">
            <button class="concept-chip active" data-copy="Tokenizer pressure: unusual delimiters and mixed scripts may split or fuse in unstable ways.">Tokenizer pressure</button>
            <button class="concept-chip" data-copy="Normalization drift: search or ingestion layers may rewrite the probe before it is truly searched.">Normalization drift</button>
            <button class="concept-chip" data-copy="Safety interception: a strange string can trip classifier or policy branches without looking obviously unsafe.">Safety interception</button>
            <button class="concept-chip" data-copy="Index mismatch: stored text and incoming query text may not survive the same transformation path.">Index mismatch</button>
            <button class="concept-chip" data-copy="Transport escaping: the glitch can begin before search, in quoting, encoding, or parameter handling.">Transport escaping</button>
            <button class="concept-chip" data-copy="Cross-layer resonance: no single bug, just several small assumptions colliding at once.">Cross-layer resonance</button>
          </div>
          <div class="inspector" id="modelInspector" style="margin-top:14px">
            Tokenizer pressure: unusual delimiters and mixed scripts may split or fuse in unstable ways.
          </div>
        </div>
      </details>

      <details class="section">
        <summary>
          <div class="summary-copy">
            <strong>Session history</strong>
            <span>Saved runs only. The loop learns from what survives here.</span>
          </div>
          <div class="summary-side">
            <span id="historyCountMeta">0 saved</span>
            <span class="chev">\u2304</span>
          </div>
        </summary>
        <div class="section-body">
          <div class="history-list" id="sessionList">
            <div class="empty">No saved session entries yet.</div>
          </div>
        </div>
      </details>
    </section>

    <footer class="footer">
      <div>CTRL46 Research Interface, refined workspace edition.</div>
      <div>Single-file HTML, offline-capable, localStorage-backed, no external dependencies.</div>
    </footer>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');
    const bgState = { dots: [] };

    function resizeCanvas(){
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const count = Math.min(54, Math.floor(window.innerWidth / 26));
      bgState.dots = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + .5,
        vx: (Math.random() - .5) * .1,
        vy: (Math.random() - .5) * .1,
        a: Math.random() * .45 + .12
      }));
    }

    function drawBg(){
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for(const d of bgState.dots){
        d.x += d.vx;
        d.y += d.vy;
        if(d.x < -20) d.x = window.innerWidth + 20;
        if(d.x > window.innerWidth + 20) d.x = -20;
        if(d.y < -20) d.y = window.innerHeight + 20;
        if(d.y > window.innerHeight + 20) d.y = -20;
      }

      for(let i = 0; i < bgState.dots.length; i++){
        const a = bgState.dots[i];
        ctx.beginPath();
        ctx.fillStyle = \\\`rgba(155, 214, 255, \\\${a.a})\\\`;
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();

        for(let j = i + 1; j < bgState.dots.length; j++){
          const b = bgState.dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if(dist < 120){
            ctx.beginPath();
            ctx.strokeStyle = \\\`rgba(110, 156, 255, \\\${0.055 * (1 - dist / 120)})\\\`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawBg);
    }

    resizeCanvas();
    drawBg();
    window.addEventListener('resize', resizeCanvas);

    function getStore(key, fallback){
      try{
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
      } catch {
        return fallback;
      }
    }

    function setStore(key, value){
      localStorage.setItem(key, JSON.stringify(value));
    }

    function escapeHtml(value){
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function showToast(message){
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => toast.classList.remove('show'), 1900);
    }

    const consoleInput = document.getElementById('consoleInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analyzeTop = document.getElementById('analyzeTop');
    const loadDemoTop = document.getElementById('loadDemoTop');
    const seedConsole = document.getElementById('seedConsole');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const toggleLoopBtn = document.getElementById('toggleLoopBtn');
    const runLoopBtn = document.getElementById('runLoopBtn');
    const exportData = document.getElementById('exportData');
    const clearData = document.getElementById('clearData');

    const scoreControl = document.getElementById('scoreControl');
    const scoreUnicode = document.getElementById('scoreUnicode');
    const scorePipeline = document.getElementById('scorePipeline');
    const scoreFriction = document.getElementById('scoreFriction');
    const valStructure = document.getElementById('valStructure');
    const valUnicode = document.getElementById('valUnicode');
    const valPipeline = document.getElementById('valPipeline');
    const valFriction = document.getElementById('valFriction');
    const barStructure = document.getElementById('barStructure');
    const barUnicode = document.getElementById('barUnicode');
    const barPipeline = document.getElementById('barPipeline');
    const barFriction = document.getElementById('barFriction');

    const tagCloud = document.getElementById('tagCloud');
    const narrativeBox = document.getElementById('narrativeBox');
    const mutationGrid = document.getElementById('mutationGrid');
    const sessionList = document.getElementById('sessionList');
    const entryCount = document.getElementById('entryCount');
    const lastMode = document.getElementById('lastMode');
    const currentModeMeta = document.getElementById('currentModeMeta');
    const currentTimeMeta = document.getElementById('currentTimeMeta');
    const historyCountMeta = document.getElementById('historyCountMeta');
    const mutationCountMeta = document.getElementById('mutationCountMeta');
    const tagCountMeta = document.getElementById('tagCountMeta');
    const summaryFrictionLabel = document.getElementById('summaryFrictionLabel');
    const summaryRead = document.getElementById('summaryRead');
    const specimenSnapshot = document.getElementById('specimenSnapshot');

    const agentStatusBadge = document.getElementById('agentStatusBadge');
    const agentCycleBadge = document.getElementById('agentCycleBadge');
    const agentDominantBadge = document.getElementById('agentDominantBadge');
    const agentWeightsInline = document.getElementById('agentWeightsInline');
    const agentWeightsText = document.getElementById('agentWeightsText');
    const agentReadText = document.getElementById('agentReadText');
    const agentMemoryCloud = document.getElementById('agentMemoryCloud');
    const agentHypothesisBox = document.getElementById('agentHypothesisBox');
    const agentProbeGrid = document.getElementById('agentProbeGrid');
    const agentLogList = document.getElementById('agentLogList');

    const feedbackButtons = [...document.querySelectorAll('[data-feedback]')];
    const conceptButtons = [...document.querySelectorAll('.concept-chip')];
    const modelInspector = document.getElementById('modelInspector');

    let currentAnalysis = null;
    let agentTimer = null;

    function defaultAgentState(){
      return {
        enabled: false,
        cycles: 0,
        weights: { structure: 0.34, unicode: 0.28, pipeline: 0.38 },
        memory: {},
        hypotheses: [],
        nextProbes: [],
        log: [],
        dominant: 'none',
        lastRun: null
      };
    }

    function normalizeWeights(weights){
      const total = Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;
      return {
        structure: Number((weights.structure / total).toFixed(3)),
        unicode: Number((weights.unicode / total).toFixed(3)),
        pipeline: Number((weights.pipeline / total).toFixed(3))
      };
    }

    function getAgentState(){
      const stored = getStore('ctrl46_agent_state', defaultAgentState());
      return {
        ...defaultAgentState(),
        ...stored,
        weights: normalizeWeights({ ...defaultAgentState().weights, ...(stored.weights || {}) }),
        memory: stored.memory || {},
        hypotheses: stored.hypotheses || [],
        nextProbes: stored.nextProbes || [],
        log: stored.log || []
      };
    }

    function setAgentState(state){
      state.weights = normalizeWeights(state.weights);
      setStore('ctrl46_agent_state', state);
    }

    function getEntries(){
      return getStore('ctrl46_console_entries', []);
    }

    function setEntries(entries){
      setStore('ctrl46_console_entries', entries);
      renderSession();
    }

    function countMatches(text, regex){
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    }

    function hasNonAscii(text){
      return /[^\\x00-\\x7F]/.test(text);
    }

    function hasCtrlPattern(text){
      return /<ctrl\\d+>/gi.test(text);
    }

    function detectScripts(text){
      const scripts = [];
      if(/[A-Za-z]/.test(text)) scripts.push('latin');
      if(/[\\u0C00-\\u0C7F]/.test(text)) scripts.push('telugu');
      if(/[^\\x00-\\x7F]/.test(text) && !/[\\u0C00-\\u0C7F]/.test(text)) scripts.push('other-non-ascii');
      return scripts;
    }

    function clamp(n){
      return Math.max(0, Math.min(100, Math.round(n)));
    }

    function buildMutations(text){
      const trimmed = text.trim();
      const mutations = [
        { value: \\\`"\\\${trimmed}"\\\`, note: 'Quoted variant to test literal handling and normalization.' },
        { value: trimmed.replace(/</g, '&lt;').replace(/>/g, '&gt;'), note: 'Escaped angle brackets for transport and rendering checks.' },
        { value: trimmed.replace(/></g, '> <'), note: 'Spaced tags to probe token boundary changes.' },
        { value: trimmed.toLowerCase(), note: 'Lowercase normalization probe.' }
      ];
      if(/[^\\x00-\\x7F]/.test(trimmed)){
        mutations.push({
          value: trimmed.replace(/[^\\x00-\\x7F]/g, ''),
          note: 'Unicode-stripped variant to isolate whether non-ASCII characters are part of the pressure.'
        });
      }
      return mutations.slice(0, 4);
    }

    function analyzeSpecimen(text){
      const clean = text.trim();
      const ctrlCount = countMatches(clean, /<ctrl\\d+>/gi);
      const angleCount = countMatches(clean, /[<>]/g);
      const quoteCount = countMatches(clean, /["'\\\`]/g);
      const punctuationCount = countMatches(clean, /[.,;:!?()[\\]{}\\\\/_-]/g);
      const nonAscii = countMatches(clean, /[^\\x00-\\x7F]/g);
      const length = clean.length;
      const scripts = detectScripts(clean);
      const mixedScripts = scripts.length > 1;
      const structure = clamp(ctrlCount * 24 + angleCount * 4 + Math.min(length, 40) * 0.4 + (hasCtrlPattern(clean) ? 18 : 0));
      const unicode = clamp(nonAscii * 8 + (mixedScripts ? 34 : 0) + (hasNonAscii(clean) ? 18 : 0));

      const agent = getAgentState();
      const weights = agent.weights;

      const pipeline = clamp(
        structure * (0.22 + weights.structure * 0.55) +
        unicode * (0.18 + weights.unicode * 0.62) +
        quoteCount * 8 +
        punctuationCount * 2 +
        (mixedScripts ? 8 : 0)
      );

      const friction = clamp(
        structure * (weights.structure + 0.08) +
        unicode * (weights.unicode + 0.05) +
        pipeline * (weights.pipeline + 0.07)
      );

      const tags = [];
      if(ctrlCount) tags.push(\\\`ctrl-tags:\\\${ctrlCount}\\\`);
      if(mixedScripts) tags.push('mixed-script');
      if(hasNonAscii(clean)) tags.push('non-ascii');
      if(quoteCount) tags.push('quoted-or-escapable');
      if(length > 20) tags.push('longer-specimen');
      if(pipeline > 70) tags.push('high-pipeline-pressure');
      if(friction > 70) tags.push('strong-friction-candidate');
      if(!tags.length) tags.push('low-structure');

      let mode = 'plain';
      if(ctrlCount && hasNonAscii(clean)) mode = 'ctrl+unicode';
      else if(ctrlCount) mode = 'ctrl-only';
      else if(hasNonAscii(clean)) mode = 'unicode-only';

      let narrative = 'This specimen looks ';
      if(friction > 75) narrative += 'like a strong anomaly candidate. ';
      else if(friction > 45) narrative += 'moderately interesting, with enough structure to justify paired testing. ';
      else narrative += 'relatively mild, though it may still be useful as a control or comparison sample. ';

      if(ctrlCount) narrative += 'The numbered ctrl-tag pattern suggests internal-style residue rather than casual text noise. ';
      if(mixedScripts) narrative += 'Multiple scripts are present, which can amplify tokenization and normalization pressure. ';
      else if(hasNonAscii(clean)) narrative += 'Non-ASCII characters add some encoding and normalization load. ';
      if(quoteCount || punctuationCount > 3) narrative += 'Its punctuation profile may encourage escaping or rewriting behavior in some pipelines. ';
      if(agent.cycles > 0) narrative += \\\`The local loop is currently weighting \\\${agent.dominant || 'mixed'} pressure most heavily, so later analyses may drift as it learns from the session. \\\`;
      narrative += 'The safest next move is to compare exact handling against a calm baseline and record every rewrite, sanitization, or empty-result shape.';

      return {
        text: clean,
        ctrlCount,
        structure,
        unicode,
        pipeline,
        friction,
        tags,
        mode,
        narrative,
        mutations: buildMutations(clean),
        createdAt: new Date().toISOString(),
        feedback: null
      };
    }

    function dominantKey(weights){
      return Object.entries(weights).sort((a, b) => b[1] - a[1])[0][0];
    }

    function deriveHypotheses(entries, state){
      if(!entries.length){
        return ['No saved entries yet, so the loop has nothing solid to chew on.'];
      }

      const avg = key => entries.reduce((sum, entry) => sum + entry[key], 0) / entries.length;
      const avgStructure = avg('structure');
      const avgUnicode = avg('unicode');
      const avgPipeline = avg('pipeline');
      const hypotheses = [];

      if(avgStructure > 60 && avgUnicode > 45){
        hypotheses.push('The session suggests mixed structural and Unicode pressure working together rather than a single isolated trigger.');
      }
      if(avgPipeline > 65){
        hypotheses.push('Cross-layer handoffs look louder than any one raw feature, which points toward normalization, escaping, or indexing collisions.');
      }
      if(entries.some(entry => entry.feedback === 'stronger')){
        hypotheses.push('User feedback has repeatedly marked outcomes as stronger than expected, so the loop is nudging weights upward around the dominant pattern.');
      }
      if(entries.every(entry => entry.mode === 'ctrl-only' || entry.mode === 'ctrl+unicode')){
        hypotheses.push('The archive leans heavily toward ctrl-tagged strings, which keeps the loop suspicious of internal-style residue.');
      }
      if(!hypotheses.length){
        hypotheses.push('The pattern is still diffuse. The best current reading is that the specimen family is interesting, but not yet sharply localized to one layer.');
      }
      return hypotheses.slice(0, 3);
    }

    function deriveNextProbes(entries){
      if(!entries.length){
        return [{ value: '<ctrl46><ctrl94> \u0C3E\u0C17,', note: 'Seed probe for mixed control and Unicode pressure.' }];
      }
      const latest = entries[0];
      const probes = buildMutations(latest.text).map(mut => ({ value: mut.value, note: mut.note }));
      probes.push({ value: '"Hello world"', note: 'Baseline control for comparison against the latest specimen.' });
      return probes.slice(0, 4);
    }

    function learnFromEntries(entries){
      const state = getAgentState();
      const recent = entries.slice(0, 12);
      if(!recent.length){
        updateLearningSurface(state);
        return state;
      }

      const avgStructure = recent.reduce((sum, e) => sum + e.structure, 0) / recent.length;
      const avgUnicode = recent.reduce((sum, e) => sum + e.unicode, 0) / recent.length;
      const avgPipeline = recent.reduce((sum, e) => sum + e.pipeline, 0) / recent.length;

      let target = normalizeWeights({
        structure: Math.max(0.2, avgStructure / 100),
        unicode: Math.max(0.16, avgUnicode / 100),
        pipeline: Math.max(0.24, avgPipeline / 100)
      });

      if(recent.some(e => e.feedback === 'stronger')){
        const dom = dominantKey(target);
        target[dom] += 0.05;
        target = normalizeWeights(target);
      }

      if(recent.some(e => e.feedback === 'weaker')){
        const dom = dominantKey(target);
        target[dom] = Math.max(0.16, target[dom] - 0.05);
        target = normalizeWeights(target);
      }

      state.weights = normalizeWeights({
        structure: state.weights.structure * 0.74 + target.structure * 0.26,
        unicode: state.weights.unicode * 0.74 + target.unicode * 0.26,
        pipeline: state.weights.pipeline * 0.74 + target.pipeline * 0.26
      });

      state.memory = {};
      recent.forEach(entry => {
        (entry.tags || []).forEach(tag => {
          state.memory[tag] = (state.memory[tag] || 0) + 1;
        });
      });

      state.hypotheses = deriveHypotheses(recent, state);
      state.nextProbes = deriveNextProbes(recent);
      state.dominant = dominantKey(state.weights);
      state.cycles += 1;
      state.lastRun = new Date().toISOString();
      state.log.unshift({ text: \\\`Cycle \\\${state.cycles}: dominant \\\${state.dominant}, weights \\\${state.weights.structure.toFixed(2)} / \\\${state.weights.unicode.toFixed(2)} / \\\${state.weights.pipeline.toFixed(2)}.\\\` });
      state.log = state.log.slice(0, 18);

      setAgentState(state);
      updateLearningSurface(state);
      return state;
    }

    function setBar(fillEl, valueEl, value){
      fillEl.style.width = \\\`\\\${value}%\\\`;
      valueEl.textContent = value;
    }

    function renderAnalysis(analysis){
      currentAnalysis = analysis;
      scoreControl.textContent = analysis.structure;
      scoreUnicode.textContent = analysis.unicode;
      scorePipeline.textContent = analysis.pipeline;
      scoreFriction.textContent = analysis.friction;

      setBar(barStructure, valStructure, analysis.structure);
      setBar(barUnicode, valUnicode, analysis.unicode);
      setBar(barPipeline, valPipeline, analysis.pipeline);
      setBar(barFriction, valFriction, analysis.friction);

      tagCloud.innerHTML = analysis.tags.map(tag => \\\`<span class="tag-chip">\\\${escapeHtml(tag)}</span>\\\`).join('');
      narrativeBox.textContent = analysis.narrative;
      mutationGrid.innerHTML = analysis.mutations.map(mut => \\\`
        <div class="mut">
          <code>\\\${escapeHtml(mut.value)}</code>
          <span>\\\${escapeHtml(mut.note)}</span>
        </div>
      \\\`).join('');

      lastMode.textContent = analysis.mode;
      currentModeMeta.textContent = \\\`mode: \\\${analysis.mode}\\\`;
      currentTimeMeta.textContent = new Date(analysis.createdAt).toLocaleString();
      summaryFrictionLabel.textContent = \\\`friction \\\${analysis.friction}\\\`;
      mutationCountMeta.textContent = \\\`\\\${analysis.mutations.length} variants\\\`;
      tagCountMeta.textContent = \\\`\\\${analysis.tags.length} tag\\\${analysis.tags.length === 1 ? '' : 's'}\\\`;
      specimenSnapshot.textContent = analysis.text;
      summaryRead.textContent = \\\`Mode \\\${analysis.mode}. Control \\\${analysis.structure}, Unicode \\\${analysis.unicode}, pipeline \\\${analysis.pipeline}, friction \\\${analysis.friction}.\\\`;
      feedbackButtons.forEach(btn => btn.classList.remove('active'));
    }

    function renderSession(){
      const entries = getEntries();
      entryCount.textContent = entries.length;
      historyCountMeta.textContent = \\\`\\\${entries.length} saved\\\`;

      if(!entries.length){
        sessionList.innerHTML = '<div class="empty">No saved session entries yet.</div>';
        return;
      }

      sessionList.innerHTML = entries.map((entry, idx) => \\\`
        <div class="history-item">
          <div class="history-head">
            <code>\\\${escapeHtml(entry.text)}</code>
            <span class="tiny">#\\\${String(idx + 1).padStart(2, '0')}</span>
          </div>
          <span>mode \\\${escapeHtml(entry.mode)} | control \\\${entry.structure} | unicode \\\${entry.unicode} | pipeline \\\${entry.pipeline} | friction \\\${entry.friction}\\\${entry.feedback ? \\\` | feedback \\\${escapeHtml(entry.feedback)}\\\` : ''}</span>
          <span>\\\${escapeHtml(entry.narrative)}</span>
        </div>
      \\\`).join('');
    }

    function updateLearningSurface(state = getAgentState()){
      agentStatusBadge.innerHTML = \\\`<b>Loop</b> \\\${state.enabled ? 'active' : 'idle'}\\\`;
      agentCycleBadge.innerHTML = \\\`<b>Cycles</b> \\\${state.cycles}\\\`;
      agentDominantBadge.innerHTML = \\\`<b>Dominant</b> \\\${state.dominant || 'none'}\\\`;
      agentWeightsInline.textContent = \\\`\\\${state.weights.structure.toFixed(2)} / \\\${state.weights.unicode.toFixed(2)} / \\\${state.weights.pipeline.toFixed(2)}\\\`;
      agentWeightsText.textContent = \\\`structure \\\${state.weights.structure.toFixed(2)}, unicode \\\${state.weights.unicode.toFixed(2)}, pipeline \\\${state.weights.pipeline.toFixed(2)}\\\`;
      toggleLoopBtn.textContent = state.enabled ? 'AI loop on' : 'AI loop off';

      const entries = getEntries();
      if(!entries.length){
        agentReadText.textContent = 'No saved entries yet.';
      } else {
        agentReadText.textContent = \\\`reading \\\${entries.length} saved entr\\\${entries.length === 1 ? 'y' : 'ies'}\\\`;
      }

      const memoryEntries = Object.entries(state.memory).sort((a, b) => b[1] - a[1]).slice(0, 8);
      agentMemoryCloud.innerHTML = memoryEntries.length
        ? memoryEntries.map(([tag, count]) => \\\`<span class="memory-chip"><b>\\\${escapeHtml(tag)}</b>\\\${count}</span>\\\`).join('')
        : '<span class="memory-chip"><b>memory</b> empty</span>';

      agentHypothesisBox.textContent = state.hypotheses && state.hypotheses.length
        ? state.hypotheses.join(' ')
        : 'The loop has not built a working hypothesis yet.';

      agentProbeGrid.innerHTML = state.nextProbes && state.nextProbes.length
        ? state.nextProbes.map(probe => \\\`
          <div class="mut">
            <code>\\\${escapeHtml(probe.value)}</code>
            <span>\\\${escapeHtml(probe.note)}</span>
          </div>
        \\\`).join('')
        : '<div class="mut"><code>No next probes yet.</code><span>Run a cycle and the loop will suggest where to poke next.</span></div>';

      agentLogList.innerHTML = state.log && state.log.length
        ? state.log.map((entry, idx) => \\\`
          <div class="log-item">
            <span>\\\${escapeHtml(entry.text)}</span>
            <span class="tiny">\\\${idx === 0 ? 'latest' : 'log'}</span>
          </div>
        \\\`).join('')
        : '<div class="log-item"><span>No loop activity yet.</span></div>';
    }

    function saveCurrent(){
      if(!currentAnalysis) return false;
      const entries = getEntries();
      const index = entries.findIndex(entry => entry.createdAt === currentAnalysis.createdAt && entry.text === currentAnalysis.text);
      if(index >= 0){
        entries[index] = { ...currentAnalysis };
      } else {
        entries.unshift({ ...currentAnalysis });
      }
      setEntries(entries.slice(0, 24));
      if(getAgentState().enabled) runAgentCycle();
      return true;
    }

    function runAgentCycle(){
      const entries = getEntries();
      const pool = currentAnalysis ? [currentAnalysis, ...entries] : entries;
      const unique = [];
      const seen = new Set();

      pool.forEach(entry => {
        const key = \\\`\\\${entry.text}::\\\${entry.createdAt || ''}\\\`;
        if(!seen.has(key)){
          seen.add(key);
          unique.push(entry);
        }
      });

      learnFromEntries(unique);
      if(currentAnalysis){
        renderAnalysis(analyzeSpecimen(currentAnalysis.text));
      }
    }

    function startAgentLoop(){
      const state = getAgentState();
      if(agentTimer) clearInterval(agentTimer);
      if(!state.enabled) return;
      agentTimer = setInterval(runAgentCycle, 8000);
    }

    function toggleAgentLoop(){
      const state = getAgentState();
      state.enabled = !state.enabled;
      state.log.unshift({ text: state.enabled ? 'Loop switched on.' : 'Loop switched off.' });
      state.log = state.log.slice(0, 18);
      setAgentState(state);
      if(state.enabled){
        startAgentLoop();
        runAgentCycle();
        showToast('Learning loop enabled.');
      } else {
        if(agentTimer){
          clearInterval(agentTimer);
          agentTimer = null;
        }
        updateLearningSurface(state);
        showToast('Learning loop disabled.');
      }
    }

    function applyFeedback(kind){
      if(!currentAnalysis) return;
      currentAnalysis.feedback = kind;
      feedbackButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.feedback === kind));

      const state = getAgentState();
      if(kind === 'stronger'){
        state.weights = normalizeWeights({
          structure: state.weights.structure + 0.02,
          unicode: state.weights.unicode + (currentAnalysis.unicode > 20 ? 0.02 : 0),
          pipeline: state.weights.pipeline + 0.03
        });
        state.log.unshift({ text: 'Feedback: stronger than expected. Weights nudged upward around the dominant pattern.' });
      } else if(kind === 'weaker'){
        const dom = dominantKey(state.weights);
        state.weights[dom] = Math.max(0.16, state.weights[dom] - 0.04);
        state.weights = normalizeWeights(state.weights);
        state.log.unshift({ text: 'Feedback: weaker than expected. Dominant weight trimmed back slightly.' });
      } else {
        state.log.unshift({ text: 'Feedback: about right. Current weighting reinforced lightly.' });
      }

      state.log = state.log.slice(0, 18);
      setAgentState(state);
      updateLearningSurface(state);
      showToast('Feedback applied to the current analysis. Save to commit it to history.');
    }

    function analyzeCurrent(){
      const value = consoleInput.value.trim();
      if(!value){
        showToast('Paste or type a specimen first.');
        return;
      }
      renderAnalysis(analyzeSpecimen(value));
      if(getAgentState().enabled) runAgentCycle();
      showToast('Specimen analyzed.');
    }

    function insertDemo(){
      consoleInput.value = '<ctrl46><ctrl94> \u0C3E\u0C17,';
      analyzeCurrent();
    }

    function exportPayload(){
      const payload = { entries: getEntries(), agent: getAgentState() };
      if(currentAnalysis) payload.current = currentAnalysis;
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'ctrl46-research-export.json';
      a.click();
      URL.revokeObjectURL(a.href);
      showToast('Local data exported as JSON.');
    }

    function resetSurface(){
      currentAnalysis = null;
      ['scoreControl', 'scoreUnicode', 'scorePipeline', 'scoreFriction'].forEach(id => document.getElementById(id).textContent = '0');
      setBar(barStructure, valStructure, 0);
      setBar(barUnicode, valUnicode, 0);
      setBar(barPipeline, valPipeline, 0);
      setBar(barFriction, valFriction, 0);
      tagCloud.innerHTML = '';
      narrativeBox.textContent = 'Analyze a specimen and the narrative will appear here.';
      mutationGrid.innerHTML = '<div class="empty">No mutations yet. Analyze a specimen first.</div>';
      specimenSnapshot.textContent = 'Analyze a specimen to populate the snapshot.';
      summaryRead.textContent = 'The surface is waiting for a specimen.';
      summaryFrictionLabel.textContent = 'friction 0';
      mutationCountMeta.textContent = '0 variants';
      tagCountMeta.textContent = '0 tags';
      lastMode.textContent = 'none';
      currentModeMeta.textContent = 'mode: none';
      currentTimeMeta.textContent = 'awaiting specimen';
      feedbackButtons.forEach(btn => btn.classList.remove('active'));
    }

    function clearAllData(){
      localStorage.removeItem('ctrl46_console_entries');
      localStorage.removeItem('ctrl46_agent_state');
      if(agentTimer){
        clearInterval(agentTimer);
        agentTimer = null;
      }
      renderSession();
      updateLearningSurface(defaultAgentState());
      resetSurface();
      showToast('Local session data cleared.');
    }

    feedbackButtons.forEach(btn => {
      btn.addEventListener('click', () => applyFeedback(btn.dataset.feedback));
    });

    conceptButtons.forEach(button => {
      button.addEventListener('click', () => {
        conceptButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        modelInspector.textContent = button.dataset.copy;
      });
    });

    analyzeBtn.addEventListener('click', analyzeCurrent);
    analyzeTop.addEventListener('click', analyzeCurrent);
    loadDemoTop.addEventListener('click', insertDemo);
    seedConsole.addEventListener('click', insertDemo);

    saveNoteBtn.addEventListener('click', () => {
      if(!currentAnalysis){
        showToast('Analyze a specimen before saving.');
        return;
      }
      saveCurrent();
      showToast('Result saved to local session history.');
    });

    toggleLoopBtn.addEventListener('click', toggleAgentLoop);
    runLoopBtn.addEventListener('click', () => {
      runAgentCycle();
      showToast('Learning cycle completed.');
    });
    exportData.addEventListener('click', exportPayload);
    clearData.addEventListener('click', clearAllData);

    consoleInput.addEventListener('keydown', (event) => {
      if((event.metaKey || event.ctrlKey) && event.key === 'Enter'){
        event.preventDefault();
        analyzeCurrent();
      }
    });

    renderSession();
    updateLearningSurface(getAgentState());
    resetSurface();
    if(getAgentState().enabled) startAgentLoop();
  <\/script>
</body>
</html>
`])));
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map