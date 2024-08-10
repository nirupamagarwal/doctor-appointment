### Backend Functionalities: Authentication Endpoints

### Authentication Endpoints

#### 1. Phone Number Authentication
**Endpoint:** `POST https://hint-bharat-backend.vercel.app/api/user/authenticate`

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "764343794309",
    "authProvider": "phone"
}
```

**Response:**
```json
{
    "user": {
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "764343794309",
        "authProvider": "phone",
        "_id": "66b27ab413baf927387e34b1",
        "createdAt": "2024-08-06T19:34:12.724Z",
        "updatedAt": "2024-08-06T19:34:12.724Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjI3YWI0MTNiYWY5MjczODdlMzRiMSIsImlhdCI6MTcyMjk3Mjg1Mn0.yzvQZlw5-qTLWYLI9ARVPdLRFDIMYmNJc7JY5wFkQWM"
}
```

#### 2. Facebook Authentication
**Endpoint:** `POST https://hint-bharat-backend.vercel.app/api/user/authenticate`

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "facebookId": "ghdshdgsghdsgdgui",
    "authProvider": "facebook"
}
```

**Response:**
```json
{
    "user": {
        "facebookId": "ghdshdgsghdsgdgui",
        "firstName": "John",
        "lastName": "Doe",
        "authProvider": "facebook",
        "_id": "66b27b4213baf927387e34b4",
        "createdAt": "2024-08-06T19:36:34.330Z",
        "updatedAt": "2024-08-06T19:36:34.330Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjI3YjQyMTNiYWY5MjczODdlMzRiNCIsImlhdCI6MTcyMjk3Mjk5NH0.Yhfy3kcRb6xZEDQFE8eVTX7uamDKb9PFpj2r6iluK70"
}
```

#### 3. Google Authentication
**Endpoint:** `POST https://hint-bharat-backend.vercel.app/api/user/authenticate`

**Request Body:**
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "xyz@gmail.com",
    "authProvider": "google"
}
```

**Response:**
```json
{
    "user": {
        "email": "xyz@gmail.com",
        "firstName": "John",
        "lastName": "Doe",
        "authProvider": "google",
        "_id": "66b27b9313baf927387e34b7",
        "createdAt": "2024-08-06T19:37:55.395Z",
        "updatedAt": "2024-08-06T19:37:55.395Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjI3YjkzMTNiYWY5MjczODdlMzRiNyIsImlhdCI6MTcyMjk3MzA3NX0.ZGl6AhWd30X3icAnZC5h_DWYyRQRiXKPjgVXrQ3vNlM"
}
```

### Fetching User Information
**Endpoint:** `POST https://hint-bharat-backend.vercel.app/api/user/profile`

**Request:**
```javascript
const response = await fetch(`https://hint-bharat-backend.vercel.app/api/user/profile`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
});
```
**Response:**
```json
{
	"_id": "66b27c2f13baf927387e34bc",
	"email": "xyza@gmail.com",
	"firstName": "John",
	"lastName": "Doe",
	"authProvider": "google",
	"createdAt": "2024-08-06T19:40:31.692Z",
	"updatedAt": "2024-08-06T19:40:31.692Z",
	"__v": 0
}
```
### Error Format
If anything goes wrong, the error format will be:
```json
{
    "success": false,
    "statusCode": 500,
    "message": "user validation failed: email: Path `email` is required."
}
```

This breakdown provides the necessary information for implementing the frontend interactions with the backend authentication endpoints.
