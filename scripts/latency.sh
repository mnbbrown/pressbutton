
set -ev

URL=https://${ENVIRONMENT:-dev}-api.pushbutton.dev/status
curl -v $URL
wrk2 -t2 -c50 -d10s -R10 --latency $URL > 10
wrk2 -t2 -c50 -d10s -R50 --latency $URL > 50
wrk2 -t2 -c50 -d10s -R100 --latency $URL > 100
cat 10 50 100 | wrk2img latency.png
