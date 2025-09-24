import core from '@actions/core';
import github from '@actions/github';

async function run(): Promise<boolean> { 
    try {
        // Fetch the value of the input 'who-to-greet' specified in action.yml
        let gradle_command = core.getInput("gradle_command");
        let base_branch = core.getInput("base_branch");
        let target_branch = core.getInput("target_branch");
        let post_as_pr_comment = core.getInput("post_as_pr_comment");
        let exclude_dependencies = core.getInput("exclude_dependencies");
        

    } catch (error: any) {
        // Handle errors and indicate failure
        core.setFailed(error.message);
    }



    return true;
}

run();