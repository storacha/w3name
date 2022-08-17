# Why this script exists
# ======================
#
# We have Husky to run a pre-commit hook for us. But if we use it to just run:
# `npm run lint -w packages/api &&  npm run lint packages/client`
# then it will be:
# 1. Inefficient because it will often be running linting for files (or a whole package) which hasn't changed; and
# 2. Possibly annoying if it’s linting things which you deliberately haven’t staged.
# 3. Definitely annoying because it will print the (noisy) linter output into the console, even when it succeeds.
# So we have [lint-staged](https://www.npmjs.com/package/lint-staged) which cleverly:
# * Stashes your unstaged changes,
# * _then_ runs the linter,
# * unstashes your other changes afterwards,
# * only prints the linter output when it fails,
# * can run a different linting command for different files
# * passes the paths of the modified files being committed to the linter so that it’s even more efficient by only linting the files that have changed.
# BUT...
# Our linter is `aegir-lint`, which just lints all the files, you can’t pass it file paths, and if you do then it errors.
# And `lint-staged` can’t be configured to not pass the file paths.
# And hence we have this shell script, which will happily accept the passed file paths and ignore them
# and then run out linter for the appropriate folder.
# This allows us to get most of the benefits of lint-staged, but without causing our linter to fail.

npm run lint -w packages/api
