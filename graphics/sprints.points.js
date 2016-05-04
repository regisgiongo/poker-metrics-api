import github from '../config/github';
import async from 'async';
import {onlySprintMilestones, sumIssuesPoints} from '../utils/utils';

const USER = 'ContaAzul';
const REPO = 'alcatraz';

export function pointsPerSprint(callback) {
  github.issues.getAllMilestones({
    user: USER,
    repo: REPO,
    state: 'closed',
    per_page: 100
  }, (err, res) => {
    let milestones = onlySprintMilestones(res);
    let points = {};

    async.each(milestones, (milestone, next) => {
      points[milestone.title] = 0;
      github.issues.repoIssues({
        user: USER,
        repo: REPO,
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
