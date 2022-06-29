#!/bin/ash

echo "HELLO WORLD"
cp -r /cache/node_modules/. /api/node_modules/
echo "HELLO WORLD BIS"

#ln -s /cache/node_modules /api/node_modules
exec npm run start:dev
