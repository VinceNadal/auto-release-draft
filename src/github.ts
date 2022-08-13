import { context, getOctokit} from '@actions/github'
import {info} from '@actions/core'
import {removePrefix, isPreRelease} from './version'
import {toUnorderedList} from './markdown'

export async function createReleaseDraft(
  versionTag: string,
  repoToken: string,
  changelog: string
): Promise<string> {
  const octokit = getOctokit(repoToken)

  const response = await octokit.request(
    `POST /repos/${context.repo.owner}/${context.repo.repo}/releases`,
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
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

  info(`Created release draft ${response.data.name}`)

  return response.data.html_url
}
