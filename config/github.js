import Github from 'github';
import settings from 'config';
import env from 'env';

const api = new Github({
  version: '3.0.0',
  debug: true,
  protocol: 'https'
});

api.authenticate({
  type: 'oauth',
  token: env.GITHUB_TOKEN || null
});

export default api;
