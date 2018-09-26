# Users

All objects are owned by a user.

## Properties

| Property | Data Type | Required | Set By | Description |
| -------- | --------- | -------- | ------ | ----------- |
| `userId` | String | yes | server | A unique id for each user | 
| `username` | String | yes | user | A unique identifier for each user. It is used for login. |
| `firstName` | String | yes | user | A non unique first name for the user |
| `lastName` | String | yes | user | A non unique last name for the user |
| `email` | String | yes | user | The email address |
| `password` | String | yes | user | An encrypted password |
| `role` | String | no | user/server | The role of the user. Default is `user`. Another role is `admin` |


### Login

`POST` /users/login

> Note: This request does not need an authorization token

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `username` | yes | The username |
| `password` | yes | The plain text password |

#### Response

200 OK
````json
{
	"err":0,
	"token":"a token used for requests that require the authorization token",
	"role": "role of user"
}
````

### Logout

`GET` /users/logout

#### Response

200 OK
````json
{
	"err":0,
}
````


### User Info
This route returns information on the user linked to the bearer token provided in the request 
a.k.a the logged in user. 

`GET` /users/info

#### Response

200 OK
````json
{
	"err":0,
	"user": {
		"userId":"the user id",
		"username":"the username",
		"firstName":"the first name of the user",
		"lastName": "the last name of the user",
		"email":"the user email",
		"role": "the role of the user",
		"createdAt": "the date at which the user was created"
	}
}
````

### Edit User

`POST` /users/edit

Edit the information of the user who provided the authentication token

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `firstName` | no | The new first name |
| `lastName` | no | The new last name |
| `email` | no | The new email |

#### Response

200 OK
````json
{
	"err":0,
}
````

### Change password

`POST` /users/password/edit

The new password needs to be different than the old password
#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `oldPassword` | yes | The plain text old password |
| `newPassword` | yes | The plain text new password |

#### Response

200 OK
````json
{
	"err":0,
}
````

### Connect

`POST` /users/connect

Assign a board to the user for a course. The user must be enrolled to the course. The board must not be assigned to another user or another course.

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `boardId` | yes | The id of the board|
| `courseId` | yes | The id of the course |

#### Response

200 OK
````json
{
	"err":0,
}
````


### Disconnect

`POST` /users/disconnect

Free the board that the user used for the course

#### Response

200 OK
````json
{
	"err":0,
}
````

### Update user

`POST` /users/update

> Note: Only an administrator can access this route

Update the information for the user. userId cannot be updated

#### Parameters

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `userId` | yes | The id of the user that will be updated|
| `username` | no | The new username for the user |
| `email` | no | The new email address |
| `password` | no | The new password for the user |
| `firstName` | no | The new first name for the user |
| `lastName` | no | The new last name for the user |
| `role` | no | The new role for the user |


#### Response

200 OK
````json
{
	"err":0,
}
````

### List

`GET` /users/list

List all the users from the database

> Note: Only an administrator can access this route

#### Response

200 OK
````json
{
	"err":0,
	"users": [
		{
			"userId":"the user1 id",
			"username":"the username for user1",
			"firstName":"the user1 first name",
			"lastName":"the user1 last name",
			"email":"the user1 email",
			"role": "the role of user1",
			"createdAt": "the date at which user1 was created"
		},
		{
			"userId":"the user2 id",
			"username":"the username for user2",
			"firstName":"the user2 first name",
			"lastName":"the user2 last name",
			"email":"the user2 email",
			"role": "the role of user2",
			"createdAt": "the date at which user2 was created"
		}
		......
	]
}
````

### Get User

`GET` /users/get/:userId

Find a user based on the userId

> Note: Only an administrator can access this route


#### Response 
200 OK
````json
{
	"err": 0,
	"user": {
			"userId":"the user id",
			"username":"the username for user",
			"firstName":"the user first name",
			"lastName":"the user last name",
			"email":"the user email",
			"role": "the role of the user",
			"createdAt": "the date at which the user was created"
	}
}
````

### Create a user
`POST` /users/create

Create a new user

> Note: Only an administrator can access this route

#### Parameters
| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `username` | yes | The username for the user |
| `email` | yes | The email address for the user |
| `password` | yes | The password for the user |
| `firstName` | yes | The first name for the user |
| `lastName` | yes | The last name for the user |
| `role` | no | The role for the user |

#### Response 
200 OK
````json
{
	"err": 0,
	"user": {
			"userId":"the user id",
			"username":"the username for user",
			"firstName":"the user first name",
			"lastName":"the user last name",
			"email":"the user email",
			"role": "the role of the user",
			"createdAt": "the date at which the user was created"
	}
}
````

### Delete a user
`POST` /users/delete

Delete a user

> Note: Only an administrator can access this route

#### Parameters
| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `userId` | yes | The userId for the user to be deleted |

#### Response 
200 OK
````json
{
	"err": 0
}
````