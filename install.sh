#!/usr/bin/env bash

git submodule update --init --recursive 

yarn install --frozen-lockfile

pushd ./roam-research-private-api

npm i

# will also download chromium lmao, we really gotta get that edn format going from json...

popd