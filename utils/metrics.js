import github from '../config/github';
import async from 'async';

const USER = 'ContaAzul';
const REPO = 'alcatraz';

export function pointsPerSprint(callback) {

  github.issues.getAllMilestones({
    user: USER,
    repo: REPO,
    state: 'closed',
    per_page: 100
  }, function(err, res) {
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
        points[milestone.title] = issues.reduce( (pointsAccumulated, issue) => {
          return pointsAccumulated + getPoints(issue);
        }, 0);
        next();
      });
    }, () => {
      callback(points);
    });
  });

  function getPoints(issue) {
    let point = issue.title.match(/{(\d+)}/) ? issue.title.match(/{(\d+)}/)[1] : 0;
    return parseInt(point);
  }

  function onlySprintMilestones(milestones) {
    return milestones.filter( (item) => {
      return item.title.indexOf('Sprint') > -1;
    });
  }

}
