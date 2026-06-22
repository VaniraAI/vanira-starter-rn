# vanira-starter-rn

Minimal **React Native** app with [`@vanira/react-native-sdk`](https://www.npmjs.com/package/@vanira/react-native-sdk) — **`VaniraCallBox`** for voice + preset modals (camera, upload, forms) and session continue/resume.

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

## SDK dependency

The starter installs the published SDK from npm:

```json
"@vanira/react-native-sdk": "^0.1.3"
```

`metro.config.js` pins peer native modules to the app’s `node_modules`. After upgrading the SDK, restart Metro with a clean cache:

```bash
npm start -- --reset-cache
```

## What's included

| File | Purpose |
|------|---------|
| `index.js` | `registerGlobals()` from `react-native-webrtc` (required) |
| `App.tsx` | Headless voice UI (`VaniraCallProvider` + custom orb) |
| `examples/vanira-call-box/App.tsx` | **`VaniraCallBox`** — drop-in voice pill + preset modals |
| `metro.config.js` | Resolves SDK peer deps from the app |
| `src/screens/HomeScreen.tsx` | Headless demo screen |
| `src/config/vanira.ts` | Agent ID + API key (from `.env`) |
| `src/config/runtime.ts` | RN runtime + AsyncStorage session persistence |

Default app is **headless**. To run the **VaniraCallBox** example, swap the import in `index.js`:

```js
import App from './examples/vanira-call-box/App';
```

`VaniraCallBox` wraps `PresetHostProvider` and handles call lifecycle, mute, and preset routing. Use `renderCallUI` for a custom pill, or `@vanira/react-native-sdk/headless` for full control.

## Custom UI

See `examples/vanira-call-box/App.tsx` for the full example. Minimal usage:

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
} from '@vanira/react-native-sdk/headless';
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
