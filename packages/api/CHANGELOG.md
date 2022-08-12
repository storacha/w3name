# Changelog

## [1.1.1](https://github.com/web3-storage/w3name/compare/api-v1.1.0...api-v1.1.1) (2022-08-12)


### Bug Fixes

* add cors headers for shema responses. ([#59](https://github.com/web3-storage/w3name/issues/59)) ([07b97ff](https://github.com/web3-storage/w3name/commit/07b97ff1f10db8eb83b2076eb4319f1c48b97715))

## [1.1.0](https://github.com/web3-storage/w3name/compare/api-v1.0.0...api-v1.1.0) (2022-08-10)


### Features

* avoid trying to republish expired records ([#52](https://github.com/web3-storage/w3name/issues/52)) ([b04338a](https://github.com/web3-storage/w3name/commit/b04338a8b7a35ba6c6488a6d7ef632855cba32b4))
* open api spec ([#54](https://github.com/web3-storage/w3name/issues/54)) ([cd1d59d](https://github.com/web3-storage/w3name/commit/cd1d59d7352634632623f2692a05a2b7c0e7599a))


### Other Changes

* appease linter ([2d85373](https://github.com/web3-storage/w3name/commit/2d853731f5d634d2c4a7ce9089fd2632b8b6f7b3))
* fix spelling mistakes in openAPI schema. ([3df3648](https://github.com/web3-storage/w3name/commit/3df36480fbb7a8fb94410dee87ecdcdb0ad35b94))
* no error swallowing ([#45](https://github.com/web3-storage/w3name/issues/45)) ([d74d9f9](https://github.com/web3-storage/w3name/commit/d74d9f9566d2641421db1095fbb969929d14f4ff))
* remove commented out code ([ee32f75](https://github.com/web3-storage/w3name/commit/ee32f75730000e911d5f122223b3770da7810325))
* remove unnecessary CORS headers ([5a72858](https://github.com/web3-storage/w3name/commit/5a728582161d6204ad9b81e0d1d09a33c4f8f1dc))

## 1.0.0 (2022-08-05)


### Features

* add auth token ([34686df](https://github.com/web3-storage/w3name/commit/34686df169a9ca127c664652eee7e985dd39516e))
* add release please setup ([#23](https://github.com/web3-storage/w3name/issues/23)) ([e5c62a9](https://github.com/web3-storage/w3name/commit/e5c62a9732f070aea040a90986b056abd96691ca))
* implement persistence with Durable Objects ([b397104](https://github.com/web3-storage/w3name/commit/b39710408dffd45214cbd4b2b7afb524e8264b67))
* rebroadcast using alarms ([3398c5f](https://github.com/web3-storage/w3name/commit/3398c5ff95bd4748a0ab9fce5c65613a7ab9097c))


### Bug Fixes

* add e2e test and refactor ([c64140b](https://github.com/web3-storage/w3name/commit/c64140b0460fb11ebb49af1353d1ed4fff63f5d3))
* catch case where a record update has higher seq. no but an older signature version ([bf57252](https://github.com/web3-storage/w3name/commit/bf572525985fff1835c8f94c3bd55211bedbdece))
* Implement initial record validity checks. ([cad26f0](https://github.com/web3-storage/w3name/commit/cad26f036a972067837be4d5b2625a3434f27b32))
* remove noCache ([b535351](https://github.com/web3-storage/w3name/commit/b5353514aaf561e7b1d2e0d8ef51f0f29f1664c8))
* use noCache ([6620170](https://github.com/web3-storage/w3name/commit/662017075339794ad9502aa756aae71c827d4655))


### Other Changes

* add tests and refactor ([ef779f6](https://github.com/web3-storage/w3name/commit/ef779f6639e96797fc941f62691af9f88fe082b9))
* avoid calling ipns.unmarshal on the same record twice in the same function ([53b7344](https://github.com/web3-storage/w3name/commit/53b7344082c408297834c3c318f9a381a778ea8f))
* even more linting fixes for spec ([940f2bd](https://github.com/web3-storage/w3name/commit/940f2bd4016a4e0964dd35c891663b958607811f))
* fix api linting. ([42d153e](https://github.com/web3-storage/w3name/commit/42d153ec403a58c8f6cde753b049161aced12c3c))
* fix linting ([20ead21](https://github.com/web3-storage/w3name/commit/20ead217f1815a5e2bb69dcf801d486277337b15))
* lint ([b1766c7](https://github.com/web3-storage/w3name/commit/b1766c77dcdde69909998adcb2cbb78aa2093d46))
* More lifting fixes for api view ([d247d09](https://github.com/web3-storage/w3name/commit/d247d0999ab0656113357a530b6585aaf6756b03))
* more linting fixes ([c1a164a](https://github.com/web3-storage/w3name/commit/c1a164a1b07f0a6dcabd8dc6c026f1147626c856))
* remove package-lock.json files from sub-folders. ([39e8369](https://github.com/web3-storage/w3name/commit/39e83692cf44a0ebcab2626868da3e46b9ceb09a))
* update README ([f832854](https://github.com/web3-storage/w3name/commit/f832854119db694a2dc9ad727180e1f760a2da00))
