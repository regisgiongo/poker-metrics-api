import Github from 'github';
const env = process.env;

let api = new Github({
  version: '3.0.0',
  debug: true,
  protocol: 'https'
});

api.authenticate({
  type: 'oauth',
  token: env.GITHUB_TOKEN || null
});

export default api;
