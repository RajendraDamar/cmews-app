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
  const { nativeToken, type, title, body } = req.body as {
    nativeToken?: string;
    type?: NotificationType;
    title?: string;
    body?: string;
  };

  if (!nativeToken || typeof nativeToken !== 'string') {
    return res.status(400).json({ error: 'nativeToken is required' });
  }

  if (!type || !['info', 'waspada', 'siaga', 'awas'].includes(type)) {
    return res.status(400).json({ error: "type must be one of 'info' | 'waspada' | 'siaga' | 'awas'" });
  }

  try {
    const message = getMessage(nativeToken, type, title, body);
    const messageId = await admin.messaging().send(message);
    return res.json({ success: true, messageId });
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
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        margin: 0;
        font-family: Inter, Segoe UI, Arial, sans-serif;
        background: #0f172a;
        color: #e2e8f0;
      }
      .container {
        max-width: 880px;
        margin: 24px auto;
        padding: 20px;
      }
      .card {
        background: #111827;
        border: 1px solid #334155;
        border-radius: 14px;
        padding: 18px;
        margin-bottom: 16px;
      }
      h1 {
        margin-top: 0;
      }
      select {
        width: 100%;
        background: #0b1220;
        color: #e2e8f0;
        border: 1px solid #334155;
        border-radius: 10px;
        font-size: 15px;
        padding: 10px;
      }
      .buttons {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-top: 14px;
      }
      button {
        border: 0;
        border-radius: 10px;
        padding: 12px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .info {
        background: #2563eb;
        color: white;
      }
      .waspada {
        background: #facc15;
        color: #1f2937;
      }
      .siaga {
        background: #fb923c;
        color: #1f2937;
      }
      .awas {
        background: #ef4444;
        color: white;
      }
      #log {
        background: #020617;
        border: 1px solid #334155;
        border-radius: 10px;
        min-height: 180px;
        padding: 12px;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        font-family: Consolas, monospace;
        font-size: 13px;
      }
      @media (max-width: 640px) {
        .buttons {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <h1>CMEWS Push Notification Testing Harness</h1>
        <p>Select a registered device then trigger BMKG alert levels with real FCM/APNs delivery.</p>
        <select id="deviceSelect"></select>
        <div class="buttons">
          <button class="info" onclick="sendAlert('info')">🔵 Send INFO (Routine Update)</button>
          <button class="waspada" onclick="sendAlert('waspada')">🟡 Send WASPADA (Yellow Alert)</button>
          <button class="siaga" onclick="sendAlert('siaga')">🟠 Send SIAGA (Orange Alert - Wakes Device)</button>
          <button class="awas" onclick="sendAlert('awas')">🔴 Send AWAS (HIGH ALERT - Max Priority + Siren)</button>
        </div>
      </div>
      <div class="card">
        <h2>Status Log</h2>
        <div id="log">Waiting for device registration...</div>
      </div>
    </div>
    <script>
      const select = document.getElementById('deviceSelect');
      const logBox = document.getElementById('log');

      function appendLog(value) {
        const timestamp = new Date().toISOString();
        const next = '[' + timestamp + '] ' + value;
        logBox.textContent = next + '\\n' + logBox.textContent;
      }

      async function loadDevices() {
        try {
          const response = await fetch('/api/devices');
          const payload = await response.json();
          const devices = payload.devices ?? [];

          const previousValue = select.value;
          select.innerHTML = '';

          if (devices.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No registered devices yet';
            select.appendChild(option);
            return;
          }

          for (const device of devices) {
            const option = document.createElement('option');
            option.value = device.token;
            option.textContent = device.deviceName + ' · ' + device.token.slice(0, 14) + '...';
            select.appendChild(option);
          }

          if (previousValue && devices.some((d) => d.token === previousValue)) {
            select.value = previousValue;
          }
        } catch (error) {
          appendLog('Error loading devices: ' + (error?.message ?? String(error)));
        }
      }

      async function sendAlert(type) {
        const nativeToken = select.value;
        if (!nativeToken) {
          appendLog('Select a registered device first.');
          return;
        }

        appendLog('Sending ' + type.toUpperCase() + ' notification...');
        try {
          const response = await fetch('/api/test-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nativeToken, type }),
          });
          const payload = await response.json();
          if (!response.ok) {
            appendLog('FAILED: ' + JSON.stringify(payload, null, 2));
            return;
          }
          appendLog('SUCCESS: messageId=' + payload.messageId);
        } catch (error) {
          appendLog('FAILED: ' + (error?.message ?? String(error)));
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
