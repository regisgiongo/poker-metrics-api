import Github from 'github';
import settings from 'config';

const api = new Github({
  version: '3.0.0',
  debug: true,
  protocol: 'https'
});

export default function(team) {
  api.authenticate({
    type: 'oauth',
    token: settings.github[team].token
  });

  return api;
};
