.PHONY: all
all: assets

.PHONY: assets
assets: www/assets/wasm/pkg www/assets/scripts/index.js

www/assets/wasm/pkg: animation/pkg
	cp -r animation/pkg www/assets/wasm/pkg

animation/pkg: animation/src/lib.rs
	cd animation && wasm-pack build --target web

www/assets/scripts/index.js: animation/pkg ui/index.ts ui/tsconfig.json ui/package-lock.json
	cd ui && npx tsc
	cp ui/index.js www/assets/scripts/index.tmp.js
	sed "s!../animation/pkg/animation!../wasm/pkg/animation.js!g" www/assets/scripts/index.tmp.js > www/assets/scripts/index.js
	rm www/assets/scripts/index.tmp.js

ui/package-lock.json:
	cd ui && npm install

.PHONY: serve
serve: assets
	python3 -m http.server -d www 8080

clean:
	rm -rf animation/target animation/pkg animation/Cargo.lock
	rm -rf ui/node_modules ui/package-lock.json ui/index.js
	rm -rf www/assets/scripts/index.js www/assets/wasm/pkg

format:
	prettier .