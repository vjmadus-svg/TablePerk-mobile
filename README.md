# Tableperk Mobile

React Native (Expo) version of the Tableperk restaurant-deals experience — Android & iOS from one codebase.

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

## Stack

- Expo SDK 52 + Expo Router (file-based navigation)
- TypeScript
- Zustand + AsyncStorage (persisted state)
- Custom design system matching the original web palette

## Run

```bash
npm install
npx expo start
```

If Metro complains about a missing Expo package, install SDK-aligned deps with:

```bash
npx expo install expo-asset expo-font expo-splash-screen
npx expo start --clear
```

Then press `a` for Android emulator / device, or `i` for iOS simulator. Scan the QR code with Expo Go on a physical phone.

## Project structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab navigator
│   │   ├── index.tsx       # Discover / home
│   │   ├── saved.tsx
│   │   └── account.tsx
│   ├── restaurant/[id].tsx # Detail
│   └── workspace/          # Partner menu editor
├── src/
│   ├── components/
│   ├── data/
│   ├── store/
│   ├── theme/
│   ├── types/
│   └── utils/
├── app.json
└── package.json
```

## Notes

- This is a **frontend demo**. No real authentication or shared database.
- Menu drafts and saved restaurants live only on the device.
- For production: replace the Zustand persist layer with authenticated API calls and tenant-scoped storage.
- Icons are from `@expo/vector-icons` (Ionicons).
- Images load from Unsplash (network required).

## Companion web app

The original static website lives at [vjmadus-svg/TablePerk](https://github.com/vjmadus-svg/TablePerk).

## Design tokens

| Token   | Value     |
|---------|-----------|
| Orange  | `#FF5B35` |
| Cream   | `#FFF7EF` |
| Ink     | `#20201D` |
| Yellow  | `#FFD766` |
| Line    | `#E8E1D9` |
