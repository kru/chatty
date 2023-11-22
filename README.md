## Date of submission
2023-11-22

## Instruction to run assiggment locally

- Clone the project
```
git@github.com:kru/chatty.git
```

- Create `.env` under server file, and copy the values from `.env.example`

- Run the following command in root project directory (one level with `docker-compose.yml`)
```
docker-compose up
```

**NOTE:** User unable to join any room in the first run.
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

Access the app via browser with this url http://localhost:5173

API available under port 8080, http://localhost:8080/

**NOTE:** to test with another user, we can use incognito mode or open another browser

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
