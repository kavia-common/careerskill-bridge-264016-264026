#!/bin/bash
cd /home/kavia/workspace/code-generation/careerskill-bridge-264016-264026/frontend_web_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

