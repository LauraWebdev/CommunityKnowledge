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
| Name | Type | Required | Default |
| --- | --- | --- | --- |
| title | string | --- | --- |
| body | json | --- | --- |
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
| Name | Type | Required | Default |
| --- | --- | --- | --- |
| title | string | --- | --- |
| slug | string | --- | --- |
| body | json | --- | --- |
#### Returns
| Name | Type | Description |
| --- | --- | --- |
| slug | string |  |
| title | string |  |
| content | json |  |
| createdAt | datetime |  |
| updatedAt | datetime |  |
