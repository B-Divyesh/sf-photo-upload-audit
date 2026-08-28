#!/bin/sh
set -eu

repo="B-Divyesh/sf-photo-upload-audit"
release="https://api.github.com/repos/$repo/releases/latest"
os="$(uname -s)"
arch="$(uname -m)"

case "$os:$arch" in
  Darwin:arm64) pattern='aarch64.*\.dmg$' ;;
  Darwin:*) pattern='x64.*\.dmg$|x86_64.*\.dmg$' ;;
  Linux:*) pattern='\.AppImage$' ;;
  *) echo "Use install.ps1 on Windows, or download from the release page." >&2; exit 1 ;;
esac

json="$(curl -fsSL "$release")"
url="$(printf '%s' "$json" | sed -n 's/.*"browser_download_url": "\([^"]*\)".*/\1/p' | grep -Ei "$pattern" | head -n 1)"
test -n "$url" || { echo "No matching release asset is published yet." >&2; exit 1; }
name="${url##*/}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
curl -fsSL "$url" -o "$tmp/$name"
curl -fsSL "https://github.com/$repo/releases/latest/download/SHA256SUMS" -o "$tmp/SHA256SUMS"
(cd "$tmp" && grep " $name$" SHA256SUMS | sha256sum -c -)
echo "Verified $name. Opening the installer…"
case "$os" in
  Darwin) open "$tmp/$name"; trap - EXIT ;;
  Linux) chmod +x "$tmp/$name"; mkdir -p "$HOME/.local/bin"; cp "$tmp/$name" "$HOME/.local/bin/photo-upload-audit"; echo "Installed to $HOME/.local/bin/photo-upload-audit" ;;
esac
