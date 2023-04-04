import * as core from "@actions/core"
import { adquiriSHACL_Play } from "./installer"

async function run() {

    try {
        await adquiriSHACL_Play()
    } catch (error) {
        if (error instanceof Error ){
            core.setFailed(error.message);
        }        
    }
    
}

run();