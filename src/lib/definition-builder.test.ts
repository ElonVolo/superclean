import { DefinitionsBuilder } from './definition-builder'
import { TestingToolbox } from '../utilities/testing-toolbox'
import exp = require('constants')

describe('Definitions builder', () => {
  test('should be able to obtain a lookup table mapping name-key of definition to file path', () => {
    const toolbox = new TestingToolbox()
    const builder = new DefinitionsBuilder(toolbox)
    let lut = builder.getDefinitionsLookupTable()
    expect(lut['test']).toEqual('clean-defs/test/definition.json')
  })

  describe('when building a definition', () => {
    const toolbox = new TestingToolbox()
    const builder = new DefinitionsBuilder(toolbox)
    const definitions = builder.getDefinitions('test')

    test('can parse the definition name', () => {
      expect(definitions[0].name).toBe('test')
    })

    describe('can parse definition steps', () => {
      test('getting all of the steps', () => {
        expect(definitions[0].steps.length).toBe(9)
      })

      test('correctly parsing the command', () => {
        expect(definitions[0].steps[4].stepID).toEqual('run-simple-command')
        expect(definitions[0].steps[4].message).toBe('Testing running a command with multiple arguments')
        expect(definitions[0].steps[4].type).toBe('shell')
        expect(definitions[0].steps[4].status).toBe('enabled')
        expect(definitions[0].steps[4].command.name).toBe('ls')
        expect(definitions[0].steps[4].command.args).toEqual(['-l', '-t'])
      })
    })
  })

  describe('dependencies handling', () => {
    const toolbox = new TestingToolbox()
    const builder = new DefinitionsBuilder(toolbox)
    const definitions = builder.getDefinitions('react-native')

    test('adds the definitions called out in the dependency', () => {
      expect(definitions[2].name).toBe('xcode')
    })
  })

})
