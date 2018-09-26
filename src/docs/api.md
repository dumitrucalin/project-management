## API

All links are prefixed with `/api/v1`. All data is passed as JSON.

The examples have all the possible parameters. Some are optional, please look at the parameters table.

All requests, except the ones that say otherwise, have to provide the following headers:

| Header | Required | Format | Description |
| ------ | -------- | ------ |-------------| 
| `authorization` | yes | Bearer `token` | The token received from login |

Some requests can only be made by a user with `admin` role

All requests return errors in the following format:



4xx/500 Error
````json
{
	"statusError": "type of error",
	"err":"error text"
}
````