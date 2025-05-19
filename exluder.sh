#!/bin/bash

mkdir -p ./public/junk

for file in ./src/app/writepad/*.ts; do 
	[ -f "$file" ] && mv "$file" "${file%.ts}.bin"
done

mv ./src/app/writepad ./public/junk/

npm run build 

mv ./public/junk ./src/app

for file in ./src/app/writepad/*.bin; do 
	[ -f "$file" ] && mv "$file" "${file%.bin}.ts"
done


