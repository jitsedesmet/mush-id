# Mush-ID

We are using [version 14.9 - 3.6draft1](https://tree.opentreeoflife.org/about/synthesis-release/v14.9) of the OToL IDs.



## Git hooks

A pre-commit hook in `.githooks/` runs `npm run build` and aborts the commit if it fails. Enable it once per clone:

```sh
git config core.hooksPath .githooks
```
