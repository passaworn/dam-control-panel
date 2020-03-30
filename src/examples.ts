// import { RenderMode } from './types';

export const examples = [
  {
    // The first example should set all possible fields!
    name: 'Simple',
    text: 'loads static content from github',
    config: {
      request: 'http',
      method: 'GET',
      damUrl: 'http://dam-server',
      control: 'relay',
      _mode: 'toggle',
      switchMode: 'trigger',
      trigMessage: '',
      template: '',
      url: 'https://raw.githubusercontent.com/ryantxu/ajax-panel/master/static/example.txt',
      header_js: '{}',
      responseType: 'relay',
      withCredentials: false,
      skipSameURL: true,
      showErrors: true,

      showTime: false,
      showTimePrefix: null,
      showTimeFormat: 'LTS',
      showTimeValue: 'request',

      templateResponse: true,
    },
  }
];
