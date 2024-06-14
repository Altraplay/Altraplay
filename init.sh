#!/bin/bash

echo "Initializing Project Tech Gunner 💎"
bun i
bun ./database/schema.ts
bun ./database/clickhuseSchema.ts

docker compose watch