wrk2 -t2 -c50 -d10s -R10 --latency https://${ENVIRONMENT:-dev}-api.pushbutton.dev/status > 10
wrk2 -t2 -c50 -d10s -R50 --latency https://${ENVIRONMENT:-dev}-api.pushbutton.dev/status > 50
wrk2 -t2 -c50 -d10s -R100 --latency https://${ENVIRONMENT:-dev}-api.pushbutton.dev/status > 100
cat 10 50 100 | wrk2img latency.png
