Start-Process powershell -ArgumentList "-Command cd test-server; npm run dev" -NoNewWindow
npx ngrok http 3003
