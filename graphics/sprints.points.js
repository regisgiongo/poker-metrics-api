import github from '../config/github';
import async from 'async';
import settings from 'config';
import {onlySprintMilestones, sumIssuesPoints} from '../utils/utils';

export function pointsPerSprint(team, callback) {
  let githubApi = github(team);
  let access = settings.github[team];

  githubApi.issues.getAllMilestones({
    user: access.user,
    repo: access.repo,
    state: 'closed',
    per_page: 100
  }, (err, res) => {
    let milestones = onlySprintMilestones(res);
    let points = {};

    async.each(milestones, (milestone, next) => {
      points[milestone.title] = 0;
      githubApi.issues.repoIssues({
        user: access.user,
        repo: access.repo,
        filter: 'all',
        state: 'all',
        milestone: milestone.number,
        per_page: 100
      }, (err, issues) => {
        points[milestone.title] = sumIssuesPoints(issues);
        next();
      });
    }, () => {
      callback(points);
    });
  });
}
