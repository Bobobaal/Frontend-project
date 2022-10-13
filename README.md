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

##Screenshots

**Sign in**
![image](https://user-images.githubusercontent.com/15947020/195470351-12391ec9-613f-4828-bb46-8242e4c53126.png)

**Register**
![image](https://user-images.githubusercontent.com/15947020/195470376-aadaeeca-1cfe-430b-8023-50a1b6a94dd7.png)

**Logged in user's watchlist**
![image](https://user-images.githubusercontent.com/15947020/195470686-f17e152b-a26b-4b7e-9592-f2269c3f58c6.png)
*Under watched is a button that changes text when you set it to watched or not watched  
Edit button enables the select where the movie title is in so you can change the entry. Both edit and delete will change to save & cancel buttons.  
Small oversight on my part when canceling and you have changed the select it will only disable the select but not return it to its original value, it will when you reload the page.  
I'll be honest I should've come up with a better solution than this when considering how to edit a watchlist item*

**Movies list**
![image](https://user-images.githubusercontent.com/15947020/195471329-9287b675-6bde-47ee-8bf9-5295bbab6513.png)
*If the account has a trusted role the delete button will not be visible, if it's just a regular user account all buttons except the nav buttons and the search button will not be visible*

**Movies list with star search parameter**
![image](https://user-images.githubusercontent.com/15947020/195471587-14bc8a66-7d3f-461f-96e2-8a2467be0a31.png)
