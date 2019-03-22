#!/bin/bash

while IFS=":" read functionName domain handler mock
do
  echo -e ""
  echo "Calling function $functionName for test in lambda";
  eval test/e2e/emulator.sh $functionName $domain $handler $mock
  ret_code=$?
  if [[ $ret_code -eq 1 ]]
  then
    echo "DISAPPROVED!"
    exit 1
  else
    echo "APPROVED!"
  fi
done < test/e2e/functions.txt
