#!/bin/bash
cd /home/kavia/workspace/code-generation/interactive-tictactoe-58252-2bcef129/tic_tac_toe_frontend_workspace/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

