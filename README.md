# Watchlist frontend

## How to start
First install all the required packages with `yarn install`

Run the app with `yarn start`.

Run the tests with `yarn run cypress open`

## Existing user accounts that can be used
To login it's a combination of email + password.

**THE PASSWORD FOR ALL USERS (running local): 12345678  
ON HEROKU IT IS: Hogent123!**

There are 4 accounts, 2 of which are basically duplicates:
  - Test1, test1@hotmail.com (admin user)
  - Test2, test2@hotmail.com (basic user)
  - Test3, test3@hotmail.com (trusted user)
  - Test4, test4@hotmail.com (basic user)

Basic information about the trusted user:  
Role implemented to (if this would actually be deployed for real) prevent users to make random stuff, so the database doesn't get filled with "garbage data".  
People with this role are allowed to add movies and update them. (Not delete them, found it more appropriate that only an admin can do that.)

### Github pages
[Link Github Pages](https://dietervmb.github.io/frontendweb-pieter-2122-DieterVMB/)
