# CSV Contract v0.7

## Header (Exact Order)

```
id,name,type,city,region,country,latitude,longitude,short_description,full_description,image_url,gallery_urls,dog_friendly_level,amenities,rules,website_url,contact_phone,contact_email,price_range,opening_hours,rating,tags
```

## Constraints

- **type**: Enum values: `trail`, `park`, `cafe`, `vet`, `grooming`, `activity`, `beach`, `hotel`, `store`, `event`
- **gallery_urls**: Semicolon (`;`) separated values
- **amenities**: Comma (`,`) separated values
- **tags**: Comma (`,`) separated values
- **rating**: Float value between 0 and 5
- **dog_friendly_level**: Integer value between 1 and 5
- **All strings**: Trimmed; empty strings convert to `null` (except for required fields)
- **id**: If empty, generate deterministically using UUIDv5 of `name|city|country|lat|lng`

## Validation Errors

Return validation errors with:
- Row number
- Field name
- Reason for the error