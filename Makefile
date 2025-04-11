build:
	rm -rf dist/*.*
	npm install

tag-edge:
	git tag -f edge HEAD && git push -f origin edge

.PHONY: dist tag-edge
