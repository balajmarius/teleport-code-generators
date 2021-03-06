import { ServiceAuth } from '@teleporthq/teleport-types'

import GithubInstance from './github-instance'
import { createEmptyFolder, fetchFilesContent } from './utils'

import {
  GithubGatewayFactory,
  RepositoryIdentity,
  GithubFile,
  NewRepository,
  GithubCommitMeta,
} from './types'

export const createGithubGateway: GithubGatewayFactory = (auth: ServiceAuth = {}) => {
  const githubInstance = new GithubInstance(auth)

  const getRepository = async (repoIdentity: RepositoryIdentity, authData?: ServiceAuth) => {
    authorizeGithubInstance(authData)

    const { data } = await githubInstance.getRepoContent(repoIdentity)

    const { repo } = repoIdentity
    const emptyFolder = createEmptyFolder(repo)

    const filesFetcherMeta = { githubInstance, userRepositoryIdentity: repoIdentity }
    return fetchFilesContent(data as GithubFile[], emptyFolder, filesFetcherMeta)
  }

  const getUserRepositories = async (username: string, authData?: ServiceAuth) => {
    authorizeGithubInstance(authData)
    return githubInstance.getUserRepositories(username)
  }

  const createRepository = async (repository: NewRepository, authData?: ServiceAuth) => {
    authorizeGithubInstance(authData)
    return githubInstance.createRepository(repository)
  }

  const commitFilesToRepo = async (commitMeta: GithubCommitMeta, authData: ServiceAuth) => {
    authorizeGithubInstance(authData)
    return githubInstance.commitFilesToRepo(commitMeta)
  }

  const authorizeGithubInstance = (authData?: ServiceAuth): void => {
    if (!authData) {
      return
    }
    githubInstance.authorize(authData)
  }

  return {
    getRepository,
    getUserRepositories,
    createRepository,
    commitFilesToRepo,
  }
}

export { GithubFile, RepositoryIdentity, GithubCommitMeta }
