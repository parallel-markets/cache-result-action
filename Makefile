build:
	rm -rf dist/*.*
	npm install

test:
	npm run lint
	git diff --quiet || echo 'Did you forget to run `make build`?'

tag-edge:
	git tag -f edge HEAD && git push -f origin edge

.PHONY: dist tag-edge
