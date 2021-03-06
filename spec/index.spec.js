'use strict';

let github = require('@actions/github');
let core = require('@actions/core');

const notifier = require('../lib/index');
const blockBuilder = require('../lib/block-builder');
const postMessage = require('../lib/post-message');

describe('Notifier', () => {
  describe('run', () => {
    it('should fail without a proper context', () => {
      const oldContext = github.context.payload;
      github.context.payload = {};

      spyOn(core, 'getInput');
      spyOn(core, 'setFailed');
      spyOn(core, 'setOutput');

      notifier.run();

      expect(core.getInput).toHaveBeenCalled();
      expect(core.setFailed).toHaveBeenCalled();
      expect(core.setOutput).not.toHaveBeenCalled();

      github.context.payload = oldContext;
    });

    it('should call the appropriate methods in order to create a message', async () => {
      spyOn(core, 'getInput').and.returnValues('Success', '123');
      spyOn(blockBuilder, 'buildBlocksFor').and.callThrough();
      spyOn(blockBuilder, 'getFallbackBlocks');
      spyOn(core, 'info');
      spyOn(core, 'setFailed');
      spyOn(postMessage, 'postMessage').and.returnValue(true);

      await notifier.run();

      expect(core.getInput).toHaveBeenCalled();
      expect(blockBuilder.buildBlocksFor).toHaveBeenCalled();
      expect(postMessage.postMessage).toHaveBeenCalled();
      expect(core.info).toHaveBeenCalledTimes(2);
      expect(core.setFailed).not.toHaveBeenCalled();
    });
  });
});
