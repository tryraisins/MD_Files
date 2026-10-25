---
name: "yeknal-screenshot"
description: "Capture a desktop or system screenshot (full screen, specific app or window, or a pixel region) when the user asks for one or no tool-specific capture exists."
metadata:
  internal: true
---

# Screenshot Capture

Save-location rules, every time:

1. Save to the user's specified path when they give one.
2. With no path requested, save to the OS default screenshot location.
3. When you need a screenshot for your own inspection, save to the temp directory.

## Tool priority

- Prefer a tool-specific screenshot capability when one exists (a Figma MCP or skill for Figma files, `yeknal-playwright` for browser and Electron page content).
- Use this skill when it is explicitly requested, for whole-system desktop captures, or when the tool-specific capture cannot get what you need.
- Otherwise this is the default for desktop apps that lack a better-integrated capture tool.

## macOS permission preflight

On macOS, run the preflight helper once before window or app capture. It checks Screen Recording permission, explains why it is needed, and requests it in one place.

```bash
bash <path-to-skill>/scripts/ensure_macos_permissions.sh
```

Combine preflight and capture in one command when the environment prompts per invocation:

```bash
bash <path-to-skill>/scripts/ensure_macos_permissions.sh && \
python3 <path-to-skill>/scripts/take_screenshot.py --app "<App>" --mode temp
```

## Capture

Use the bundled helper; do not re-derive OS commands.

```bash
# macOS and Linux
python3 <path-to-skill>/scripts/take_screenshot.py [options]
```

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File <path-to-skill>/scripts/take_screenshot.ps1 [options]
```

| Need | Python helper | PowerShell helper |
| --- | --- | --- |
| Default location | no options | no options |
| Temp location | `--mode temp` | `-Mode temp` |
| Explicit path | `--path output/screen.png` | `-Path "C:\Temp\screen.png"` |
| Pixel region | `--region 100,200,800,600` | `-Region 100,200,800,600` |
| Active window | `--active-window` | `-ActiveWindow` (focus it first) |
| App or window by name | `--app "App"`, `--window-name "Settings"`, `--list-windows` (macOS only) | not supported |
| Window id | `--window-id 12345` | `-WindowHandle 123456` (only when provided) |

The script prints one path per capture. When multiple windows or displays match, it prints one path per line with suffixes such as `-w<windowId>` or `-d<display>`; view each path in order.

Worked flows:

- "Take a look at <App> and tell me what you see": capture to temp, then view each printed path in order.
- "The design from Figma does not match the implementation": capture the design with the Figma tool first, then the running app with this skill, and compare the raw screenshots before any manipulation.

## Platform notes

- macOS full-screen captures save one file per display. `--app`, `--window-name`, and `--list-windows` are macOS-only.
- Linux and Windows full-screen captures use the virtual desktop; use `--region` to isolate one display. On Linux, the helper picks the first available of `scrot`, `gnome-screenshot`, or ImageMagick `import`; region capture needs `scrot` or `import`.

## Error handling

- If capture is blocked by sandbox or Screen Recording permission, report the exact block and ask the user to grant access; do not silently retry.
- If macOS app or window capture returns no matches, run `--list-windows --app "<App>"`, confirm the app is visible, then retry with `--window-id`.
- If Linux region or window capture fails, check tool availability with `command -v scrot`, `command -v gnome-screenshot`, and `command -v import`.
- Always report the saved file path in the response.
