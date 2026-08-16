---
name: dynamic-mock-engine
description: Guidelines for generating dynamic, randomized weather and notification data during the prototyping phase.
---

# Dynamic Mock Engine Skill

During prototyping, all data must simulate live network conditions without making actual HTTP requests.

## Weather Data Randomization
When `getWeatherForecast()` is called, generate an array of data that mimics the BMKG 3-hour interval structure, but randomize the values:
- **Temperature:** `Math.floor(Math.random() * (35 - 24 + 1)) + 24`
- **Humidity:** `Math.floor(Math.random() * (100 - 60 + 1)) + 60`
- **Weather Condition:** Randomly select from `['Sunny', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Thunderstorm']`.
- **Wind Speed:** `Math.floor(Math.random() * 40)`

## Push Notification Payload Randomization
When triggering test notifications via the Expo Push API, randomize the payload:
1. **Low Risk:** Title: "Weather Update", Body: "Light rain expected.", Data: `{ severity: 'low', color: '#3b82f6' }`
2. **Medium Risk:** Title: "Weather Alert", Body: "Warning: Heavy winds.", Data: `{ severity: 'medium', color: '#f59e0b' }`
3. **High Risk:** Title: "CRITICAL ALERT", Body: "Thunderstorm and flooding risk!", Data: `{ severity: 'high', color: '#ef4444' }`