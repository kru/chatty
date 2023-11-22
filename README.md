## Date of submission
2023-11-22

## Instruction to run assiggment locally
run the following command
```
docker-compose up
```

User unable to join any room in the first run.
we need to create the room by the following request:

```
curl --request POST \
  --url http://localhost:8080/rooms \
  --header 'Content-Type: application/json' \
  --data '{
	"roomId": "8778",
	"name": "testing"
}'
```

## Time Spent
- ~18 hours

## Assumptions made
- No framework should be use, as the requirements only specify NodeJS + MongoDB
- No fancy styling for the proof of concept
- No limit on how many users can join (although we bound to the server resources)

## Shortcuts/Compromises made
- Server project structure can be made more modular
- No unit testing, should have covered some cases in the logic
- No encryption as for local development

## Assume your application will go into production...

What would be your approach to ensuring the application is ready for production (testing)?
- Conduct e2e, load, and functional testing

How would you ensure a smooth user experience as 1000’s of users start using your app simultaneously?
- Optimize code by doing profiling
- Single database connection 
- Depend on the situation we can do horizontal scaling, spawing additional containers

What key steps would you take to ensure application security?
- Making sure the data UI and API utilizing https and have the API gateway in front of them to minimize risk

## What did you not include in your solution that you want us to know about? 
- Offline experience using service worker
- Send message while offline and auto reconnect when connection available
- auto scroll on new message
- maybe notification if that is not too overkill
- Use modern framework in the BE definitely speed up development, like fastify or nest.
