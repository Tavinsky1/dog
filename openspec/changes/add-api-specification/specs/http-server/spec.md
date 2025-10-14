# HTTP Server API Specification

## ADDED Requirements

### Requirement: Places API Endpoints
The DogAtlas API SHALL provide RESTful endpoints for managing dog-friendly places.

#### Scenario: List Places
- **WHEN** a client requests places via GET /api/places
- **AND** the request includes optional query parameters (city, category, limit, offset)
- **THEN** the API returns a paginated list of places matching the filters
- **AND** the response includes place details, ratings, and review counts

#### Scenario: Get Place Details
- **WHEN** a client requests a specific place via GET /api/places/{id}
- **AND** the place exists
- **THEN** the API returns complete place information including location, contact details, and reviews

#### Scenario: Create Place (Admin)
- **WHEN** an authenticated admin user submits a POST /api/places request with place data
- **THEN** the API creates a new place record
- **AND** returns the created place with generated ID

#### Scenario: Update Place (Admin)
- **WHEN** an authenticated admin user submits a PUT /api/places/{id} request with updated data
- **THEN** the API updates the place record
- **AND** returns the updated place information

### Requirement: Reviews API Endpoints
The DogAtlas API SHALL provide endpoints for managing user reviews of places.

#### Scenario: List Reviews
- **WHEN** a client requests reviews via GET /api/reviews
- **AND** the request includes optional filters (placeId, userId, pagination)
- **THEN** the API returns a paginated list of reviews with user information

#### Scenario: Create Review
- **WHEN** an authenticated user submits a POST /api/reviews request with rating and optional comment
- **THEN** the API creates a new review linked to the user and place
- **AND** updates the place's average rating

### Requirement: Authentication API Endpoints
The DogAtlas API SHALL provide authentication endpoints using NextAuth.js.

#### Scenario: User Sign In
- **WHEN** a user provides valid credentials
- **AND** submits a POST /api/auth/signin request
- **THEN** the API authenticates the user
- **AND** returns a JWT token and user information

#### Scenario: Get Session
- **WHEN** an authenticated user requests GET /api/auth/session
- **THEN** the API returns current session information including user details

#### Scenario: User Sign Out
- **WHEN** an authenticated user submits a POST /api/auth/signout request
- **THEN** the API invalidates their session
- **AND** clears authentication tokens

### Requirement: User Profile Endpoints
The DogAtlas API SHALL provide endpoints for user profile management.

#### Scenario: Get Current User Profile
- **WHEN** an authenticated user requests GET /api/me
- **THEN** the API returns their profile information including favorites and review history

### Requirement: Cities API Endpoints
The DogAtlas API SHALL provide endpoints for city information.

#### Scenario: List Supported Cities
- **WHEN** a client requests GET /api/cities
- **AND** no filters are applied
- **THEN** the API returns all supported cities with place counts

### Requirement: Admin API Endpoints
The DogAtlas API SHALL provide administrative endpoints for content management.

#### Scenario: Admin Dashboard Data
- **WHEN** an authenticated admin user requests GET /api/admin/dashboard
- **THEN** the API returns aggregated statistics and recent activity

#### Scenario: Manage Users (Admin)
- **WHEN** an authenticated admin user submits requests to POST/PUT/DELETE /api/admin/users
- **THEN** the API performs the requested user management operations

### Requirement: Upload API Endpoints
The DogAtlas API SHALL provide endpoints for file uploads.

#### Scenario: Upload Place Photo
- **WHEN** an authenticated admin user submits a POST /api/upload/photo request with image file
- **THEN** the API stores the image
- **AND** returns the public URL for the uploaded image

### Requirement: Error Handling
The API SHALL provide consistent error responses across all endpoints.

#### Scenario: Authentication Required
- **WHEN** an unauthenticated request is made to a protected endpoint
- **AND** the request lacks valid credentials
- **THEN** the API returns 401 Unauthorized with error details

#### Scenario: Insufficient Permissions
- **WHEN** an authenticated user without required permissions attempts an admin-only operation
- **THEN** the API returns 403 Forbidden with error details

#### Scenario: Resource Not Found
- **WHEN** a request is made for a non-existent resource
- **AND** the ID or path is invalid
- **THEN** the API returns 404 Not Found with error details

#### Scenario: Validation Error
- **WHEN** a request with invalid data is submitted
- **AND** required fields are missing or malformed
- **THEN** the API returns 400 Bad Request with validation error details

### Requirement: Response Schemas
The API SHALL use consistent JSON schemas for all responses.

#### Scenario: Places Response Schema
- **WHEN** any places endpoint returns data
- **THEN** it follows the defined Place schema with all required fields

#### Scenario: Reviews Response Schema
- **WHEN** any reviews endpoint returns data
- **THEN** it follows the defined Review schema with user information

#### Scenario: User Response Schema
- **WHEN** any user-related endpoint returns data
- **THEN** it follows the defined User schema with role information

### Requirement: Pagination
The API SHALL implement consistent pagination across list endpoints.

#### Scenario: Paginated Responses
- **WHEN** a list endpoint with multiple results is requested
- **AND** limit and offset parameters are provided
- **THEN** the response includes total count, current page data, and pagination metadata

### Requirement: Rate Limiting
The API SHALL implement rate limiting to prevent abuse.

#### Scenario: Rate Limit Enforcement
- **WHEN** repeated requests from the same client exceed rate limits
- **THEN** the API returns 429 Too Many Requests with retry information