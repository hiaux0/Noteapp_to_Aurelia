# MEAUN Setup

## 1. Install Aurelia Skeleton Navigation
- from [Aurelia's official Github](https://github.com/aurelia/skeleton-navigation)

## 2. Project Folder setup
- Setup a folder structure as the following  
MEAUN-test  
├── server  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   └── server.js  
└── skeleton-esnext      
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──  ...   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── src  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──  ...  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── app.js

## 3. MongoDB SETUP
- [Mongo Auth Setup](https://docs.mongodb.com/manual/tutorial/enable-authentication/)
- In my case, db = dbtest, user and pw = dbtest

## 4. Run
- Navigate in terminal to /server
> node server.js

## 5. The code
In server.js
- [Mongo Setup](http://mongodb.github.io/node-mongodb-native/3.0/quick-start/quick-start/) ("Connect to MongoDB")

# TODO
- #080301 
  - Simple connection with MongoDB is established.
  - Now, how to access data in Aurelia part?