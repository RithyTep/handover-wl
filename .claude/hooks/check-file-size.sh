#!/bin/bash
# PostToolUse hook: warn when a written/edited file exceeds its type line limit.
# Claude Code passes tool context as JSON on stdin.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null)

[ -z "$FILE_PATH" ] && exit 0
[ ! -f "$FILE_PATH" ] && exit 0

LINES=$(wc -l < "$FILE_PATH" | tr -d ' ')
LIMIT=0
LABEL=""

if [[ "$FILE_PATH" =~ /app/api/.+/route\.ts$ ]]; then
  LIMIT=80; LABEL="API route"
elif [[ "$FILE_PATH" =~ /server/services/.+\.ts$ ]]; then
  LIMIT=250; LABEL="Service"
elif [[ "$FILE_PATH" =~ /server/repository/.+\.ts$ ]]; then
  LIMIT=200; LABEL="Repository"
elif [[ "$FILE_PATH" =~ /components/.+\.tsx?$ ]]; then
  LIMIT=200; LABEL="Component"
elif [[ "$FILE_PATH" =~ /hooks/.+\.ts$ ]]; then
  LIMIT=100; LABEL="Hook"
elif [[ "$FILE_PATH" =~ /lib/.+\.ts$ ]]; then
  LIMIT=150; LABEL="Utility"
fi

if [ "$LIMIT" -gt 0 ] && [ "$LINES" -gt "$LIMIT" ]; then
  echo "⚠️  File size warning: $(basename "$FILE_PATH") is $LINES lines (limit: $LIMIT for $LABEL). Consider splitting."
fi

exit 0
