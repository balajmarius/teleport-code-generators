import projectPacker from '@teleporthq/teleport-project-packer'

import reactGenerator from '@teleporthq/teleport-project-generator-react'
import nextGenerator from '@teleporthq/teleport-project-generator-next'
import vueGenerator from '@teleporthq/teleport-project-generator-vue'
import nuxtGenerator from '@teleporthq/teleport-project-generator-nuxt'
import preactGenerator from '@teleporthq/teleport-project-generator-preact'
import stencilGenerator from '@teleporthq/teleport-project-generator-stencil'
import angularGenerator from '@teleporthq/teleport-project-generator-angular'

import { createDiskPublisher } from '@teleporthq/teleport-publisher-disk'
import { RemoteTemplateDefinition, ProjectUIDL, ProjectGenerator } from '@teleporthq/teleport-types'

import config from '../config.json'

import {
  GITHUB_TEMPLATE_OWNER,
  REACT_GITHUB_PROJECT,
  NEXT_GITHUB_PROJECT,
  VUE_GITHUB_PROJECT,
  NUXT_GITHUB_PROJECT,
  PREACT_GITHUB_PROJECT,
  STENCIL_GITHUB_PROJECT,
  ANGULAR_GITHUB_PROJECT,
} from './constants'

import projectUIDL from '../../../examples/uidl-samples/project.json'

const generators: Record<string, ProjectGenerator> = {
  react: reactGenerator,
  next: nextGenerator,
  vue: vueGenerator,
  nuxt: nuxtGenerator,
  preact: preactGenerator,
  stencil: stencilGenerator,
  angular: angularGenerator,
}

const getGithubRemoteDefinition = (username: string, repo: string): RemoteTemplateDefinition => {
  return { username, repo, provider: 'github' }
}

const templates: Record<string, RemoteTemplateDefinition> = {
  react: getGithubRemoteDefinition(GITHUB_TEMPLATE_OWNER, REACT_GITHUB_PROJECT),
  next: getGithubRemoteDefinition(GITHUB_TEMPLATE_OWNER, NEXT_GITHUB_PROJECT),
  vue: getGithubRemoteDefinition(GITHUB_TEMPLATE_OWNER, VUE_GITHUB_PROJECT),
  nuxt: getGithubRemoteDefinition(GITHUB_TEMPLATE_OWNER, NUXT_GITHUB_PROJECT),
  preact: getGithubRemoteDefinition(GITHUB_TEMPLATE_OWNER, PREACT_GITHUB_PROJECT),
  stencil: getGithubRemoteDefinition(GITHUB_TEMPLATE_OWNER, STENCIL_GITHUB_PROJECT),
  angular: getGithubRemoteDefinition(GITHUB_TEMPLATE_OWNER, ANGULAR_GITHUB_PROJECT),
}

const publisher = createDiskPublisher({
  outputPath: 'dist',
})

const packProject = async (projectType: string) => {
  const remoteTemplate = templates[projectType] as RemoteTemplateDefinition

  remoteTemplate.auth = {
    token: config.token,
  }

  projectPacker.setPublisher(publisher)
  projectPacker.setGenerator(generators[projectType])
  await projectPacker.loadTemplate(remoteTemplate)

  const result = await projectPacker.pack((projectUIDL as unknown) as ProjectUIDL)

  console.info(projectType, ' - ', result)
}

const run = async () => {
  try {
    await packProject('react')
    await packProject('next')
    await packProject('vue')
    await packProject('nuxt')
    await packProject('preact')
    await packProject('stencil')
    await packProject('angular')
  } catch (e) {
    console.info(e)
  }
}

run()
