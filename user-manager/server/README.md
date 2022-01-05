## API Documentation

Request : 
```http
GET /listuser
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `access_token` | `string` | **Required**

**Successful Response:**
```json
{
   "result"  : array,
}
```

Request : 
```http
GET /user/${id}
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `access_token` | `string` | **Required**
| `id` | `parameter` | **Required**


**Successful Response:**
```json
{
    "status" : string,
    "data"   : object,
}
```


Request : 
```http
POST /createuser
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `access_token` | `string` | **Required**
| `username` | `string` | **Required**
| `user_name` | `string` | **Required**
| `user_surname` | `string` | **Required**
| `user_email` | `string` | **Required**
| `user_password` | `string` | **Required**
| `user_type` | `string` | **Required**

**Successful Response:**
```json
{
    "status" : string,
}
```


Request : 
```http
PUT /updateuser/${id}
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `access_token` | `string` | **Required**
| `id` | `parameter` | **Required**
| `username` | `string` | **Required**
| `user_name` | `string` | **Required**
| `user_surname` | `string` | **Required**
| `user_email` | `string` | **Required**
| `user_type` | `string` | **Required**


**Successful Response:**
```json
{
   "status"  : string,
}
```

Request : 
```http
GET /deleteuser/${id}
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `access_token` | `string` | **Required**
| `id` | `parameter` | **Required**


**Successful Response:**
```json
{
   "status"  : string,
}
```