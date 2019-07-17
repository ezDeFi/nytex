#!/bin/bash
export CONDEP=1
while true; do
    yarn load:local sell 1
    sleep 6s
    yarn load:local buy 1
    sleep 6s
done
