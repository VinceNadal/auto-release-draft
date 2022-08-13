import * as github from '@actions/github'
import * as core from '@actions/core'
import {removePrefix, isPreRelease} from './version'
import {toUnorderedList} from './markdown'

export async function createReleaseDraft(
  versionTag: string,
  repoToken: string,
  changelog: string
): Promise<string> {
  const octokit = github.getOctokit(repoToken)

  const response = await octokit.request(
    `POST /repos/${github.context.repo.owner}/${github.context.repo.repo}/releases`,
    {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      tag_name: versionTag,
      name: removePrefix(versionTag),
      body: toUnorderedList(changelog),
      prerelease: isPreRelease(versionTag),
      draft: true
    }
  )

  if (response.status != 201) {
    throw new Error(`Failed to create the release: ${response.status}`)
  }

  core.info(`Created release draft ${response.data.name}`)

  return response.data.html_url
}
