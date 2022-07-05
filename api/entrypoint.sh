#!/bin/ash

#cp -r /cache/node_modules.tar /api/
# tar -xvf /cache/node_modules.tar -C /api/
#ln -s /cache/node_modules /api/node_modules
# cp -r /cache/node_modules/. /api/node_modules/

npm install
exec npm run start:dev
