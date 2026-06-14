#!/usr/bin/env node
// Pixil MCP client — zero dependencies, Node 18+ (global fetch).
// Talks to Pixil's stateless MCP HTTP endpoint (JSON-RPC 2.0) with a PIXIL_TOKEN.
// This is the "CLI" the pixil-skill wraps; it also works standalone.
//
//   export PIXIL_TOKEN=pixil_xxx        # from https://www.pixil.space/mcp
//   node pixil.mjs image "a red fox in snow, cinematic" --aspect 16:9
//   node pixil.mjs video "the fox runs" --duration 5 --motion dolly-in

const BASE = process.env.PIXIL_BASE || 'https://www.pixil.space/api/mcp';
const TOKEN = process.env.PIXIL_TOKEN || '';

function die(msg, code = 1) {
  console.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  process.exit(code);
}

const NO_TOKEN_MSG =
  'PIXIL_TOKEN is not set.\n' +
  'Get a token at https://www.pixil.space/mcp (Account -> MCP connectors), then:\n' +
  '  export PIXIL_TOKEN=pixil_xxx';

let _id = 0;
async function rpc(method, params) {
  if (!TOKEN) die(NO_TOKEN_MSG);
  let res;
  try {
    res = await fetch(`${BASE}?token=${encodeURIComponent(TOKEN)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++_id, method, params }),
    });
  } catch (e) {
    die(`Network error reaching Pixil: ${e?.message || e}`);
  }
  const text = await res.text();
  if (res.status === 401) die('Unauthorized — check PIXIL_TOKEN (get one at https://www.pixil.space/mcp).');
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    die(`Unexpected response (${res.status}): ${text.slice(0, 200)}`);
  }
  if (data.error) die(`Pixil error: ${data.error.message || JSON.stringify(data.error)}`);
  return data.result;
}

// Call an MCP tool; unwrap the { content:[{text}] } envelope into parsed JSON.
async function tool(name, args = {}) {
  const result = await rpc('tools/call', { name, arguments: args });
  const block = result?.content?.find((c) => c.type === 'text');
  const raw = block ? block.text : JSON.stringify(result);
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = raw;
  }
  if (result?.isError) die(`Pixil: ${typeof parsed === 'string' ? parsed : JSON.stringify(parsed)}`);
  return parsed;
}

// generate_* tools wrap the row as { generation, remaining_credits }; get returns it flat.
const genOf = (r) => (r && typeof r === 'object' && r.generation ? r.generation : r);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const POLL_MS = 4000;
const POLL_MAX = 90; // ~6 minutes

async function waitFor(id) {
  for (let i = 0; i < POLL_MAX; i++) {
    const g = await tool('pixil_get_generation', { id });
    if (g?.status === 'completed') return g;
    if (g?.status === 'failed') die(`Generation failed: ${g?.error_message || 'unknown'} (credits refunded).`);
    await sleep(POLL_MS);
  }
  die(`Timed out waiting. Check later: node pixil.mjs get ${id}`);
}

function out(r) {
  const g = genOf(r);
  if (g && typeof g === 'object' && g.image_url) {
    console.log(g.image_url); // the media URL is the primary output
    if (g.credits_used != null) console.error(`(${g.credits_used} credits used)`);
  } else if (g && typeof g === 'object' && g.credits != null) {
    console.log(`${g.credits} credits${g.email ? ` · ${g.email}` : ''}`);
  } else {
    console.log(typeof g === 'string' ? g : JSON.stringify(g, null, 2));
  }
}

function parseFlags(args) {
  const f = {};
  const pos = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const next = args[i + 1];
      f[k] = next && !next.startsWith('--') ? args[++i] : 'true';
    } else pos.push(a);
  }
  return { f, pos };
}
const motion = (s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : undefined);

const HELP = `Pixil MCP client

Usage: PIXIL_TOKEN=pixil_xxx node pixil.mjs <command>

  credits                              show credit balance
  models                               list models + credit costs
  brands                               list brand profiles
  image "<prompt>" [--model id] [--aspect 1:1|16:9|9:16|4:3]
  edit  "<prompt>" <url1> [url2 ...]   edit/combine reference images
  video "<prompt>" [--model id] [--aspect 16:9] [--duration 5|10] [--motion dolly-in,orbit]
  animate "<prompt>" <image_url> [--motion ...]    image-to-video
  lipsync --audio <url> (--video <url> | --image <url>) [--prompt "..."]
  extend <video_url> [--duration 1-6] [--prompt "..."]   seamless video extension
  tts    "<text>" [--voice Rachel]     text-to-speech (29 langs incl. Lithuanian)
  music  "<style/mood>" [--duration 30]   generate background music (<=190s)
  upscale  <image_url>                 enhance / upscale 2x
  removebg <image_url>                 remove background -> transparent PNG
  expand   <image_url> [--aspect 16:9] [--prompt "..."]   outpaint to a new aspect
  get <id>                             fetch/poll a generation
  call <tool> '<json-args>'            raw MCP tool call

Token: https://www.pixil.space/mcp`;

const argv = process.argv.slice(2);
const cmd = argv.shift();

(async () => {
  switch (cmd) {
    case 'credits':
      out(await tool('pixil_credits'));
      break;
    case 'models':
      console.log(JSON.stringify(await tool('pixil_list_models'), null, 2));
      break;
    case 'brands':
      console.log(JSON.stringify(await tool('pixil_list_brands'), null, 2));
      break;
    case 'get':
      out(await tool('pixil_get_generation', { id: argv[0] || die('usage: pixil get <id>') }));
      break;
    case 'image': {
      const { f, pos } = parseFlags(argv);
      const prompt = pos[0] || die('usage: pixil image "<prompt>" [--model id] [--aspect 1:1]');
      const a = { prompt };
      if (f.model) a.model = f.model;
      if (f.aspect) a.aspect_ratio = f.aspect;
      out(await tool('pixil_generate_image', a));
      break;
    }
    case 'edit': {
      const { pos } = parseFlags(argv);
      const prompt = pos.shift() || die('usage: pixil edit "<prompt>" <url1> [url2 ...]');
      if (!pos.length) die('edit needs at least one image URL');
      out(await tool('pixil_edit_image', { prompt, image_urls: pos }));
      break;
    }
    case 'video': {
      const { f, pos } = parseFlags(argv);
      const prompt = pos[0] || die('usage: pixil video "<prompt>" [--model id] [--aspect 16:9] [--duration 5] [--motion ...]');
      const a = { prompt };
      if (f.model) a.model = f.model;
      if (f.aspect) a.aspect_ratio = f.aspect;
      if (f.duration) a.duration = Number(f.duration);
      const m = motion(f.motion);
      if (m) a.motion = m;
      const g = genOf(await tool('pixil_generate_video', a));
      out(await waitFor(g.id));
      break;
    }
    case 'animate': {
      const { f, pos } = parseFlags(argv);
      const prompt = pos[0] || die('usage: pixil animate "<prompt>" <image_url> [--motion ...]');
      const url = pos[1] || die('animate needs an image URL');
      const a = { prompt, image_url: url };
      const m = motion(f.motion);
      if (m) a.motion = m;
      const g = genOf(await tool('pixil_image_to_video', a));
      out(await waitFor(g.id));
      break;
    }
    case 'lipsync': {
      const { f } = parseFlags(argv);
      if (!f.audio) die('usage: pixil lipsync --audio <url> (--video <url> | --image <url>) [--prompt "..."]');
      const a = { audio_url: f.audio };
      if (f.video) a.video_url = f.video;
      if (f.image) a.image_url = f.image;
      if (f.prompt) a.prompt = f.prompt;
      const g = genOf(await tool('pixil_lipsync', a));
      out(await waitFor(g.id));
      break;
    }
    case 'tts': {
      const { f, pos } = parseFlags(argv);
      const text = pos[0] || die('usage: pixil tts "<text>" [--voice Rachel]');
      const a = { text };
      if (f.voice) a.voice = f.voice;
      out(await tool('pixil_tts', a)); // audio finishes inline
      break;
    }
    case 'music': {
      const { f, pos } = parseFlags(argv);
      const prompt = pos[0] || die('usage: pixil music "<style/mood/instruments>" [--duration 30]');
      const a = { prompt };
      if (f.duration) a.duration = Number(f.duration);
      out(await tool('pixil_generate_music', a));
      break;
    }
    case 'upscale': {
      const { pos } = parseFlags(argv);
      const url = pos[0] || die('usage: pixil upscale <image_url>');
      out(await tool('pixil_upscale_image', { image_url: url }));
      break;
    }
    case 'removebg': {
      const { pos } = parseFlags(argv);
      const url = pos[0] || die('usage: pixil removebg <image_url>');
      out(await tool('pixil_remove_background', { image_url: url }));
      break;
    }
    case 'expand': {
      const { f, pos } = parseFlags(argv);
      const url = pos[0] || die('usage: pixil expand <image_url> [--aspect 16:9|9:16|1:1] [--prompt "..."]');
      const a = { image_url: url };
      if (f.aspect) a.aspect_ratio = f.aspect;
      if (f.prompt) a.prompt = f.prompt;
      out(await tool('pixil_expand_image', a));
      break;
    }
    case 'extend': {
      const { f, pos } = parseFlags(argv);
      const url = pos[0] || die('usage: pixil extend <video_url> [--duration 1-6] [--prompt "..."]');
      const a = { video_url: url };
      if (f.duration) a.duration = Number(f.duration);
      if (f.prompt) a.prompt = f.prompt;
      const g = genOf(await tool('pixil_extend_video', a)); // video is async
      out(await waitFor(g.id));
      break;
    }
    case 'call': {
      const name = argv[0] || die("usage: pixil call <tool> '<json-args>'");
      let a = {};
      if (argv[1]) {
        try {
          a = JSON.parse(argv[1]);
        } catch {
          die('args must be valid JSON');
        }
      }
      const r = await tool(name, a);
      const g = genOf(r);
      if (g && g.id && g.status === 'pending') out(await waitFor(g.id));
      else if (g && typeof g === 'object' && g.image_url) out(r);
      else console.log(typeof r === 'string' ? r : JSON.stringify(r, null, 2));
      break;
    }
    default:
      console.log(HELP);
      process.exit(cmd ? 1 : 0);
  }
})().catch((e) => die(e?.message || String(e)));
