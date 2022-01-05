## API Documentation

Request : 
```http
POST /
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `username` | `string` | **Required**
| `password` | `string` | **Required**

**Successful Response:**
```json
{
   "result"  : bool,
   "user_id" : string,
   "token"   : string
}
```

Request : 
```http
POST /isAccessTokenValid
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `access_token` | `string` | **Required**

**Successful Response:**
```json
{
   "access_token" : string,
}
```
