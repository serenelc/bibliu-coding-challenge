# Links I used for help
- http://www.passportjs.org/docs/username-password/
- https://codeforgeek.com/handle-get-post-request-express-4/
- https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data/Template_primer
- https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data
- https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
- https://cloud.mongodb.com/v2/5d89b367d5ec13595d9ac6f4#metrics/replicaSet/5d89b429aa2dfe65b23ff717/explorer/bibliu/users/find
- https://mongoosejs.com/docs/guide.html
- https://mongoosejs.com/docs/api/model.html
- https://github.com/omniti-labs/jsend

# To do/discuss
- I need to change my authentication to use passport js and respond using jsend
   - I tried implementing signing in authentication using the passport library (see the commented out code), however, I was unable to get it to work, so I have gone back to the none passport way of authenticating my signing in.
- I need to hide my passwords so that they are not in the url of the post request when institution does not exist
- I need to make sure the query strings in the urls aren't shown because if they are this means users can override the security and access other routes (as they now know what format the url takes)
   - For both of the above maybe the use of session tokens or something along those lines would be the way forward? Haven't really used those before so unsure how exactly I would go about doing it, but I could store a variety of things related to the logged in user in the session token and use that instead of query parameters?

# Express Coding Challenge
The premise of this challenge is to see the approach you take to:
- Use an ORM to interact with a simple database model
- Create a basic routing mechanism for HTTP requests
- Authenticate a user’s access to a route
- Respond to a request in a consistent and logical manner
- Test your work with both unit tests and integration tests.

Please clone this repository and send through your completed coding challenge using whatever you feel fit. We'll take a look and then have a chat about the decisions you took and challenges you encountered. Thanks for taking the time.

## Challenge
1. Use [Sequelize](http://docs.sequelizejs.com/manual/installation/getting-started) or [Mongoose](https://mongoosejs.com/) to define:

   1.1. A **`User`** model which should have basic identifying information:
      - Name
      - Email address
      - Role (Acceptable entries: ‘student’, ‘academic’, ‘administrator’)
      - Password.

   1.2. An **`Institution`** model which stores information about a school:
      - Name
      - URL
      - Email domain.
      
   1.3. A **`Book`** model which stores information about books:
      - ISBN
      - Title
      - Author.
      
   1.4. Relationships between **`Users`** and **`Institutions`**, and **`Books`** and **`Institutions`** (Consider #4.3 in the relationships you create).
2. Use [Express](https://expressjs.com/) to respond to requests.
3. Create a test suite which includes code coverage, to unit and integration test the routes you’ve created.
4. Create routes:

    4.1 `POST /users/signin` Use the passport library to authenticate a user and respond with a successful message that uses the [JSend](https://labs.omniti.com/labs/jsend) framework
    
    4.2 `POST /users/create` Creates a user and based on the user’s email domain links them to an institution. Denies creation of a user if their domain does not exist.
    
    4.3 `GET /books` Once authenticated, responds with a JSON object containing a list of Books that the user has access to via their Institution.
5. (Optional) Provide a [Postman](https://www.getpostman.com/) collection which performs some basically functionality on the routes you've created.

## Things to keep in mind
- Security
- Scalability
- Consistency
- Testing.

## Running this application
You can run the application by typing:
`npm install` followed by `npm start` 

## The structure of this repository
The structure of this repository should be relatively self-explanatory. 
Use the appropriate directory for your code. A basic example has been provided for the index route.