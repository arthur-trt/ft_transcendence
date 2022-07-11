#!/bin/ash

echo "BONSOIR"
npm install && npm audit fix

exec npm run start:dev
