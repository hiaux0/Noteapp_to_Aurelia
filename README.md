- [MEAUN Skeleton](#meaun-skeleton)
  - [Setup](#setup)
    - [Server](#server)
      - [Folder structure](#folder-structure)
      - [Modules](#modules)
    - [Client](#client)
      - [Modules](#modules)
  - [Start MongoDB](#start-mongodb)
    - [Establish connection to database and provide API](#establish-connection-to-database-and-provide-api)
    - [Use database API](#use-database-api)
  - [TODO](#todo)
  - [Issues](#issues)
    - [Solved](#solved)

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

## Start MongoDB
- Start a server following [MongoDB Enable Auth](https://docs.mongodb.com/manual/tutorial/enable-authentication/
)
  - (For my reference: [Summarized version](/Users/hdn/Desktop/Coding/Notes/Javascript/MongoDB/Enable_Auth.md))

### Establish connection to database and provide API
- See /server

### Use database API
make use of database API
- GET, POST are straightforward
- PUT
  - use pub/sub system using EventAggregator 
    - import {EventAggregator} from 'aurelia-event-aggregator'- DELETE
  - an update will be seen in real time (have to confirm button though)
  - use pub/sub system using EventAggregator 
    - import {EventAggregator} from 'aurelia-event-aggregator'
  - if you delete a specific element from a list, this systems allows to update the list in real time

## TODO
- Add guide from scratch
- add something similar to `canSave` (Aurelia Contact Manager Tutorial) to monitor request and changes

## Issues
Issues I came across when building 

### Solved
- Access-Control-Allow-Origin / CORS
  - const myRequest = new Request("address", {mode:'no-cors'})
  - in the response header send
    - `res.header("Access-Control-Allow-Origin", "*");`
- 'dezalgo'
  - https://github.com/npm/dezalgo/issues/6 https://github.com/npm/npm/issues/17444#issuecomment-361147551 https://github.com/OSSIndex/auditjs/commit/1705b98dea5ea464590484318dd98363fb6006e8
  - delete package-lock.json
