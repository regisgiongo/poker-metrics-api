export function onlySprintMilestones(milestones) {
  return milestones.filter( (item) => {
    return isAlcatrazSprint(item) || is404Sprint(item);
  });
}

function isAlcatrazSprint(item){
  return item.title.indexOf('Sprint') > -1;
}

function is404Sprint(item){
  var pattern = /(#[0-9])\w+/;
  return item.title.match(pattern);
}

export function sumIssuesPoints(issues) {
  return issues.reduce( (pointsAccumulated, issue) => {
    return pointsAccumulated + getPoints(issue);
  }, 0);
}

export function getPoints(issue) {
  let point = issue.title.match(/{(\d+)}/) ? issue.title.match(/{(\d+)}/)[1] : 0;
  return parseInt(point);
}
