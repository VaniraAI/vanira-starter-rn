# vanira-starter-rn

Minimal **React Native** app with [`@vanira/sdk-react-native`](https://www.npmjs.com/package/@vanira/sdk-react-native) — **`VaniraCallBox`** for voice + preset modals (camera, upload, forms) and session continue/resume.

## Prerequisites

- Node.js 22+
- Xcode 15+ (iOS) or Android Studio (Android)
- CocoaPods (`gem install cocoapods`)
- A Vanira **agent ID** and **publishable key** (`pk_live_*`) from [vanira.io](https://vanira.io) → API Keys

## Quick start

```bash
git clone https://github.com/VaniraAI/vanira-starter-rn.git
cd vanira-starter-rn
npm install
cp .env.example .env
# Edit .env with VANIRA_AGENT_ID and VANIRA_API_KEY
```

iOS:

```bash
cd ios && pod install && cd ..
npm run ios
```

Android:

```bash
npm run android
```

Android:

```bash
npm run android
```

## Local SDK (before npm publish)

The starter uses the SDK from the Vanira monorepo:

```json
"@vanira/sdk-react-native": "file:../vanira-dashboard/react-native-mobile/vanira-sdk-rn"
```

`metro.config.js` bundles SDK TypeScript from that path. Clone layout:

```
Documents/
  vanira-starter-rn/
  vanira-dashboard/react-native-mobile/vanira-sdk-rn/
```

After SDK changes or first install, restart Metro with a clean cache:

```bash
npm start -- --reset-cache
```

When `@vanira/sdk-react-native@0.0.4+` is on npm, switch the dependency to `"^0.0.4"` and simplify `metro.config.js`.

## What's included

| File | Purpose |
|------|---------|
| `index.js` | `registerGlobals()` from `react-native-webrtc` (required) |
| `App.tsx` | `VaniraCallBox` — voice pill + preset host |
| `metro.config.js` | Resolves local `@vanira/sdk-react-native` from source |
| `src/screens/HomeScreen.tsx` | Simple hero screen |
| `src/config/vanira.ts` | Agent ID + API key (from `.env`) |
| `src/config/runtime.ts` | RN runtime + AsyncStorage session persistence |

`VaniraCallBox` wraps `PresetHostProvider` and handles call lifecycle, mute, and preset routing. Use `renderCallUI` for a custom pill, or `@vanira/sdk-react-native/headless` for full control.

## Custom UI

```tsx
<VaniraCallBox
  agentId={...}
  apiKey={...}
  renderCallUI={props => <MyVoiceBar {...props} />}
>
  <HomeScreen />
</VaniraCallBox>
```

## Headless alternative

```tsx
import {
  PresetHostProvider,
  VaniraCallProvider,
  useVaniraCall,
} from '@vanira/sdk-react-native/headless';
```

See [RN SDK docs](https://vanira.io/docs#rn-sdk-headless).

## Permissions

**iOS** — `ios/Podfile` configures Camera, Microphone, PhotoLibrary via `react-native-permissions`. `Info.plist` includes usage descriptions.

**Android** — `AndroidManifest.xml` includes `RECORD_AUDIO`, `CAMERA`, and media read permissions.

## Peer dependencies

The starter already installs the native modules the SDK needs:

- `react-native-webrtc`, `react-native-incall-manager`, `react-native-permissions`
- `react-native-svg` (VaniraCallBox chrome icons)
- `react-native-image-picker`, `@react-native-documents/picker` (upload)
- `react-native-vision-camera` (live vision), `react-native-view-shot` (screenshots)
- `@react-native-async-storage/async-storage` (session continue)

## Docs & community

- [React Native SDK docs](https://vanira.io/docs#rn-sdk-install)
- [Template agents](https://vanira.io/templates)
- [Discord](https://discord.gg/GB3yJMvf)
- [VaniraAI on GitHub](https://github.com/VaniraAI)

## License

MIT — see [LICENSE](LICENSE).
