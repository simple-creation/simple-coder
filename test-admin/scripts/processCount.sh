#!/bin/bash
scriptsDir=$(dirname $BASH_SOURCE)
cat ${scriptsDir%%/}/"../node_modules/@ctrip/node-vampire-vi/.state.json" 