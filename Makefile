build:
	rm -rf dist/*.*
	npm install

test:
	npm run lint
	@git diff --quiet dist/ || echo 'Found uncommitted changes in `dist/`! Did you forget to run `make build` and commit the result?'

tag-edge:
	git tag -f edge HEAD && git push -f origin edge

.PHONY: dist tag-edge
