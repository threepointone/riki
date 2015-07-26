build:
	npm run build

bundle:
	npm run bundle

test:
	npm test

cover:
	istanbul cover node_modules/.bin/_mocha

dev:
	./node_modules/.bin/babel-node server.js

hot:
	HOT=1 make dev

.PHONY: build test size dev cover