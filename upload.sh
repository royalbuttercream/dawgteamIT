#!/bin/bash
cd "$(dirname "$0")" || exit 1
# Scoped adds only. Never `git add .` — that stages logs, screenshots, and
# stray files. merged/ and per-page mock/ are build output and gitignored.
git add tooling images docs .claude
git commit -m "upload $(date '+%Y-%m-%d %H:%M')"
git push origin main
echo "Done! Files uploaded to GitHub."
