import * as core from '@actions/core'
import * as event from './event'
import * as version from './version'
import * as git from './git'
import {createReleaseDraft} from './github'

export async function run(): Promise<void> {
  try {
    const token = core.getInput('repo-token')
    const tag = event.getCreatedTag()
    let releaseUrl = ''

    if (tag && version.isSemVer(tag)) {
      const changelog = await git.getChangesIntroducedByTag(tag)

      releaseUrl = await createReleaseDraft(tag, token, changelog)
    }

    core.setOutput('release-url', releaseUrl)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
