#!/bin/bash

set -eo pipefail

for regexp in $(yq ".creation_rules.[].path_regex" .sops.yaml); do
    find . -regex "./$regexp" -exec sops updatekeys --yes {} \;
done
