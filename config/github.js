import Github from 'github';
import settings from 'config';

const api = new Github({
  version: '3.0.0',
  debug: true,
  protocol: 'https'
});

api.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN || null
});

export default api;
