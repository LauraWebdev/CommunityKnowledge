# CommunityKnowledge API Documentation
## user
[Back to overview](README.md)

### Get User
**[GET]** /api/user/:username

#### Returns
| Name | Type | Description |
| --- | --- | --- |
| username | string |  |
| createdAt | datetime |  |
| updatedAt | datetime |  |

### Create User
**[POST]** /api/user/:username

**AUTH REQUIRED** This api call needs authentification. Generate a token via /auth/token/create and send it via the Authorization header.

#### Parameters
| Name | Type | Required | Default |
| --- | --- | --- | --- |
| username | string | --- | --- |
| password | string | --- | --- |
#### Returns
| Name | Type | Description |
| --- | --- | --- |
| username | string |  |
| createdAt | datetime |  |
| updatedAt | datetime |  |

### Update User
**[PUT]** /api/user/:username

**AUTH REQUIRED** This api call needs authentification. Generate a token via /auth/token/create and send it via the Authorization header.

#### Parameters
| Name | Type | Required | Default |
| --- | --- | --- | --- |
| username | string | --- | --- |
| password | string | --- | --- |
#### Returns
| Name | Type | Description |
| --- | --- | --- |
| username | string |  |
| createdAt | datetime |  |
| updatedAt | datetime |  |
