# Homework Assignment #2

This is the second of several homework assignments you'll receive in this course. In order to receive your certificate of completion (at the end of this course) you must complete all the assignments and receive a passing grade. 

### How to Turn It In:

1. Create a public github repo for this assignment. 

2. Create a new post in the Facebook Group  and note "Homework Assignment #2" at the top.

3. In that thread, discuss what you have built, and include the link to your Github repo. 

### The Assignment (Scenario):

You are building the API for a pizza-delivery company. Don't worry about a frontend, just build the API. Here's the spec from your project manager: 

1. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.

2. Users can log in and log out by creating or destroying a token.

3. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system). 

4. A logged-in user should be able to fill a shopping cart with menu items

5. A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment. Note: Use the stripe sandbox for your testing. Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards

6. When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account

### Important Note: 
If you use external libraries (NPM) to integrate with Stripe or Mailgun, you will not pass this assignment. You must write your API calls from scratch. Look up the "Curl" documentation for both APIs so you can figure out how to craft your API calls. 

This is an open-ended assignment. You may take any direction you'd like to go with it, as long as your project includes the requirements. It can include anything else you wish as well. 

And please: Don't forget to document how a client should interact with the API you create!


# API Documentation:

## User APIs:

Use authentication token in header before accessing users APIs

#### 1. Add New User
POST http://localhost:3000/users
```
{
  "fullName": "John J",
  "email": "abc@gmail.com",
  "address": "abc road",
  "password": "abc"
}
```

#### 2. Get User by email
GET http://localhost:3000/users?email=abc@gmail.com

#### 3. update user 
PUT http://localhost:3000/users
```
{
  "fullName": "John Jaccob",
  "email": "abc@gmail.com"
}
```

#### 4. delete user
DELETE http://localhost:3000/users?email=abc@gmail.com


## Token APIs:
#### 1. Create new token
POST http://localhost:3000/tokens
```
{
  "email": "abc@gmail.com",
  "password": "abc"
}
```

#### 2. Get token by id
GET http://localhost:3000/tokens?id=w6hmts7okwqkt46m3k7l

#### 3. update token 
PUT http://localhost:3000/users
```
{
  "id": "w6hmts7okwqkt46m3k7l",
  "extend": true
}
```

#### 4. delete token
DELETE http://localhost:3000/tokens?id=w6hmts7okwqkt46m3k7l


## Menu Card

#### 1. Get Menu Card
GET http://localhost:3000/menu?email=abc@gmail.com

Response:
```
[
    {
        "id": "item1",
        "name": "Farm House",
        "description": "A pizza that goes ballistic on veggies!",
        "type": "VEG",
        "price": "350"
    },
    {
        "id": "item2",
        "name": "Peppy Paneer",
        "description": "Chunky paneer with crisp capsicum and spicy red pepper",
        "type": "VEG",
        "price": "450"
    },
    {
        "id": "item3",
        "name": "CHICKEN TIKKA",
        "description": "Chicken Tikka I Onion on Makhani Sauce",
        "type": "NON VEG",
        "price": "500"
    },
    {
        "id": "item4",
        "name": "Non Veg Supreme",
        "description": "Bite into supreme delight of Black Olives, Onions, Grilled Mushrooms",
        "type": "NON VEG",
        "price": "550"
    }
]
```

## Shopping cart APIs

#### 1. Add menu items to cart
POST/PUT http://localhost:3000/cart
```
{   
    "email": "abc@gmail.com",
    "menuitem": {
            "id": "item1",
            "quantity": 1
        }
}
```

#### 1. Get menu items from cart
GET http://localhost:3000/cart?email=abc@gmail.com
```
[
    {
        "id": "item1",
        "name": "Farm House",
        "description": "A pizza that goes ballistic on veggies!",
        "type": "VEG",
        "price": "350",
        "quantity": 2
    }
]
```

#### 1. Remove menu item from cart
DELETE http://localhost:3000/cart
```
{   
    "email": "abc@gmail.com",
    "menuitem": {
            "id": "item1",
            "qauntity": 1
        }
}
```
