# CommunityKnowledge API Documentation
## auth
[Back to overview](README.md)

### Token Create
**[POST]** /api/auth/token/create

#### Parameters
| Name | Type | Required | Description |
| --- | --- | --- | --- |
| username | string | &check; |  |
| password | string | &check; |  |
#### Returns
| Name | Type | Description |
| --- | --- | --- |
| token | string | JWT token for further authentification |
| user | User | User object of authenticated user |

### Token Verify
**[POST]** /api/auth/token/verify

#### Parameters
| Name | Type | Required | Description |
| --- | --- | --- | --- |
| token | string | &check; | The JWT token |
#### Returns
| Name | Type | Description |
| --- | --- | --- |
| user | User | User object of authenticated user |

### Me
**[GET]** /api/auth/me

**AUTH REQUIRED** This api call needs authentification. Generate a token via /auth/token/create and send it via the Authorization header.

#### Returns
| Name | Type | Description |
| --- | --- | --- |
| user | User | User object of authenticated user |
