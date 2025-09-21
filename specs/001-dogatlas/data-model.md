# Domain Model

## City

- **id** (uuid)
- **slug** (unique)
- **name**
- **region?**
- **country**
- **lat**
- **lng**
- **bbox?**
- **active**
- **places[]** (references to Place entities)

## Place

- **id** (uuid)
- **slug** (unique)
- **name**
- **type** (enum)
- **cityId** → City (foreign key reference)
- **region?**
- **country**
- **lat**
- **lng**
- **shortDescription**
- **fullDescription?**
- **imageUrl?**
- **gallery[]**
- **dogFriendlyLevel?**
- **amenities[]**
- **rules?**
- **websiteUrl?**
- **phone?**
- **email?**
- **priceRange?**
- **openingHours?**
- **rating?**
- **tags[]**
- **source?**
- **createdAt**
- **updatedAt**

## User

- **id**
- **name?**
- **email** (unique?)
- **emailVerified?**
- **image?**
- **role**
- **passwordHash?**
- **accounts[]**
- **sessions[]**
- **favorites[]**

## Favorite

- **id**
- **userId** → User (foreign key reference)
- **placeId** → Place (foreign key reference)
- **unique(userId, placeId)** (composite unique constraint)

## Indices

- **Place(cityId)**
- **Place(type)**
- **Place(slug unique)**
- **City(slug unique)**