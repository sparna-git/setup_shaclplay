import * as core from "@actions/core"

export const GITHUB_TOKEN = core.getInput("github-token");

export const SHACL_PLAY_VERSION = core.getInput("version");

console.log('Version using core.getInput', SHACL_PLAY_VERSION)
console.log('Version using tag', SHACL_PLAY_VERSION)