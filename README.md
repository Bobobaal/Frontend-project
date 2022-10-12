# Watchlist frontend
A website where people can keep a list of the movies they've watched on their own personal account

Because it was a small scale project and due to public API's having a limit on calls, you have to add the movies yourself as a trusted account.

Overall not very happy with the design, it's overly bright and could've used some more darker color.
Looking back it's of very poor design, should've done better.

## How to start
First install all the required packages with `yarn install`

Run the app with `yarn start`.

Run the tests with `yarn run cypress open`

## Existing user accounts that can be used
To login it's a combination of email + password.

**THE PASSWORD FOR ALL USERS (running local): 12345678**

There are 4 accounts, 2 of which are basically duplicates:
  - Test1, test1@hotmail.com (admin user)
  - Test2, test2@hotmail.com (basic user)
  - Test3, test3@hotmail.com (trusted user)
  - Test4, test4@hotmail.com (basic user)

Basic information about the trusted user:  
Role implemented to (if this would actually be deployed for real) prevent users to make random stuff, so the database doesn't get filled with "garbage data".  
People with this role are allowed to add movies and update them. (Not delete them, found it more appropriate that only an admin can do that.)

### Backend for this project
You have to run this backend in order to use the front-end

[Link Backend](https://github.com/Bobobaal/Backend-project)
