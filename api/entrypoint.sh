#!/bin/ash

npm install && npm audit fix

exec npm run start:dev
