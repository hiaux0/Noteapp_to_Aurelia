- [MEAUN Skeleton](#meaun-skeleton)
  - [Setup](#setup)
    - [Server](#server)
      - [Folder structure](#folder-structure)
      - [Modules](#modules)
    - [Client](#client)
      - [Modules](#modules)
  - [Start MondoDB](#start-mondodb)
    - [Establish connection to database and provide API](#establish-connection-to-database-and-provide-api)
    - [Fetch and Post to DB from Client side](#fetch-and-post-to-db-from-client-side)
  - [TODO](#todo)

# MEAUN Skeleton

## Setup
Instructions to build skeleton application which uses MongoDB, Express, Aurelia and NodeJS

### Server
Server side setup

#### Folder structure
server
- api
  - controllers
    - todoListController.js
  - models
    - todoListModel.js
  - routes
    - todoListRoutes.js
- server.js

#### Modules
- express, mongoose, body-parser, nodemon

### Client
Client side setup

- simply run `au new`

#### Modules
- aurelia-client-fetch

## Start MondoDB
- Start a server following [MongoDB Enable Auth](https://docs.mongodb.com/manual/tutorial/enable-authentication/
)
  - (For my reference: [Summarized version](/Users/hdn/Desktop/Coding/Notes/Javascript/MongoDB/Enable_Auth.md))

### Establish connection to database and provide API
- See /server

### Fetch and Post to DB from Client side
- See /client/src/app.js
  - data fetch from database
  - Post: TODO

## TODO
- Add guide from scratch
