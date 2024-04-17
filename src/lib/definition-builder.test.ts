import { DefinitionsBuilder } from './definition-builder'
import { TestingToolbox } from '../utilities/testing-toolbox'
import exp = require('constants')

describe('Definitions builder', () => {

  test('should be able to obtain a lookup table mapping name-key of definition to file path', () => {
    const toolbox = new TestingToolbox()
    const builder = new DefinitionsBuilder(toolbox)
    let lut = builder.getDefinitionsLookupTable()
    expect(lut['node']).toEqual('clean-defs/node/definition.json')
  })

  describe('when building a definition', () => {
    const toolbox = new TestingToolbox()
    const builder = new DefinitionsBuilder(toolbox)
    const definitions = builder.getDefinitions('react-native')

    test('can parse the definition', () => {
      expect(definitions.length).toBe(3)
    })

    test('can parse the definition name', () => {
      expect(definitions[2].name).toBe('xcode')
    })

    describe('can parse definition steps', () => {
      test('getting all of the steps', () => {
        expect(definitions[0].steps.length).toBe(5)
      })

      test('correctly parsing the command', () => {
        expect(definitions[1].steps[0].command.name).toBe('watchman')
      })
    })
  })
})
