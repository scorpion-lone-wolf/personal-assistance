# Week → 9 ➖ Data Transfer Technique & GraphQL Vs Rest & RPC and gRPC

> When dealing with large files or continuous data (like video, music , or APIs ), how you transfer data between client and server matters a lot.
> 

# 👉🏻 *Data Transfer Technique*

## ***Buffered Response***

Buffered Response means the entire data (like a file or JSON) is fully loaded into memory first , and then sent to the client in one go.

### ***📦 Think of it like*** ➖

> “You pack the whole parcel first, then send it at once.”
> 

### ***⚙️ Use case ➖***

- Small data (like JSON APIs)
- Simple downloads (small files)
- When you need to modify or compress the entire data before sending.

### ***🧩 Drawback ➖***

- Loads **entire file into memory** → not scalable for large files (can cause memory overflow).

---

![image.png](Week%20%E2%86%92%209%20%E2%9E%96%20Data%20Transfer%20Technique%20&%20GraphQL%20Vs%20Re/image.png)

## ***HTTP Streaming (using*** `.pipe()` ***)***

> Instead of loading full file , we send data in chunks as it’s read ➖ like a stream of water.
> 

### **📦 Analogy ➖**

→ Instead of waiting for whole movie to download, you start watching as it’s still loading.

### ⚙️ Use case ➖

- Large file downloads (videos, images)
- Real-time logs or responses
- Live streaming

### **🧩 Benefits ➖**

✅ Memory efficient

✅ Starts sending data immediately

✅ Great for large files

---

### ***Concepts ➖***

- When we use streams in Node.js (like `fs.createWriteStream` or `fs.createReadStream` ):
    - It doesn’t read or write the entire file at once.
    - Instead , it works with chunks of data stored in buffer.
    - This makes it possible to handle very large files without loading everything into memory.
- `pipe()` - pipe is a method used to connect two streams -
    - One stream that produces data (Readable Steam) and another that consume data(Writable Stream)
    - ***Note : In node.js response object is a Writable Stream.***

## ***Partial Content Response (***Range Requests*)*

> This allow clients to requests only a part of file , not the whole thing.
> 

It is used in ➖

- Video Streaming
- Resuming Downloads.
- Scrubbing through media.(e.g., YouTube’s seek Bar)

---

### ***🧩 Benefit:***

✅ Enables seek & resume

✅ Optimizes bandwidth usage

✅ Used by browsers for streaming videos efficiently

---

***Note : The Status Code that we use in header for the partial response is*** **`206`**

⇒ It is generally used when User choose the Range from where he wants the data/media.

## ***SSE** (*Server Sent Event*)*

- Allows Server to Initiate a one-way stream of updates to the client over an HTTP connection unlike WebSockets which allow full-duplex communication.
- SSE is only one-way: the server sends updates, and the client receives them.
- **The server holds the connection open and sends updates to the client as needed.**
- Example use-case :
    - ***Live news feeds***
    - ***Stock price updates***
    - ***Live sports scores***
    - ***Real-time monitoring dashboards***
- SSE works over standard HTTP connection , using a specific content-type and format to send update.
- Server respond with **`*text/event-stream*`** content-type and data is sent in the following format :
    - i.e → **`*data: some message to send \n\n*`**

---

---

# 👉🏻 ***REST Vs GraphQL***

## ***REST***

REST (Representational State Transfer) is an ***architectural style*** for designing networked applications. You expose endpoints (URLs) where each represents a resources -  like `/users` , `/posts`, etc .

Communication happens over HTTP using verbs like `GET` , `POST` , `PUT` , `DELETE`

- Example ➖

```jsx
GET /users/123
→ Returns user with ID 123

POST /users
→ Creates a new user

```

***✅ Advantages ➖***

- Simple and widely understood (uses standard HTTP)
- Easy to monitor and debug using tools like Postman or curl
- Scales easily for simple APIs

***❌ Limitations ➖*** 

- ***Over-fetching*** :
    - You get **more data than needed.**
    - → Example: `GET /users` returns name, email, address, posts — even if you only need `name`
- ***Under-fetching*** :
    - You get **less data than needed**, forcing multiple requests.
    - → Example: To get a user’s posts, you might call `/users/:id` then `/users/:id/posts`.
- ***Versioning overhead*** :
    - Changing data format often requires creating `/v2/` or `/v3/` endpoints.
- ***Tightly coupled client-server contract*** :
    - Any change in server response might break the client

## *GraphQL*

### ***What Problem does GraphQL Solves*** ?

- Before GraphQL most APIs Used REST(Representational State Transfer)
- Example :
    
    ```jsx
    GET /users/1
    GET /users/1/posts
    GET /posts/10/comments
    ```
    
- The Frontend Often has problems :
    - OverFetching
    - UnderFetching
    - Multiple API calls

---

#### ***OverFetching*** :

Frontend only needs 

```jsx
{
  "name": "John",
  "email": "john@gmail.com"
}
```

But Backend Sends :

```jsx
{
  "id": 1,
  "name": "John",
  "email": "john@gmail.com",
  "createdAt": "...",
  "updatedAt": "...",
  "profile": {},
  "settings": {},
  "permissions": []
}
```

This is called OverFetching

#### ***UnderFetching*** :

Frontend needs user + posts + comments 

REST may require :

```jsx
GET /user/1
GET /user/1/posts
GET /posts/1/comments
```

This is underFetching and we have to do Multiple request to achieve 1 task.

- ***GraphQL*** (by Meta) is a query language for APIs ➖ you ask for exactly what you need and get a single , predictable JSON response.
- Instead of Multiple Endpoints , you get one endpoint :
    
    ```jsx
    POST /graphql
    ```
    
- and you send a query

```graphql
{
  user(id: "123") {
    name
    posts {
      title
      comments {
        text
      }
    }
  }
}
```

***✅ Advantages :*** 

- ***No Over-fetching or Under-fetching***
    - Client defines exactly what fields are needed.
    - One query can fetch nested related data.
- ***Single Endpoint***
    - All queries/mutations go to `/graphql`.
- ***Strongly Typed Schema***
    - Schema defines exactly what data types and relations exist.
    - Clients know the API structure beforehand.
- ***Efficient for Mobile & Low-bandwidth***
    - Clients request only what they need.

***❌ Limitations :***

- ***Caching is Harder***
    - REST benefits from HTTP caching easily (GET-based).
    - GraphQL uses POST requests, making caching at CDN/proxy level tricky.
- ***Complexity & Learning Curve***
    - Requires learning schema definition, resolvers, and query language.
- ***Overhead for Small APIs***
    - If your data is flat/simple, REST might be simpler to maintain.
- ***File Uploads & Rate Limiting***
    - Harder to handle compared to REST’s simple HTTP endpoints.

---

## **⭐️ *How GraphQL Works ?***

![image.png](Week%20%E2%86%92%209%20%E2%9E%96%20Data%20Transfer%20Technique%20&%20GraphQL%20Vs%20Re/image%201.png)

- The Client ask for what they need, the Server process the request and send what the client ask for.
- We have two part :
    - GraphQL Client
    - GraphQL Server (Here we define the Schema of the data)

---

### ***GraphQL Server ➖***

- 1.***Query*** ➖ ”*Get*” Data
    - A Query is used to read or fetch data from the server.
    - Imagine you go to restaurant and say :
        
        > Can I see the list of all available dishes ?
        > 
    - You’re not changing anything — just asking for the information
    - That’s what a Query does in GraphQL
    
    Example Schema ➖
    
    ```graphql
    type User {
      id: ID!
      name: String!
      email: String!
      posts: [Post!]!     # Relationship - allows nested querying
    }
    
    type Post {
      id: ID!
      title: String!
      content: String
    }
    
    type Query {
      # Best practice names
      user(id: ID!): User
      users: [User!]!           # or allUsers
      post(id: ID!): Post
      posts: [Post!]!
    }
    ```
    
- 2.***Mutation*** ➖ ”*Change*” Data
    - A Mutation is used to create, update or Delete data on server.
    - You’re changing something ➖ not just reading.
    - Example Schema ➖
    
    ```graphql
    type Mutation {
      createUser(name: String!, email: String!): User
      updateUser(id: ID!, name: String, email: String): User
      deleteUser(id: ID!): Boolean    # or String with message
    }
    ```
    
    - Example Client Mutation
    
    ```graphql
    mutation CreateNewUser($name: String!, $email: String!) {
      createUser(name: $name, email: $email) {
        id
        name
        email
      }
    }
    ```
    
    > “Hey Server , create a new user named Alice and give me her id and name in response.”
    > 
- 3.***Resolver*** ➖ ”*The Logic*” Behind it
    - Resolver are actual functions that actually fetch or modify data when a query or mutation is run.
    - They connect the schema to the actual data source — like a database , API or file.
    - Analogies :
        - The resolver is like the chef in our restaurant.
        - When you order “**getAllUsers**”, the chef (resolver) knows how to go into the kitchen (database) and prepare that dish (data).
    
    ---
    
    ```graphql
    # typeDefs
    type User {
      id: ID!
      name: String!
      email: String!
    }
    
    type Query {
      getAllUsers: [User]
    }
    
    type Mutation {
      createUser(name: String!, email: String!): User
    }
    ```
    
    ```graphql
    const users = [
      { id: "1", name: "Alice", email: "alice@example.com" },
      { id: "2", name: "Bob", email: "bob@example.com" }
    ];
    
    # resolvers
    const resolvers = {
      Query: {
        getAllUsers: () => users, // fetch all users
      },
      Mutation: {
        createUser: (_, { name, email }) => {
          const newUser = { id: String(users.length + 1), name, email };
          users.push(newUser);
          return newUser;
        },
      },
    };
    
    ```
    

---

Some object used by resolver function :

- **`*parent*`** and **`*context*`** are objects used in GraphQL resolver function to manage how data is retrieved and shared.

### ***parent***

- The `parent` is the object that contains the object for which it is calling this resolver function.
- Simple meaning : It’s that data from the previous level in your query.

```graphql
query {
  users {
    id
    name
    posts {        # ← Here parent = each User object
      id
      title
    }
  }
}
```

Resolver code

```graphql
const resolvers = {

  Query: {
    users: () => {
      return [
        { id: 1, name: "John" },
        { id: 2, name: "Alice" }
      ]
    }
  },

  User: {
    posts: (parent) => {

      console.log(parent) # this will be User

      return getPostsByUserId(parent.id)
    }
  }

}
```

***Key Points about parent:***

- Used mostly in **nested resolvers** (like User.posts, Post.author).
- Helps you know “which user” or “which post” you are currently working on.
- First argument in resolver function.

### *context*

The **`*context*`** is the object that is shared across all resolver.

### ***Common Things put in context:***

- Logged-in user (currentUser)
- Database connection
- Authentication token
- Authorization rules

Example :

```jsx
// When creating Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({          // Runs on every request
    currentUser: getUserFromToken(req.headers.token),
    db: prismaClient,
    req
  })
});
```

```jsx
Query: {
  users: (parent, args, context) => {
    // context.db  → database
    // context.currentUser → logged in user
    if (!context.currentUser) throw new Error("Not authenticated");
    
    return context.db.user.findMany();
  }
}
```

**Summary Table** :

| **Parameter** | **Meaning** | **When to Use** | **Example Use Case** |
| --- | --- | --- | --- |
| **`parent`** | Data from parent field | Nested fields | **`User.posts`**, **`Post.author`** |
| **`context`** | Shared data for whole request | Auth, DB, Utils | Current user, Prisma client |
| **`args`** | Arguments passed in query | Filters, IDs | **`user(id: "1")`** |

---

---

# 👉🏻 ***RPC and gRPC***

## *Understanding the Real Problem*

Imagine you have:

- A frontend server
- An authentication service
- A payment service
- A notification service

These services run on different machines.

Now suppose the payment service needs user information from the authentication service.

The question becomes:

> How does one server communicate with another server?
> 

This is the core problem that RPC tries to solve.

---

### ***Traditional Approach: REST APIs***

One way to communicate between services is using REST APIs.

For example:

```
GET /users/10
```

This works well and is still widely used.

However, in large distributed systems and microservices architectures, REST can become less efficient for internal service-to-service communication because:

- JSON payloads are relatively large
- Serialization and deserialization of JSON consume CPU
- HTTP/1.1 has limitations
- Streaming support is limited
- Bandwidth usage can become higher
- Strong type contracts are harder to enforce

---

## ***RPC Approach***

RPC (Remote Procedure Call) provides another communication model.

RPC provides a new way of thinking about calling another service.

Instead of thinking in terms of:

- URLs
- HTTP methods
- Resources

you think in terms of:

- calling functions/methods on remote services

Example:

```jsx
authService.getUser(10)
```

Even though the function runs on another machine, it appears similar to a local function call.

The RPC framework handles:

- Network communication
- Serialization/deserialization
- Request/response transport
- Error handling

---

### **Common RPC Frameworks**

Some popular RPC implementations are:

- JSON-RPC
- gRPC

---

### ***Important Clarification***

RPC is a concept or communication model.

gRPC and JSON-RPC are frameworks/protocols that implement RPC.

## ***What is RPC ?***

> RPC = Remote Procedure Call , which is nothing but an Architectural Style.
> 

### Core Idea :

- RPC allows a program to call a function running on another machine as if it was a local function.
- So instead of Thinking :
    
    > I am making an HTTP requests.
    > 
- You Think :
    
    > I am Calling a function
    > 

## ***Local Function Vs Remote Function ?***

### ***Local Function*** ➖

```jsx
function add(a, b) {
  return a + b;
}

const result = add(2, 3);
```

- Everything happens in a same process.

---

### ***Remote Function(RPC concept)*** ➖

```jsx
const result = paymentService.calculateTax(100);
```

- Look like a normal function call.
- But Internally :
    1. Network Request.
    2. Data is Serialized.
    3. Request goes to another server.
    4. Remote Server execute logic.
    5. Response comes back.
- RPC hides networking complexity.

## ***Why RPC exists ?***

Without RPC :

You manually handle :

- URLs
- HTTP methods.
- JSON parsing (Serialization + Deserialization)
- Network details.

RPC abstract these details.

---

### *RPC vs REST mental model*

- For REST :
    - You think : “Resource + HTTP-Method + url”
- For RPC :
    - You think : “ function/method

## ***Types of RPC system - Framework of RPC ?***

1. JSON-RPC ⇒ Uses **`*JSON*`** format
2. gRPC ⇒ Uses **`*Protobuf*`** format

---

## ⭐ ***JSON - RPC***

- JSON-RPC is a light-weight RPC protocol that uses JSON.
- It uses → HTTP/WebSocket under the hood

Client Send :

```json
{
  "jsonrpc": "2.0",
  "method": "getUser",
  "params": {
    "id": 10
  },
  "id": 1
}
```

Server Response :

```json
{
  "jsonrpc": "2.0",
  "result": {
    "id": 10,
    "name": "John"
  },
  "id": 1
}
```

### Anatomy of JSON-RPC :

- **`jsonrpc`**  → Protocol Version
- **`methods`**  → Function name to be called on server.
- **`params`**   → Function arguments
- **`id`**       → used for Request Tracking
- **`result`**   → Success Response
- **`error`**    → Failure Response

---

***Pros*** :

- Easy to understand
- Human-readable
- Simple
- Works Everywhere

***Cons*** :

- Large Payloads      → As Json is verbose
- Slow Serialization
- Weak Typing         → No Strict Schema
- Poor Performance    → Text-based format
- No Streaming        → Harder real-time communication

## ⭐ ***gRPC***

gRPC is a modern high-performance RPC framework.

### ***Key Ides of gRPC ➖***

- Instead of using
    - ***JSON***
    - ***Text protocol***
- It uses
    - ***Protocol Buffers*** (binary format)
    - ***HTTP/2*** → support multiplexing
    
    This makes it :
    
    - Smaller
    - Faster
    - more efficient

---

### ***What are Protocol Buffer ?***

- Also call `Protobuf` → It is a Compact binary serialization format.
- Example :
    - JSON - (text based)
    
    ```json
    {
      "id": 10,
      "name": "John"
    }
    ```
    
    - Protobuf - (binary encoded)
    
    ```json
    101001011001010...
    ```
    

---

### ***gRPC uses*** `.proto` ***file*** ➖

- You define service that should be exposes or called in a schema file

```protobuf
syntax = "proto3";

service UserService {
  rpc GetUser(GetUserRequest)
      returns (UserResponse);
}

message GetUserRequest {
  int32 id = 1;
}

message UserResponse {
  int32 id = 1;
  string name = 2;
}
```

- The Contract : The `.proto` file is a handshake agreement between two services.
- Both Caller (client) and the Provider (server) must have it.
- Best Practice is to keep them in one central folder both service can access.

---

### ***gRPC Streaming ➖***

- One Major Reason Company love gRPC ➖ Streaming

| ***Type*** | ***Client Sends*** | ***Server Sends*** |
| --- | --- | --- |
| ***Unary*** | One request | One response |
| ***Server Streaming*** | One request | Multiple responses |
| ***Client Streaming*** | Multiple requests | One response |
| ***Bidirectional Streaming*** | Multiple requests | Multiple responses |
1. ***Unary RPC*** ➖
    - Normal Request - Response like REST
2. ***Server Streaming*** ➖
    - Client send one request
    - Server Send Many Responses.
    - Example :
        - you ask
            
            ```protobuf
            "Show me live comments"
            ```
            
        - Server continuously send :
            
            ```protobuf
            Comment 1
            Comment 2
            Comment 3
            Comment 4
            ...
            ```
            
    
    Flow ➖
    
    ```protobuf
    Client  --->  Server
            One Request
    
    Client  <---  Server
            Response 1
            Response 2
            Response 3
    ```
    
3. ***Client Streaming*** ➖
    - Client Upload Stream of data.
    - Server send final response
        
        ```protobuf
        Client  --->  Server
                Chunk 1
                Chunk 2
                Chunk 3
        
        Client  <---  Server
                Final Response
        ```
        
4. ***Bi-directional Streaming*** ➖
    
    
    ```protobuf
    Client  --->  Server
            Message 1
    
    Client  <---  Server
            Message A
    
    Client  --->  Server
            Message 2
    
    Client  <---  Server
            Message B
    ```
    

---

| ***Feature*** | ***REST*** | ***JSON-RPC*** | ***gRPC*** |
| --- | --- | --- | --- |
| ***Style*** | Resource-based | Function-based | Function-based |
| ***Data*** | JSON | JSON | Protobuf |
| ***Human readable*** | Yes | Yes | No |
| ***Performance*** | Medium | Medium | High |
| ***Streaming*** | Weak | Limited | Excellent |
| ***Browser friendly*** | Excellent | Good | Moderate |
| ***Strong typing*** | Weak | Weak | Strong |
| ***Best for*** | Public APIs | Lightweight RPC | Microservices |

---

### ***What is a Client Stub in gRPC?***

- A stub is local object representing remote service. It is used to call the remote service.
- Think of `Client Stub` as a **ready-made remote control** for your server.

---

### ***Real-life analogy:***

You have a TV (the **`gRPC Server`**).

Instead of manually writing all the wires, buttons, and signals to control the TV, the manufacturer gives you a **remote control** (the Client Stub).

You just press buttons like:

- **`getAllUsers()`**
- **`createUser()`**

And it automatically talks to the server correctly.

---

### ***Thing to keep in mind :***

- Protocol buffer optimises the response that is send, so if we have below code
    
    ```jsx
    callback(null, { user: [] })
    ```
    
- Now when gRPC client Stub receive it will receive `{}`  , like server send ,
    
    ```jsx
    callback(null, {})
    ```
    
    Because it treats empty value, empty string , 0 as default value and omit it.
    
- To forcefully make it pass,
    
    ```jsx
    const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../../proto/user.proto"), {
      defaults: true, // force the default value for fileds to appear.
    });
    ```