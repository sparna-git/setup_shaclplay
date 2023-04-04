import * as core from "@actions/core";
import { exec } from "@actions/exec";
import * as github from "@actions/github";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as path from "path";


// Recuperer les parametres d'entrée
import { GITHUB_TOKEN, SHACL_PLAY_VERSION } from "./constants";

// Recuperer la version de SHACL-Play
async function getLatestVersion() {
    const octokit = github.getOctokit(GITHUB_TOKEN);
    const {
      data: { tag_name: version },
    } = await octokit.rest.repos.getLatestRelease({
      owner: "sparna-git",   
      repo: "shacl-play",
    });
    
    core.debug('Get last version: '+version)

    return version;
 }
  
async function getVersion(version: string) {
    if (version === "latest") {
      const latestVersion = await getLatestVersion();
      return latestVersion;
    } else {
      return version;
    }
 }

// download        
function composeDownloadUrl(version: string) {
  const url = `https://github.com/sparna-git/setup_shacl-play/releases/download/${version}/shacl-play-app-${version}-onejar.jar`;
  
  return url;
}


function addPath(baseDir: string) {
    core.addPath(path.join(baseDir,'shacl-play','releases'));
}

export async function adquiriSHACL_Play() : Promise<void> {
    const version = await getVersion(SHACL_PLAY_VERSION);
    const downloadUrl = composeDownloadUrl(version);
    const cachedPath = tc.find("shacl-play",version);

    core.debug('Actions function ini .......');
    core.debug('Version SHACL-PLAY:'+version);
    core.debug('URL SHACL-PLAY:'+downloadUrl);

    if (cachedPath === ""){
        core.debug('Condition pour trouver la rute du fichier jar..........');
        const downloadedPath = await tc.downloadTool(downloadUrl);
        core.debug('Dir downloaded Path '+downloadedPath);
        const cachedPath = await tc.cacheDir(downloadedPath,"shacl-play",version);
        core.debug('Cached Path'+cachedPath);
        addPath(cachedPath);
    }
           
    const shaclPlayPath = await io.which("shacl-play",true);
    
    core.debug('SHACL-Play Path '+shaclPlayPath);
    
    await exec(`java -jar ${shaclPlayPath} ${version} --help`);
}