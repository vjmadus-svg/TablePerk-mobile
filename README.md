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
