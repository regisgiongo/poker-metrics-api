import Github from 'github';

let api = new Github({
  version: '3.0.0',
  debug: true,
  protocol: 'https'
});

api.authenticate({
  type: 'oauth',
  token: '943f1a03fec32a75162c2a3747a8998a124c872f'
});

export default api;
