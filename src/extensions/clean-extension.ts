import * as path from 'path'
import { GluegunToolbox } from 'gluegun'
import { DefinitionsBuilder } from '../lib/definition-builder'
import { DefinitionStep } from '../lib/definition-step'
import { CleanOptions } from '../lib/clean-options'

export default function attach(toolbox: GluegunToolbox) {
  const { filesystem, print, strings, system, } = toolbox

  const runCommand = async (step: DefinitionStep) => {
    // build command ('command_name ' + arg1 + ' ' + arg2 + ' ' arg3, etc
    let commandString
    if (step?.command?.args) {
      commandString = [step.command.name].concat(step.command.args).join(' ')
    } else {
      commandString = step.command.name
    }

    // execute the command
    const exec = await system.spawn(commandString, { shell: true })
    // const { stdout = '' } = exec

    // Some commands won't output anything
    // if (stdout) {
    //   const output = strings.trimEnd(stdout.toString())
    //   print.info(output)
    // }
  }

  const clean = (topStackLevelKey: string, cleanOptions?:CleanOptions) => {
    let hostPlatform = cleanOptions?.platform ?? process.platform

    let builder = new DefinitionsBuilder(toolbox)
    let defs = builder.getDefinitions(topStackLevelKey)

    for (const definition of defs) {
      for (const step of definition.steps) {
        // Check to see whether this particular step is platform specific
        // and whether it applies to the platform we are currently looking at.

        // If it is platform specific, and it's not relevant to the current host platform, then
        // skip
        if (step.platforms) {
          if (!step.platforms.includes(hostPlatform)) {
            continue
          }
        }

        if (step.type === 'delete') {
          print.info("* "+ step.message)
          let deletePath = path.join(process.cwd(), step.path)
          filesystem.remove(step.path)
        } else {
          if (step.type === 'shell') {
            print.info("* " + step.message)
            runCommand(step)
          }
        }
      }
    }

    print.info('Successfully cleaned')
  }

  toolbox.cleaning = {}
  toolbox.cleaning.clean = clean
}
