/* eslint-disable @typescript-eslint/ban-ts-comment */
import createExtension from './clean-extension'
import { TestingToolbox } from '../utilities/testing-toolbox'

describe('clean extension', () => {
  let testToolbox = null
  let removeSpy = null
  let commandSpy = null

  beforeEach(() => {
    testToolbox = new TestingToolbox()
    createExtension(testToolbox)
    removeSpy = jest.spyOn(testToolbox.filesystem, 'remove').mockImplementation(() => {})
    commandSpy = jest.spyOn(testToolbox.system, 'spawn').mockImplementation(() => {})
  })

  describe('performs action', () => {
    describe('delete', () => {
      test('file specified in a delete step', () => {
        jest.spyOn(testToolbox.filesystem, 'list').mockImplementation(() => {
          return [
            'node_modules',
            'file_to_keep.ts'
          ]
        })

        // @ts-ignore
        let theClean = testToolbox.cleaning.clean('test')
        expect(removeSpy).toHaveBeenCalledWith('node_modules')
      })

      describe('platform-specific', () => {
        test('file specified in a platform-specific step that matches process\' or CleanOptions\' platform', () => {
          jest.spyOn(testToolbox.filesystem, 'list').mockImplementation(() => {
            return [
              'node_modules',
              'darwin-specific-file.ts',
            ]
          })

          let theClean = testToolbox.cleaning.clean('test', { platform: 'darwin'})
          expect(removeSpy).toHaveBeenCalledWith('darwin-specific-file.ts')
        })

        test('does not delete file if process\' or CleanOptions\' platform does not match', () => {
          jest.spyOn(testToolbox.filesystem, 'list').mockImplementation(() => {
            return [
              'node_modules',
              'darwin-specific-file.ts',
            ]
          })

          let theClean = testToolbox.cleaning.clean('test', { platform: 'linux'})
          expect(removeSpy).not.toHaveBeenCalledWith('darwin-specific-file.ts')
        })
      })
    })

    describe('run command', () => {
      test('can run a simple command', () => {
        let theClean = testToolbox.cleaning.clean('test')
        expect(commandSpy).toHaveBeenCalledWith("ls -lt", {"shell": true})
      })

      test('can run a command with arguments', () => {
        let theClean = testToolbox.cleaning.clean('test')
        expect(commandSpy).toHaveBeenCalledWith("ls -l -t", {"shell": true})
      })
    })

    afterEach(() => {
      jest.clearAllMocks();
    })
  })
})
