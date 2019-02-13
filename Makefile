install:
	npm install

start:
	npx babel-node -- src/bin/gendiff.js

test:
	npm test

watch:
	npm test -- --watch

publish:
	npm publish

lint:
	npx eslint .