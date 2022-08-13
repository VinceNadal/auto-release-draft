import * as core from '@actions/core'
import * as event from './event'
import * as version from './version'

export async function run(): Promise<void> {
  try {
    const tag = event.getCreatedTag()

    if (tag && version.isSemVer(tag)) {
      // todo
    }

    core.setOutput('release-url', 'https://example.com')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
