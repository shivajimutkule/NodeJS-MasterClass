# Home assignement#1

Please create a simple "Hello World" API. Meaning:

1. It should be a RESTful JSON API that listens on a port of your choice. 

2. When someone posts anything to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want. 

Server logs:

C:\Projects\node-master\NodeJS-MasterClass\HomeAssignement#1>node index.js
server started on port: 3000
POST /hello?test=t
Request body:{"test": "test"}

Response for above request:
JSON: {"message":"Hello world"}

