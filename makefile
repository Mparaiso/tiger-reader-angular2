

all: run

run:  watch
	@(live-server & )

watch:
	@(tsc --watch & )

.PHONY: all run watch