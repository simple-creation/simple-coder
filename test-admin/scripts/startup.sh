#!/bin/sh


cpu=1

if [ -n "$CDOS_CPUS" ]; then
	# docker
	cpu=$(printf "%.0f" $CDOS_CPUS)
else
	# vm
	cpu=$(cat /proc/cpuinfo | grep "processor" | wc -l)
fi

if [ $cpu -lt 1 ]; then
	cpu=1
fi

if [ $cpu -gt 8 ]; then
	cpu=8
fi

if [ -e /opt/nodeapp ]; then
	# docker
	appid=$app_id
	cd /opt/nodeapp
else
	# vm
	cd $(dirname $BASH_SOURCE)
	cd ..
	appid=$(basename $(pwd))
	cd current
fi

appname=node-app-$appid
pm2 delete $appname
pm2 web
pm2 start ./index.js\
	-i $cpu\
	--name $appname\
	--merge-logs\
	--log-date-format="YYYY-MM-DD HH:mm:ss"\
	--log /opt/logs/$appid/outerr.log\
	--output /opt/logs/$appid/out.log\
	--error /opt/logs/$appid/err.log
pm2 dump






