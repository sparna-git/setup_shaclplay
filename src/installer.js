"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adquiriSHACL_Play = void 0;
const core = __importStar(require("@actions/core"));
const exec_1 = require("@actions/exec");
const github = __importStar(require("@actions/github"));
const io = __importStar(require("@actions/io"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
// Recuperer les parametres d'entrée
const constants_1 = require("./constants");
// Recuperer la version de SHACL-Play
function getLatestVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = github.getOctokit(constants_1.GITHUB_TOKEN);
        const { data: { tag_name: version }, } = yield octokit.rest.repos.getLatestRelease({
            owner: "sparna-git",
            repo: "shacl-play",
        });
        core.debug('Get last version: ' + version);
        return version;
    });
}
function getVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        if (version === "latest") {
            const latestVersion = yield getLatestVersion();
            return latestVersion;
        }
        else {
            return version;
        }
    });
}
// download        
function composeDownloadUrl(version) {
    const url = `https://github.com/sparna-git/setup_shacl-play/releases/download/${version}/shacl-play-app-${version}-onejar.jar`;
    return url;
}
function addPath(baseDir) {
    core.addPath(path.join(baseDir, 'shacl-play', 'releases'));
}
function adquiriSHACL_Play() {
    return __awaiter(this, void 0, void 0, function* () {
        const version = yield getVersion(constants_1.SHACL_PLAY_VERSION);
        const downloadUrl = composeDownloadUrl(version);
        const cachedPath = tc.find("shacl-play", version);
        core.debug('Actions function ini .......');
        core.debug('Version SHACL-PLAY:' + version);
        core.debug('URL SHACL-PLAY:' + downloadUrl);
        if (cachedPath === "") {
            core.debug('Condition pour trouver la rute du fichier jar..........');
            const downloadedPath = yield tc.downloadTool(downloadUrl);
            core.debug('Dir downloaded Path ' + downloadedPath);
            const cachedPath = yield tc.cacheDir(downloadedPath, "shacl-play", version);
            core.debug('Cached Path' + cachedPath);
            addPath(cachedPath);
        }
        const shaclPlayPath = yield io.which("shacl-play", true);
        core.debug('SHACL-Play Path ' + shaclPlayPath);
        yield (0, exec_1.exec)(`java -jar ${shaclPlayPath} ${version} --help`);
    });
}
exports.adquiriSHACL_Play = adquiriSHACL_Play;
