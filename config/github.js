import Github from 'github';

let api = new Github({
  version: '3.0.0',
  debug: true,
  protocol: 'https'
});

api.authenticate({
  type: 'oauth',
  token: ''
});

export default api;
