# RiDM website
#
# make dev       live-reloading dev server, opens /ko in the browser
# make preview   build the static export and serve it exactly as Pages will
# make build     static export into out/
# make check     TypeScript only, no build
# make rebuild   clean then build, after renaming or deleting a route
# make clean     drop .next/ and out/
# make deploy    build, then push main (the workflow publishes)

SHELL := /bin/bash
.DEFAULT_GOAL := help

PORT ?= 8000
DEV_PORT ?= 3000
OUT := out

# Canonical URLs, hreflang, sitemap.xml, robots.txt and JSON-LD are baked in at
# build time, so preview with the same origin the deploy workflow uses.
SITE_URL ?= https://gino-comp.github.io

BROWSER ?= $(shell command -v google-chrome || command -v google-chrome-stable \
	|| command -v chromium || command -v xdg-open)

.PHONY: help install check build rebuild preview dev clean deploy

help:
	@sed -n 's/^# \(make .*\)/  \1/p' $(MAKEFILE_LIST)

# Re-install only when the manifests are newer than the tree.
node_modules: package.json package-lock.json
	npm install
	@touch $@

install: node_modules

check: node_modules
	npx tsc --noEmit

# `next build` type-checks on its own, so this does not depend on `check`.
build: node_modules
	NEXT_PUBLIC_SITE_URL=$(SITE_URL) npx next build

# Generated route types under .next/ go stale when a route is renamed.
rebuild: clean build

# Serves out/ as plain files, which is what GitHub Pages does. Unlike `make
# dev`, `/` works here: the redirect to /ko is public/index.html, a static file
# that only takes effect in the export.
preview: build
	@$(if $(BROWSER),,$(error No browser found. Pass one: make preview BROWSER=/path/to/chrome))
	@python3 -m http.server $(PORT) --bind 127.0.0.1 --directory $(OUT) >/dev/null 2>&1 & \
	server=$$!; \
	trap 'kill $$server 2>/dev/null' EXIT INT TERM; \
	until curl -sfo /dev/null http://localhost:$(PORT)/; do sleep 0.2; done; \
	echo "serving $(OUT)/ at http://localhost:$(PORT) — Ctrl+C to stop"; \
	"$(BROWSER)" http://localhost:$(PORT)/ >/dev/null 2>&1 & \
	wait $$server

# Opens /ko/, not /: the root redirect is a static file the dev server does not
# serve, so `/` 404s here. The trailing slash matches trailingSlash: true and
# avoids a 308 hop.
dev: node_modules
	@$(if $(BROWSER),,$(error No browser found. Pass one: make dev BROWSER=/path/to/chrome))
	@( until curl -sfo /dev/null http://localhost:$(DEV_PORT)/ko/; do sleep 0.4; done; \
	   "$(BROWSER)" http://localhost:$(DEV_PORT)/ko/ >/dev/null 2>&1 ) & \
	npx next dev -p $(DEV_PORT)

clean:
	rm -rf .next $(OUT)

deploy: build
	git push origin main
