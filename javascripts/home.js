function retrieveCommits(data) {
  return jQuery.map(data, function(value, index) {
    return (value.type == 'PushEvent') ? value : null
  }).slice(0,10); // We only want the first 10 commits
}

function commitsHTML(commits) {
  return jQuery.map(commits, function(commit, index) {
    return commitHTML(commit);
  });
}

function commitHTML(commit) {
  var div = $('<div>', {'class': 'commit'});
  var link = $("<a>", {'href': commit.repository.url});
  link.append(commit.repository.name);
  div.append($('<h3>').append(link));
  var ul = $('<ul>');
  jQuery.each(commit.payload.shas, function(index, sha){
    var li = $('<li>');
    var link = $("<a>", {'href': 'http://github.com/blowmage/' + commit.repository.name + '/commit/' + sha[0]});
    link.append(sha[0].substring(0, 7));
    li.append(link);
    li.append(' - ');
    li.append(sha[2]);
    ul.append(li);
  });
  div.append(ul);
  return div;
}

function loadGitHubCommits(data) {
  commits = commitsHTML(retrieveCommits(data))
  $('div#commits').html('');
  jQuery.each(commits, function(index, commit){
    $('div#commits').append(commit);
  });
}