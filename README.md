# Tableperk Mobile

React Native (Expo) version of the Tableperk restaurant-deals experience — Android & iOS from one codebase.

**Expo SDK 57** (matches current Expo Go).

## Features

- **Discover** — search, cuisine filters, time filter, sort by discount/rating
- **Restaurant detail** — overview, discounted sample menu, related venues
- **Saved favourites** — persisted with AsyncStorage
- **Demo login** — customer or restaurant partner
- **Restaurant workspace** — date-based menu editor (add / edit / remove / availability / publish)

## Demo credentials

| Field    | Value                 |
|----------|-----------------------|
| Email    | `demo@tableperk.test` |
| Password | `tableperk123`        |

## Run

```bash
git pull
rm -rf node_modules
npm install
npx expo start --clear
```

Open the project in **Expo Go** (SDK 57) on your phone, or press `a` / `i` for an emulator.

If packages still mismatch Expo Go:

```bash
npx expo install --fix
npx expo start --clear
```

## Companion web app

The original static website lives at [vjmadus-svg/TablePerk](https://github.com/vjmadus-svg/TablePerk).


## Connected customer app

Set `EXPO_PUBLIC_API_URL` using `.env.example` and deploy the companion TablePerk backend with migration 002. Run `npm install`, then `npx expo start`. Username/password sign-in and customer registration use the API. The device stores a 30-day session token in Expo SecureStore; passwords are never stored. Saved venues and debounced search history are stored in PostgreSQL for the signed-in user. Signing out clears account data on the device.

The savings planner lists restaurant-published offers by date and time and highlights the largest published percentage. The bill field estimates savings; it does not predict unpublished discounts. Claims currently use one guest and arrival in 15 minutes (or the offer end time if sooner). Restaurant staff must complete redemption through the existing API. The bell shows persistent claim/redemption notifications, refreshes every 30 seconds and on foreground, and supports marking read. These are in-app notifications, not background push notifications.

Restaurant metadata and menu prices come from the backend, so populate those fields and publish offers rather than relying on the previous static sample catalog. Partner menu editing remains the existing local draft workflow.

Validation: `npm run typecheck`.
