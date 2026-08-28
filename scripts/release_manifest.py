import json
import pathlib
import sys

version = sys.argv[1]
root = pathlib.Path(sys.argv[2])
base = f"https://github.com/B-Divyesh/sf-photo-upload-audit/releases/download/{version}"
assets = {}
for path in sorted(root.iterdir()):
    name = path.name
    if name in {"SHA256SUMS", "latest.json"}:
        continue
    key = "other"
    lower = name.lower()
    if lower.endswith((".msi", ".exe")):
        key = "windows"
    elif lower.endswith((".appimage", ".deb")):
        key = "linux"
    elif lower.endswith(".dmg"):
        key = "macos-arm64" if "aarch64" in lower or "arm64" in lower else "macos-x64"
    assets.setdefault(key, []).append({"name": name, "url": f"{base}/{name}"})
print(json.dumps({"version": version, "platforms": assets}, indent=2))
