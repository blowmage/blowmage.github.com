function loadTwitterTweets(data) {
  $('div#tweets').html('');
  jQuery.each(data.slice(0,10), function(index, tweet){
    $('div#tweets').append(tweetHTML(tweet));
  });
}

function tweetHTML(tweet) {
  var div = $('<div>', {'class': 'tweet'});
  div.append($('<blockquote>').append(tweet.text));
  var link = $("<a>", {'href': 'http://twitter.com/blowmage/status/' + tweet.id});
  link.append('tweeted ' + prettyDate(tweet.created_at));
  div.append($('<p>').append(link));
  return div;
}

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

/*
 * JavaScript Pretty Date
 * Copyright (c) 2008 John Resig (jquery.com)
 * Licensed under the MIT license.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
  var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);

  if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
    return;

  return day_diff == 0 && (
      diff < 60 && "just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
    day_diff == 1 && "yesterday" ||
    day_diff < 7 && day_diff + " days ago" ||
    day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}