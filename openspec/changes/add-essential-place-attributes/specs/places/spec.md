# Places Capability - Delta Spec

## ADDED Requirements

### Requirement: Dog Size Filtering
The system SHALL allow users to filter places by the size of dogs allowed.

#### Scenario: User filters for large dog friendly places
- **GIVEN** a user is viewing a city's places
- **WHEN** the user selects "Large dogs OK" filter
- **THEN** only places with `dogSizeAllowed` = `all` or `large_ok` are displayed

#### Scenario: User filters for small dogs only
- **GIVEN** a user is viewing a city's places  
- **WHEN** the user selects "Small dogs" filter
- **THEN** places with `dogSizeAllowed` = `small_only`, `small_medium`, or `all` are displayed

---

### Requirement: Water Bowl Indicator
The system SHALL display whether a place provides water bowls for dogs.

#### Scenario: Place with water bowl shows indicator
- **GIVEN** a place has `hasWaterBowl` = true
- **WHEN** the place is displayed in a list or detail view
- **THEN** a water bowl icon/badge is visible

#### Scenario: Place without water data shows no indicator
- **GIVEN** a place has `hasWaterBowl` = null
- **WHEN** the place is displayed
- **THEN** no water bowl indicator is shown (graceful degradation)

---

### Requirement: Off-Leash Indicator
The system SHALL indicate whether dogs can be off-leash at a place.

#### Scenario: Off-leash place shows badge
- **GIVEN** a place has `offLeashAllowed` = true
- **WHEN** the place is displayed
- **THEN** an "Off-leash OK" badge is visible

#### Scenario: Filter by off-leash places
- **GIVEN** a user wants to find off-leash areas
- **WHEN** the user enables the "Off-leash" filter
- **THEN** only places with `offLeashAllowed` = true are displayed

---

### Requirement: Outdoor Seating Indicator
The system SHALL indicate whether cafes/restaurants have outdoor seating (relevant for dog-friendliness).

#### Scenario: Restaurant with outdoor seating shows indicator
- **GIVEN** a cafe/restaurant has `hasOutdoorSeating` = true
- **WHEN** the place is displayed
- **THEN** an outdoor seating icon is visible

---

### Requirement: Pet Fee Display
The system SHALL display pet fee information when available.

#### Scenario: Accommodation with pet fee
- **GIVEN** a hotel has `petFee` = "€15/night"
- **WHEN** viewing the place detail page
- **THEN** the pet fee is displayed in the details section

#### Scenario: Place with no fee information
- **GIVEN** a place has `petFee` = null
- **WHEN** viewing the place detail page
- **THEN** no fee information is shown (not "Unknown")

---

### Requirement: Maximum Dogs Allowed
The system SHALL display the maximum number of dogs allowed when specified.

#### Scenario: Place with dog limit
- **GIVEN** a hotel has `maxDogsAllowed` = 2
- **WHEN** viewing the place detail page
- **THEN** "Max 2 dogs" is displayed

---

## Data Model

### DogSizeAllowed Enum
```
all           - All dog sizes welcome
small_only    - Small dogs only (typically < 10kg)
small_medium  - Small and medium dogs (typically < 25kg)
large_ok      - Large dogs explicitly welcome
```

### Place Model Additions
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| dogSizeAllowed | DogSizeAllowed? | null | Size restrictions |
| hasWaterBowl | Boolean? | null | Water provided |
| offLeashAllowed | Boolean? | null | Off-leash permitted |
| hasOutdoorSeating | Boolean? | null | Outdoor/patio area |
| petFee | String? | null | Fee description |
| maxDogsAllowed | Int? | null | Max dogs permitted |
