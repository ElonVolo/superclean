/* eslint-disable @typescript-eslint/ban-ts-comment */
import createExtension from './clean-extension'
import { TestingToolbox } from '../utilities/testing-toolbox'

describe.skip('clean extension', () => {
  describe('when initializing', () => {
    test('has the proper interface', () => {
      const testToolbox = new TestingToolbox()

      createExtension(testToolbox)

      // @ts-ignore
      let theClean = testToolbox.cleaning.clean('test')
    })
  })
})
