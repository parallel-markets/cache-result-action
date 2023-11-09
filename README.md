# Cache Result Github Action

Store a result for a given commit SHA in a repo.

## Inputs

| name          | description                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `result`      | The string result to be stored in the cache. If unspecified, the action will run in "restore only" mode. |
| `cache-group` | A string that will be added to the cache key. Defaults to the name of the current workflow.              |

## Outputs

| name     | description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| `result` | The string result of the action, either `'unknown'` or the given `result` value. |

## Examples

Here's a simple example where a test step will run once for a given version of the codebase. Re-running the action for the same commit will skip `make test` if the last run was successful.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - id: last-run
        uses: parallel-markets/cache-result-action@v1.0.0

      - run: make test
        if: steps.last-run.outputs.result != 'success'

      - uses: parallel-markets/cache-result-action@v1.0.0
        with:
          result: success
```

In this example, the entire `test` job will be skipped if it already succeeded for this commit.

```yaml
jobs:
  fetch-prev-result:
    runs-on: ubuntu-latest
    outputs:
      prev-result: ${{ steps.last-run.outputs.result }}
    steps:
      - id: last-run
        uses: parallel-markets/cache-result-action@v1.0.0

  test:
    runs-on: ubuntu-latest
    needs: fetch-prev-result
    if: needs.fetch-prev-result.outputs.prev_result != 'success'
    steps:
      - run: make test
      - uses: parallel-markets/cache-result-action@v1.0.0
        with:
          result: success
```
