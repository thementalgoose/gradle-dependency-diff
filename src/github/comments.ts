import { GitHub } from "@actions/github/lib/utils";
import * as github from "@actions/github";

export async function postComment(
    githubToken: string,
    messageId: string,
    message: string
): Promise<boolean> { 
    if (github.context.payload.pull_request == null) { 
        return false;
    }

    let pullRequestNumber = github.context.payload.pull_request.number;
    const octokit = github.getOctokit(githubToken);

    let formattedMsgId: string = `<!--${messageId}-->`;

    let existingCommentId = await findCommentById(
        pullRequestNumber,
        formattedMsgId,
        githubToken
    );

    if (existingCommentId == null) { 
        let newCommentResult = await octokit.rest.issues.createComment({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            issue_number: pullRequestNumber,
            body: `${formattedMsgId}\n\n${message}`
        });
        return newCommentResult.status == 201;
    } else { 
        let updateCommentResult = await octokit.rest.issues.updateComment({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            comment_id: existingCommentId,
            body: `${formattedMsgId}\n\n${message}`
        })
        return updateCommentResult.status == 200;
    }
}

async function findCommentById(
    pullRequestNumber: number, 
    messageId: string,
    githubToken: string
): Promise<number | null> { 

    const octokit = github.getOctokit(githubToken);

    // Find existing comment based on an ID
    const parameters = {
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: pullRequestNumber,
        per_page: 100,
    }

    for await (const comments of octokit.paginate.iterator(
        octokit.rest.issues.listComments,
        parameters,
    )) { 
        let result = (comments.data.find(({body}) => { 
            return (body?.search(messageId) ?? -1) > -1;
        }));
        if (result) { 
            return result.id;
        }
    }
    return null;
}