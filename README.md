#Resource Name: Fish
## Resource Attributes
 * Name
 * Width
 * Height
 * X-Position (Left)
 * Y-Position (top)
 * Color
 
## Database Schema
```
CREATE TABLE fish (
	id INTEGER PRIMARY KEY,
	name VARCHAR(64) NOT NULL,
	width INTEGER,
	height INTEGER,
	left INTEGER,
	top INTEGER,
	color VARCHAR(64) NOT NULL
);
```

## REST Endpoints

Name | Path | HTTP Method
---- | ---- | ---- |
Get All | /fish | GET
Get One | /fish/ID# | GET
Create | /fish | POST
Replace/Update | /fish/ID# | PUT
Delete | /fish/ID# | DELETE
