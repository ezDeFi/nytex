#!/bin/bash

while true; do
    yarn spam:local sell 13
    sleep 6s
    yarn spam:local buy 13
    sleep 6s
done
