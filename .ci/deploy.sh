#!/bin/bash
# DEPLOY LAMBDA FUNCTION

if [ -z $2 ] 
then
  npm run deploy:$1
else 
  npm run function:$1 -- --function $2
fi
