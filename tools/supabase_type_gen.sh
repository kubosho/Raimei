#!/bin/bash

# source: https://gist.github.com/mattak/5d532e5d78d311a3c75ac56f948bbebd
function import_env() {
  for kv in $(< $1)
    do
      if [[ "$kv" = ^\s*$ ]] || [[ "$kv" =~ ^# ]]; then
        continue
      fi
    export $kv
  done
}

import_env .env

SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN npx -y supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > ./auto_generated_types/database.types.ts
