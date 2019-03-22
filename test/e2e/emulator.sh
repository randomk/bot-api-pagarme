#!/bin/bash

#example usage: npm run test bot-get bot get.index

dir=$PWD
lib=lib/artifacts
artifactPath=$lib/$1
vol="$dir/$artifactPath"
payload=$(cat "$4")
descompressedDir="$dir/$lib/$1/"
zipFile="$vol.zip"

if [ ! -f $zipFile ] 
then
  echo "File not found"
  exit 1
fi

#echo "Descompressing in path: $vol"
unzip -qq -o $zipFile -d $descompressedDir

#echo "Testing in path: $vol"

cmd="docker run --cpus=\".5\" --rm -v \"$vol\":/var/task -e AWS_LAMBDA_FUNCTION_MEMORY_SIZE=\"128\" -e DATABASE_HOST=\"ds147073.mlab.com\" -e DATABASE_USER=\"chatbot\" -e DATABASE_PASSWORD=\"kurupira2018\" -e DATABASE_PORT=\"47073\" -e DATABASE_NAME=\"chatbotv1\" lambci/lambda:nodejs8.10 functions/$2/$3 '$payload'"
# echo $cmd;

log="test/e2e/logs/$2-$3.txt"
eval $cmd > $log;

result=$(cat "$log");
#echo "Result --> $result"
rm $log

#echo "Removing dir $descompressedDir";
rm -r $descompressedDir;

[[ $result =~ \"statusCode\"\:200 ]] && exit 0 || exit 1
