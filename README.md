steps:
  - uses: parallel-markets/sha-storage-action

later
  - uses: parallel-markets/sha-storage-action
    if: tests pass
    with:
      result: success
