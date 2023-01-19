# CommunityKnowledge API Documentation
## page
[Back to overview](README.md)

### Get Page
**[GET]** /api/page/:slug

#### Returns
| Name | Type | Description |
| --- | --- | --- |
| slug | string |  |
| title | string |  |
| content | json |  |
| createdAt | datetime |  |
| updatedAt | datetime |  |

### Create Page
**[POST]** /api/page/:slug

**AUTH REQUIRED** This api call needs authentification. Generate a token via /auth/token/create and send it via the Authorization header.

#### Parameters
| Name | Type | Required | Description |
| --- | --- | --- | --- |
| title | string | &check; |  |
| content | json | &cross; | A json array of page blocks |
#### Returns
| Name | Type | Description |
| --- | --- | --- |
| slug | string |  |
| title | string |  |
| content | json |  |
| createdAt | datetime |  |
| updatedAt | datetime |  |

### Update Page
**[PUT]** /api/page/:slug

**AUTH REQUIRED** This api call needs authentification. Generate a token via /auth/token/create and send it via the Authorization header.

#### Parameters
| Name | Type | Required | Description |
| --- | --- | --- | --- |
| title | string | &cross; | The new title of the page |
| slug | string | &cross; | The new url slug of the page |
| content | json | &cross; | A json array of page blocks |
#### Returns
| Name | Type | Description |
| --- | --- | --- |
| slug | string |  |
| title | string |  |
| content | json |  |
| createdAt | datetime |  |
| updatedAt | datetime |  |
