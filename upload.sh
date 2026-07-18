#!/bin/bash
cd "$(dirname "$0")"
git add .
git commit -m "upload $(date '+%Y-%m-%d %H:%M')"
git push origin main
echo "Done! Files uploaded to GitHub."
