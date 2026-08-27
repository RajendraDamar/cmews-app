import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

type NotificationType = 'info' | 'waspada' | 'siaga' | 'awas';

type DeviceRegistration = {
  token: string;
  deviceName: string;
  registeredAt: string;
};

type DeviceMap = Record<string, DeviceRegistration>;

const PORT = Number(process.env.PORT ?? 3003);
const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');

if (!existsSync(serviceAccountPath)) {
  throw new Error(
    `Missing Firebase service account file at ${serviceAccountPath}. Add your key to test-server/serviceAccountKey.json`,
  );
}

const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, 'utf8'),
) as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

const devices: DeviceMap = {};

const severityByType: Record<NotificationType, string> = {
  info: 'INFO',
  waspada: 'WASPADA',
  siaga: 'SIAGA',
  awas: 'AWAS',
};

const configByType: Record<
  NotificationType,
  {
    channelId: string;
    androidPriority: 'normal' | 'high';
    androidVisibility?: 'private' | 'public' | 'secret';
    androidColor?: string;
    androidDefaultSound?: boolean;
    androidDefaultVibrateTimings?: boolean;
    apnsInterruptionLevel: 'passive' | 'active' | 'time-sensitive';
    defaultTitle: string;
    defaultBody: string;
    apnsPriority: '5' | '10';
    criticalSound?: boolean;
  }
> = {
  info: {
    channelId: 'cmews-info',
    androidPriority: 'normal',
    apnsInterruptionLevel: 'passive',
    defaultTitle: 'Info Cuaca BMKG',
    defaultBody: 'Pembaruan rutin prakiraan cuaca terbaru tersedia.',
    apnsPriority: '5',
  },
  waspada: {
    channelId: 'cmews-waspada',
    androidPriority: 'normal',
    androidColor: '#FFD700',
    apnsInterruptionLevel: 'active',
    defaultTitle: 'Waspada Cuaca BMKG',
    defaultBody: 'Waspada potensi cuaca buruk di wilayah Anda.',
    apnsPriority: '10',
  },
  siaga: {
    channelId: 'cmews-siaga',
    androidPriority: 'high',
    androidColor: '#FF8C00',
    androidVisibility: 'public',
    apnsInterruptionLevel: 'time-sensitive',
    defaultTitle: 'SIAGA Cuaca BMKG',
    defaultBody: 'Potensi cuaca ekstrem meningkat. Segera siaga.',
    apnsPriority: '10',
  },
  awas: {
    channelId: 'cmews-awas',
    androidPriority: 'high',
    androidColor: '#FF0000',
    androidVisibility: 'public',
    androidDefaultSound: true,
    androidDefaultVibrateTimings: true,
    apnsInterruptionLevel: 'time-sensitive',
    defaultTitle: 'AWAS BMKG - DARURAT',
    defaultBody: 'Ancaman cuaca berbahaya. Segera cari lokasi aman.',
    apnsPriority: '10',
    criticalSound: true,
  },
};

function getMessage(
  nativeToken: string,
  type: NotificationType,
  title?: string,
  body?: string,
): admin.messaging.Message {
  const config = configByType[type];
  const severity = severityByType[type];

  return {
    token: nativeToken,
    notification: {
      title: title ?? config.defaultTitle,
      body: body ?? config.defaultBody,
    },
    data: {
      type,
      severity,
      screen: 'forecast',
      wilayah: '34.04',
      timestamp: new Date().toISOString(),
    },
    android: {
      priority: config.androidPriority,
      notification: {
        channelId: config.channelId,
        color: config.androidColor,
        visibility: config.androidVisibility,
        defaultSound: config.androidDefaultSound,
        defaultVibrateTimings: config.androidDefaultVibrateTimings,
      },
    },
    apns: {
      headers: {
        'apns-priority': config.apnsPriority,
      },
      payload: {
        aps: {
          'interruption-level': config.apnsInterruptionLevel,
          sound: config.criticalSound
            ? {
                critical: true,
                name: 'default',
                volume: 1,
              }
            : 'default',
        },
      },
    },
  };
}

app.post('/api/register-device', (req, res) => {
  const { token, deviceName } = req.body as {
    token?: string;
    deviceName?: string;
  };

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'token is required' });
  }

  const trimmedName = typeof deviceName === 'string' && deviceName.trim().length > 0 ? deviceName.trim() : 'Unknown Device';
  devices[token] = {
    token,
    deviceName: trimmedName,
    registeredAt: new Date().toISOString(),
  };

  return res.json({
    success: true,
    message: 'Device registered',
    totalDevices: Object.keys(devices).length,
  });
});

app.options('/api/proxy', (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res.sendStatus(204);
});

app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  console.log('🔄 [Proxy] Forwarding:', targetUrl);

  try {
    // Enable CORS for Expo Web
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CMEWS-App/1.0',
        Accept: 'application/json, application/xml, text/plain, */*',
      },
    });

    const contentType = response.headers.get('content-type') || 'text/plain';
    res.setHeader('Content-Type', contentType);

    const data = await response.text();
    return res.status(200).send(data);
  } catch (error: any) {
    console.error('❌ [Proxy-Error] Failed to fetch target:', targetUrl, error?.message ?? String(error));
    return res.status(502).json({ error: 'Proxy fetch failed', details: error?.message ?? String(error) });
  }
});

app.get('/api/devices', (_req, res) => {
  return res.json({
    devices: Object.values(devices),
  });
});

app.post('/api/test-notification', async (req, res) => {
  const { tokens, type, title, body } = req.body as {
    tokens?: string[];
    type?: NotificationType;
    title?: string;
    body?: string;
  };

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return res.status(400).json({ error: 'tokens array is required and must not be empty' });
  }

  if (!type || !['info', 'waspada', 'siaga', 'awas'].includes(type)) {
    return res.status(400).json({ error: "type must be one of 'info' | 'waspada' | 'siaga' | 'awas'" });
  }

  try {
    const promises = tokens.map((token) => {
      const message = getMessage(token, type, title, body);
      return admin.messaging().send(message);
    });
    
    const results = await Promise.allSettled(promises);
    
    const successfulIds = results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
      .map((r) => r.value);
      
    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => r.reason?.message ?? String(r.reason));

    return res.json({ 
      success: true, 
      messageIds: successfulIds,
      errors: errors.length > 0 ? errors : undefined,
      totalSent: successfulIds.length,
      totalFailed: errors.length
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send notification',
      details,
    });
  }
});

app.get('/', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CMEWS FCM Test Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Inter', sans-serif;
      }
      /* Custom scrollbar for device list */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #0f172a; 
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #334155; 
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #475569; 
      }
    </style>
  </head>
  <body class="bg-slate-950 text-slate-200 min-h-screen p-4 sm:p-8">
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Header Section -->
      <div class="flex items-center space-x-3 mb-8">
        <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">
          C
        </div>
        <div>
          <h1 class="text-2xl font-bold text-slate-50">CMEWS Testing Harness</h1>
          <p class="text-slate-400 text-sm">Push Notification Control Center</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Controls Panel -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-5">
          
          <div>
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">Registered Devices</h2>
              <button onclick="selectAll()" class="text-xs text-blue-400 hover:text-blue-300 font-medium">Select All</button>
            </div>
            
            <div id="deviceList" class="bg-slate-950 border border-slate-800 rounded-lg h-48 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
              <div class="text-sm text-slate-500 p-2 text-center mt-14">Waiting for devices...</div>
            </div>
          </div>

          <div>
            <h2 class="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Trigger Alert Payload</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onclick="sendAlert('info')" class="flex flex-col items-center justify-center p-3 rounded-lg border border-blue-900/50 bg-blue-950/30 hover:bg-blue-900/50 text-blue-400 transition-colors">
                <span class="text-lg mb-1">🔵</span>
                <span class="font-semibold text-sm text-slate-200">INFO</span>
                <span class="text-xs opacity-70">Routine Update</span>
              </button>
              
              <button onclick="sendAlert('waspada')" class="flex flex-col items-center justify-center p-3 rounded-lg border border-yellow-900/50 bg-yellow-950/30 hover:bg-yellow-900/50 text-yellow-400 transition-colors">
                <span class="text-lg mb-1">🟡</span>
                <span class="font-semibold text-sm text-slate-200">WASPADA</span>
                <span class="text-xs opacity-70">Yellow Alert</span>
              </button>
              
              <button onclick="sendAlert('siaga')" class="flex flex-col items-center justify-center p-3 rounded-lg border border-orange-900/50 bg-orange-950/30 hover:bg-orange-900/50 text-orange-400 transition-colors">
                <span class="text-lg mb-1">🟠</span>
                <span class="font-semibold text-sm text-slate-200">SIAGA</span>
                <span class="text-xs opacity-70">Orange Alert</span>
              </button>
              
              <button onclick="sendAlert('awas')" class="flex flex-col items-center justify-center p-3 rounded-lg border border-red-900/50 bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors">
                <span class="text-lg mb-1">🔴</span>
                <span class="font-semibold text-sm text-slate-200">AWAS</span>
                <span class="text-xs opacity-70">Red / Critical</span>
              </button>
            </div>
          </div>
          
        </div>

        <!-- Status Log Panel -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
          <div class="flex justify-between items-center mb-3">
            <h2 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">Terminal Output</h2>
            <button onclick="clearLog()" class="text-xs text-slate-400 hover:text-slate-200">Clear</button>
          </div>
          <div id="log" class="bg-slate-950 border border-slate-800 rounded-lg flex-1 min-h-[300px] p-4 text-xs font-mono text-green-400 overflow-y-auto whitespace-pre-wrap break-all custom-scrollbar">Initializing system...
</div>
        </div>

      </div>
    </div>

    <script>
      const listContainer = document.getElementById('deviceList');
      const logBox = document.getElementById('log');

      function appendLog(value, type = 'normal') {
        const timestamp = new Date().toLocaleTimeString();
        let colorClass = 'text-green-400';
        if (type === 'error') colorClass = 'text-red-400';
        if (type === 'warn') colorClass = 'text-yellow-400';
        
        const next = \`<span class="text-slate-500">[\${timestamp}]</span> <span class="\${colorClass}">\${value}</span>\`;
        logBox.innerHTML = next + '\\n' + logBox.innerHTML;
      }

      function clearLog() {
        logBox.innerHTML = '';
      }

      function selectAll() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="device"]');
        checkboxes.forEach(cb => cb.checked = true);
      }

      // Maintain selection state across re-renders
      let selectedTokens = new Set();

      listContainer.addEventListener('change', (e) => {
        if (e.target && e.target.type === 'checkbox') {
          if (e.target.checked) {
            selectedTokens.add(e.target.value);
          } else {
            selectedTokens.delete(e.target.value);
          }
        }
      });

      async function loadDevices() {
        try {
          const response = await fetch('/api/devices');
          const payload = await response.json();
          const devices = payload.devices ?? [];

          if (devices.length === 0) {
            listContainer.innerHTML = '<div class="text-sm text-slate-500 p-2 text-center mt-14">No registered devices yet</div>';
            return;
          }

          let html = '';
          for (const device of devices) {
            const isChecked = selectedTokens.has(device.token) ? 'checked' : '';
            const shortToken = device.token.slice(0, 16) + '...';
            html += \`
              <label class="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-slate-700">
                <input type="checkbox" name="device" value="\${device.token}" \${isChecked} class="w-4 h-4 rounded border-slate-600 text-blue-600 bg-slate-900 focus:ring-blue-600 focus:ring-offset-slate-900">
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-slate-200">\${device.deviceName}</span>
                  <span class="text-xs text-slate-500 font-mono">\${shortToken}</span>
                </div>
              </label>
            \`;
          }
          listContainer.innerHTML = html;

        } catch (error) {
          appendLog('Error loading devices: ' + (error?.message ?? String(error)), 'error');
        }
      }

      async function sendAlert(type) {
        // Collect currently checked tokens from the DOM to ensure we don't miss anything
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="device"]:checked');
        const tokens = Array.from(checkboxes).map(cb => cb.value);

        if (tokens.length === 0) {
          appendLog('Please select at least one registered device first.', 'warn');
          return;
        }

        appendLog(\`Dispatching \${type.toUpperCase()} payload to \${tokens.length} device(s)...\`, 'normal');
        try {
          const response = await fetch('/api/test-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens, type }),
          });
          const payload = await response.json();
          if (!response.ok) {
            appendLog('FAILED: ' + JSON.stringify(payload), 'error');
            return;
          }
          
          appendLog(\`SUCCESS: Sent \${payload.totalSent}, Failed \${payload.totalFailed}\`, 'normal');
          if (payload.errors) {
             appendLog('Errors: ' + JSON.stringify(payload.errors), 'error');
          }
        } catch (error) {
          appendLog('FAILED: ' + (error?.message ?? String(error)), 'error');
        }
      }

      loadDevices();
      setInterval(loadDevices, 4000);
    </script>
  </body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`CMEWS test server listening on http://localhost:${PORT}`);
});
