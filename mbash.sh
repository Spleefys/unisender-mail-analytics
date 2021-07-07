#!/bin/sh
kill $(ps -A | grep "node" | awk '{print $1}')
cd /home/scripts/mailan/
node savetemp.js
node savecamp.js
nohup node script.js > /dev/null 2>&1 &