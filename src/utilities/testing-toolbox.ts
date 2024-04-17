import { GluegunToolbox } from 'gluegun'
import {
  GluegunFilesystem,
  GluegunStrings,
  GluegunPrint,
  GluegunSystem,
  GluegunSemver,
  GluegunHttp,
  GluegunPatching,
  GluegunPrompt,
  GluegunTemplate,
  GluegunMeta,
  GluegunPackageManager,
} from 'gluegun'

import { filesystem } from 'gluegun'
import { print } from 'gluegun'
import { strings } from 'gluegun'
import { system } from 'gluegun'
import { semver } from 'gluegun'
import { http } from 'gluegun'
import { patching } from 'gluegun'
import { prompt } from 'gluegun'
import { packageManager } from 'gluegun'

export interface Options {
  [key: string]: any
}

export interface GluegunParameters {
  /* The command arguments as an array. */
  array?: string[]
  /**
   * Any optional parameters. Typically coming from command-line
   * arguments like this: `--force -p tsconfig.json`.
   */
  options: Options
  /* Just the first argument. */
  first?: string
  /* Just the 2nd argument. */
  second?: string
  /* Just the 3rd argument. */
  third?: string
  /* Everything else after the command as a string. */
  string?: string
  /* The raw command with any named parameters. */
  raw?: any
  /* The original argv value. */
  argv?: any
  /* The currently running plugin name. */
  plugin?: string
  /* The currently running command name. */
  command?: string
}

export class TestingToolbox implements GluegunToolbox {
  public config: Options = {}
  public parameters: GluegunParameters = { options: {} }
  // known extensions
  filesystem: GluegunFilesystem
  http: GluegunHttp
  meta: GluegunMeta
  patching: GluegunPatching
  print: GluegunPrint
  prompt: GluegunPrompt
  semver: GluegunSemver
  strings: GluegunStrings
  system: GluegunSystem
  template: GluegunTemplate
  generate: any
  packageManager: GluegunPackageManager

  constructor() {
    this.filesystem = filesystem
    this.http = http
    this.print = print
    this.semver = semver
    this.strings = strings
    this.system = system
    this.packageManager = packageManager
  }
}
