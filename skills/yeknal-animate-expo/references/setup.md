# Setup and performance environment

Load this when motion does not run, or before judging feel on a device.

## Setup that silently breaks motion

- Install through Expo so versions match the SDK: `npx expo install react-native-reanimated react-native-worklets`. In an Expo project, `babel-preset-expo` configures the worklets Babel plugin automatically — no `babel.config.js` step. Only a bare RN project without that preset adds the plugin manually, and there it must be last in the list. A missing or misplaced plugin doesn't silently fall back anymore — it throws `Failed to create a worklet` at runtime.
- `GestureHandlerRootView` must wrap the app, or gestures do nothing with no error.
- Reanimated 4 requires the New Architecture.
- **Expo Go is not a performance environment.** Judge feel in a release build; a dev build's JS thread is slow enough to hide exactly the problems you're looking for.

## 120fps

On ProMotion iPhones, third-party animations are capped at 60fps unless `CADisableMinimumFrameDurationOnPhone` is set. Recent Expo SDKs set it by default — confirm it's there, and add it if not:

```json
{ "expo": { "ios": { "infoPlist": { "CADisableMinimumFrameDurationOnPhone": true } } } }
```

Then the frame budget is 8ms, not 16. This is also why a UI-thread animation matters more on mobile than it does on web.
