---
title:  'Refactoring towards "better" code'
layout: post
desc:   The one where I wax profound on what makes code good, complete with examples.
reddit: true
hackernews: true
---
What makes code good? How do you quantify code quality? I'm not talking metrics, I'm talking good old gut feel. How do know good code when you see it? Certainly, working code is better than non-working code. But laying that aside; if two codebases work as expected, how do you judge which is better? Instead of talking about how I make that judgement, how about I show you?

I caught a bit of heat yesterday for [a retweet](https://twitter.com/aarongraves/status/299225888338370560) about [some code](https://github.com/discourse/discourse/blob/21b562852885f883be43032e03c709241e8e6d4f/app/controllers/users_controller.rb#L286) from the newly released Discourse project that was not following the typical Rails conventions. In retrospect I see that I was wrong to do so, and I apologize. Several people rightly suggested to me that I submit a pull request instead, so [here it is](https://github.com/discourse/discourse/pull/57).

The code in question is the implementation of the `UsersController#search_users` action. This action is not super critical to the running of the site. The changes I'll be showing here do not represent an unrolling of any significant performance optimization, AFAIK. I am going to attempt to perform a true refactor: improving the internals of the code without affecting the external behavior, _including_ performance.

The first step is to make sure that we have adequate code coverage to perform a refactor. We need to know if we have changed any behavior accidentally, or introduced a logical error in our new code. Unfortunately, there are no existing tests for this action. So our first step is to add those tests.

The Discourse application is using RSpec, so we'll create a new file for our new tests:

    spec/controllers/users_controller/search_users_spec.rb

I choose to create a new test file instead of adding a new context to the existing UsersController test for a couple reasons: First, because the new tests are going to be specific to the search logic, the data setup will be much different. And second, I dislike traversing a spec file hundreds or thousands of lines long looking for the right nested block. I do, however, have lots of experience traversing directories and finding files.

The search logic itself is pretty simple. It performs a search using PostgreSQL's full text capabilities. The only real complexity is in how the results are sorted. The closest matches are sorted first. If a topic is provided then those users with posts on the topic will be ranked higher than those without. So the question is how to add test coverage?

The approach I'm using here is slow. I'm more concerned with correctness of the behavior than the speed of the tests at the moment. But I am confident these tests will be revisited and improved for speed later, so let's make the tests as clear as we can.

Pasting all the tests here isn't too interesting. You can view the full commit here: [Add test coverage for UsersController#search_users](https://github.com/blowmage/discourse/commit/01367275957146769c79ae5d4f9e7c2a1b9ab9ec)

Now that we have tests, I want to move the bulk of search logic from UsersController#search_users to a model. The reason is because the majority of the code specific to the implementation. Ideally, I want to be able to change the implementation of my search without having to change the controller code. I don't want to move even more code to the poor User model; it looks far too bloated already. Instead, lets create a new domain model. I want this new model to just be responsible for the User search, so let's call it UserSearch.

    app/models/user_search.rb

{% highlight diff %}
   def search_users
     term = (params[:term] || "").strip.downcase
     topic_id = params[:topic_id]
     topic_id = topic_id.to_i if topic_id
-    sql = "select username, name, email from users u "
-    if topic_id
-      sql << "left join (select distinct p.user_id from posts p where topic_id = :topic_id) s on 
-        s.user_id = u.id "
-    end
-
-    if term.length > 0
-      sql << "where username_lower like :term_like or 
-              to_tsvector('simple', name) @@ 
-              to_tsquery('simple',
-                regexp_replace(
-                  regexp_replace( 
-                    cast(plainto_tsquery(:term) as text) 
-                    ,'\''(?: |$)', ':*''', 'g'),
-                '''', '', 'g')
-              ) "
-
-    end
-
-    sql << "order by case when username_lower = :term then 0 else 1 end asc, "
-    if topic_id 
-      sql << " case when s.user_id is null then 0 else 1 end desc, "
-    end
-
-    sql << " case when last_seen_at is null then 0 else 1 end desc, last_seen_at desc, username asc limit(20)"
-
-    results = User.exec_sql(sql, topic_id: topic_id, term_like: "#{term}%", term: term)
-    results = results.map do |r|
-      r["avatar_template"] = User.avatar_template(r["email"])
-      r.delete("email")
-      r
-    end
-    render :json => results 
+
+    results = UserSearch.search term, topic_id
+    render :json => results
   end
{% endhighlight %}

{% highlight ruby %}
class UserSearch

  def self.search term, topic_id
    sql = "select username, name, email from users u "
    if topic_id
      sql << "left join (select distinct p.user_id from posts p where topic_id = :topic_id) s on
        s.user_id = u.id "
    end

    if term.length > 0
      sql << "where username_lower like :term_like or
              to_tsvector('simple', name) @@
              to_tsquery('simple',
                regexp_replace(
                  regexp_replace(
                    cast(plainto_tsquery(:term) as text)
                    ,'\''(?: |$)', ':*''', 'g'),
                '''', '', 'g')
              ) "

    end

    sql << "order by case when username_lower = :term then 0 else 1 end asc, "
    if topic_id
      sql << " case when s.user_id is null then 0 else 1 end desc, "
    end

    sql << " case when last_seen_at is null then 0 else 1 end desc, last_seen_at desc, username asc limit(20)"

    results = User.exec_sql(sql, topic_id: topic_id, term_like: "#{term}%", term: term)
    results = results.map do |r|
      r["avatar_template"] = User.avatar_template(r["email"])
      r.delete("email")
      r
    end
  end

end
{% endhighlight %}

Some might wonder why this new object doesn't go in the lib directory instead. For me, the lib directory is for code that can someday be extracted out of the app. Like a library to access an API. Something like searching users seems to be a core part of the domain for this app. Even though this controller is the only thing calling it now, I can see an admin controller, or a background job (like a mailer) using this functionality in the future. So I think it makes sense to place this in `app/models`.

Another question some may have is why `UserSearch` doesn't inherit from `ActiveRecord`. Well, this new domain model isn't going to be responsible for representing a `User` record; its job is to search for those records. Not every model in your domain needs to inherit from `ActiveRecord`. As apps grow larger I find its better to have more and more of my domain logic outside of the `ActiveRecord` models and in other domain models.

You can view the full commit here: [Extract search logic to UserSearch model](https://github.com/blowmage/discourse/commit/972b9d735c9bc07963d77cc53a07ef9bbe0a0e45)

With this move the tests still pass. Notice I don't have any unit tests for the `UserSearch` object yet. I could add some, but they would only be duplicates of the `search_users` test. So for now I'm going to allow those `search_users` tests to act as acceptance tests for `UserSearch`. I have some ideas for what I eventually want this object to be and do, so I'm skipping the tests for just a bit, while I experiment a bit more.

The controller method now looks much better.

{% highlight ruby %}
def search_users
  term = (params[:term] || "").strip.downcase
  topic_id = params[:topic_id]
  topic_id = topic_id.to_i if topic_id

  results = UserSearch.search term, topic_id
  render :json => results
end
{% endhighlight %}

There are three main parts to the method now:

1. Cleansing the options provided by the user
2. Retrieving the data
3. Formatting the data to return to the user

This is how I want to see my controller actions. I don't want to be distracted by the implementation details of any of those steps. I simply want a declaration of the steps that the controller is responsible for.

Now that the controller is more declarative and less instructional, let's see if we can help UserSearch to be less hairy. All the logic is on one big method. It seems we can break that up into individual methods with separate responsibilities. I think it makes sense to separate the code that generates the SQL from the code that executes the SQL.

{% highlight diff %}
 class UserSearch
 
   def self.search term, topic_id
-    sql = "select username, name, email from users u "
-    if topic_id
-      sql << "left join (select distinct p.user_id from posts p where topic_id = :topic_id) s on
-        s.user_id = u.id "
-    end
-
-    if term.length > 0
-      sql << "where username_lower like :term_like or
-              to_tsvector('simple', name) @@
-              to_tsquery('simple',
-                regexp_replace(
-                  regexp_replace(
-                    cast(plainto_tsquery(:term) as text)
-                    ,'\''(?: |$)', ':*''', 'g'),
-                '''', '', 'g')
-              ) "
-
-    end
-
-    sql << "order by case when username_lower = :term then 0 else 1 end asc, "
-    if topic_id
-      sql << " case when s.user_id is null then 0 else 1 end desc, "
-    end
-
-    sql << " case when last_seen_at is null then 0 else 1 end desc, last_seen_at desc, username asc limit(20)"
+    sql = sql term, topic_id
     results = User.exec_sql(sql, topic_id: topic_id, term_like: "#{term}%", term: term)
     results = results.map do |r|
       r["avatar_template"] = User.avatar_template(r["email"])
       r.delete("email")
       r
     end
   end
+
+  def self.sql term, topic_id
+    sql = "select username, name, email from users u "
+    if topic_id
+      sql << "left join (select distinct p.user_id from posts p where topic_id = :topic_id) s on
+        s.user_id = u.id "
+    end
+
+    if term.length > 0
+      sql << "where username_lower like :term_like or
+              to_tsvector('simple', name) @@
+              to_tsquery('simple',
+                regexp_replace(
+                  regexp_replace(
+                    cast(plainto_tsquery(:term) as text)
+                    ,'\''(?: |$)', ':*''', 'g'),
+                '''', '', 'g')
+              ) "
+
+    end
+
+    sql << "order by case when username_lower = :term then 0 else 1 end asc, "
+    if topic_id
+      sql << " case when s.user_id is null then 0 else 1 end desc, "
+    end
+
+    sql << " case when last_seen_at is null then 0 else 1 end desc, last_seen_at desc, username asc limit(20)"
+    sql
+  end
 
 end
{% endhighlight %}

You can view the full commit here: [Extract SQL generation method](https://github.com/blowmage/discourse/commit/1cd565ec0d04c6b26896145eba603eb60fc982fc)

That seems to be clearer for me, and all the SQL string concatenation is isolated into one method. If a new mechanism was introduced to generate the SQL string, only `UserSearch.sql` would have to change.

At this point I'm ready to start making some slight changes to how the code works. I spoke with one of the developers and he mentioned that they wanted the objects returned from the search to be the normal `ActiveRecord` models, and not just an array of hashes. In order to make that change we'll have to change some of the details of `UserSearch`, but also change the formatting of the data in `UserController` to ensure that the behavior remains.

The first change here is to use `User.find_by_sql` instead of `User.exec_sql`. This means that the extra work that the `search` method performed to add `avatar_template` and remove `email` can be removed. The User objects can calculate `avatar_template`, and UserController can remove email from the `results`. In order to use `User.find_by_sql`, the SQL string must have the values added to the string.

{% highlight diff %}
 class UserSearch
 
   def self.search term, topic_id
-    sql = sql term, topic_id
-    results = User.exec_sql(sql, topic_id: topic_id, term_like: "#{term}%", term: term)
-    results = results.map do |r|
-      r["avatar_template"] = User.avatar_template(r["email"])
-      r.delete("email")
-      r
-    end
+    User.find_by_sql sql(term, topic_id)
   end
 
+  private
+
   def self.sql term, topic_id
     sql = "select username, name, email from users u "
     if topic_id
       sql << "left join (select distinct p.user_id from posts p where topic_id = :topic_id) s on
         s.user_id = u.id "
     end
   
     if term.length > 0
       sql << "where username_lower like :term_like or
               to_tsvector('simple', name) @@
               to_tsquery('simple',
                 regexp_replace(
                   regexp_replace(
                     cast(plainto_tsquery(:term) as text)
                     ,'\''(?: |$)', ':*''', 'g'),
                 '''', '', 'g')
               ) "
   
     end
   
     sql << "order by case when username_lower = :term then 0 else 1 end asc, "
     if topic_id
       sql << " case when s.user_id is null then 0 else 1 end desc, "
     end
   
     sql << " case when last_seen_at is null then 0 else 1 end desc, last_seen_at desc, username asc limit(20)"
-    sql
+
+    sanitize_sql_array(sql, topic_id: topic_id, term_like: "#{term}%", term: term)
+  end
+
+  def self.sanitize_sql_array *args
+    ActiveRecord::Base.send(:sanitize_sql_array, args)
   end
 
 end
{% endhighlight %}

The second change is to properly serialize the objects to JSON and match the existing format.

{% highlight diff %}
   def search_users
     term = (params[:term] || "").strip.downcase
     topic_id = params[:topic_id]
     topic_id = topic_id.to_i if topic_id

     results = UserSearch.search term, topic_id

-    render :json => results
+    render json: { users: results.as_json( only:    [ :username, :name ],
+                                           methods: :avatar_template ) }
   end
{% endhighlight %}

You can view the full commit here: [Return User objects instead of hashes](https://github.com/blowmage/discourse/commit/5b01ac92880e8468f012abd2c844f63dd0db5b7a)

And the tests still pass.

There are a couple more things that stand out to me. The fact that we are downcasing `term` in the controller, and that the generated SQL is expecting the value to be downcased. This seems odd to me. I'd like these objects to be a little more liberal in the data they accept. One way to address this is to change the conditional from LIKE to ILIKE, which is case insensitive. I'm not sure if there are performance concerns about that though. Another option would be to change the SQL to `lower(username) LIKE lower(:term_like)`, and create an index for lower(username). Yes, PostgreSQL will index values returned from functions like `lower()`. I suspect the `username_lower` column could be removed as well.

{% highlight diff %}
     if term.length > 0
-      sql << "where username_lower like :term_like or
+      sql << "where username ilike :term_like or
               to_tsvector('simple', name) @@
               to_tsquery('simple',
{% endhighlight %}

{% highlight diff %}
   def search_users
-    term = (params[:term] || "").strip.downcase
+    term = params[:term].to_s.strip
     topic_id = params[:topic_id]
     topic_id = topic_id.to_i if topic_id
{% endhighlight %}

You can view the full commit here: [Remove expectation of term case](https://github.com/blowmage/discourse/commit/e41b6537f94805d778d9420a66fe15dd34d8d319)

Now I am generally happy with the state of the code, and its time to focus on the state of the tests. All of our test coverage is in the controller tests. Controller tests are integration tests, and I dislike having this much detail specified in the controller tests. I like my controller tests to check that the actions are responding as expected, and to do little more than a sanity check that the data returned in as expected. In other words, the integration tests make sure that the integration works. If the data is important enough to be tested, then it should be extracted to its own object and unit tested there. Luckily we have just that with our new `UserSearch` object.

So my next commit is to move the bulk of the behavior tests for the UserSearch to the new `spec/models/user_search_spec.rb` file. I'll also remove the previous `search_users` test file and add some very general tests to the `spec/controllers/user_controller_spec.rb` file. Yes, I know I said I like separate files for my tests, but this isn't my project so I'm going to try to follow their conventions in the pull request as much as possible.

Lots of changes here. You can view the full commit here: [Refactor UserSearch tests](https://github.com/blowmage/discourse/commit/d72c26ff92fd0ba56a8d5fd6e447fb4a00824679)

I think this is where I'll leave this refactor for now. `UserSearch.search` still returns an array, but now it is an array of User objects and not an array of hashes. A next step would be to return an `ActiveRecord::Relation` object, so that additional criteria could be added, such as pagination. That would move the query away from the specific SQL statements, and I'm not sure that the developer is ready for this change just yet. Hopefully the advantages of passing an `ActiveRecord::Relation` object instead of an array will change the maintainers' minds in the future.

Other changes that could be made include how the user search results are serialized to JSON. Right now that is all happening in the render call in the controller's action. That could be extracted to a UserSearchSerializer.

Lastly, I want to point out that concerns such as performance don't necessitate ugly code. Everything should have its place. Even the most performance intensive and vital code can be given a declarative name and dealt with in a clean, maintainable way. Like testing, I do not believe that there is an advantage to skipping this step to get the code completed faster. It may see like it at first, but once you get used to taking this design step you quickly realize how much time is wasted on improperly designed code when you go back to old projects.

Schizophrenic code, by which I mean methods with an inconsistent level of abstraction, is difficult to reason about. Programmers new to your app will struggle more than necessary in order to understand how the app works. I've seen this over and over, and the effect is similar to hazing new members of a group. Don't be a code bully, whether intentional or not. Life is too short to deal with hostile code. Be nice in all that you do, including your code.
