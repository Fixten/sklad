# Sklad — Technical Architecture

## 1. Purpose

This document defines the high-level technical architecture of Sklad and provides the foundation for detailed technical planning of individual application modules.

It defines:

- system components and their responsibilities
- application and module boundaries
- communication between frontend and backend
- high-level domain/data concepts
- persistence approach
- configuration and deployment
- data integrity and backup strategy
- architectural principles and decisions

Detailed database schemas, API endpoints, UI implementation, and individual module designs are defined separately.

---

## 2. System Overview

Sklad is a single-business web application designed to run on a private home server within a local network.

The system consists of:

- React frontend SPA
- Node.js backend REST API
- SQLite database

Production runs using Docker Compose, with frontend and backend running in separate containers.

```text
                    Local Network
                         │
                         ▼
              ┌─────────────────────┐
              │     Web Browser     │
              │ React + Vite + TS   │
              └──────────┬──────────┘
                         │ HTTP
                         ▼
              ┌─────────────────────┐
              │     Backend API     │
              │ Node.js             │
              │ Express + TS        │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │       SQLite        │
              │       Drizzle       │
              └─────────────────────┘
```

The system is intentionally simple and does not currently require:

- authentication
- user accounts
- roles/permissions
- public internet access
- distributed services
- external application integrations

The architecture should nevertheless avoid decisions that would make these capabilities unnecessarily difficult to introduce later.

---

## 3. Technology Stack

| Area | Technology |
|---|---|
| Language | TypeScript |
| Runtime | Node.js |
| Package management | pnpm |
| Repository | pnpm monorepo |
| Backend | Express |
| Backend API | REST |
| Frontend | React |
| Frontend build | Vite |
| Frontend UI | shadcn/ui |
| Database | SQLite |
| Database access | Drizzle |
| Production | Docker |
| Service orchestration | Docker Compose |

Environment variables are sufficient for application and infrastructure configuration at the current stage.

No dedicated configuration service or configuration management system is required.

---

## 4. Repository Architecture

The project is maintained as a pnpm monorepo containing separate frontend and backend applications.

Conceptually:

```text
Monorepo
│
├── Backend
│   └── feature-based application
│
└── Frontend
    └── feature-based application
```

Both applications use a feature-based organization.

The exact directory structure is an implementation detail and is intentionally not specified by this architecture document.

The architecture should allow additional shared packages to be introduced when a concrete need appears.

One planned shared concern is **API contracts shared between frontend and backend**.

Shared contracts should describe communication between applications rather than expose backend implementation models directly.

---

## 5. Backend Architecture

The backend is a modular Express application.

Backend features are organized by business capability.

The existing module pattern is:

```text
Feature
├── schema
├── repository
├── service
└── router
```

This pattern should remain the default architecture.

### Router

Responsible for the HTTP/API boundary:

- routes
- HTTP request handling
- request/response mapping
- API-level validation
- HTTP error handling

Routers should remain thin and delegate business operations to services.

### Service

Responsible for application and business operations.

Examples:

- create Supply
- update Supply
- produce Product Item
- consume material
- change Product Item status
- record a sale
- calculate Product Item cost

Services coordinate repositories and other domain/application services when an operation spans multiple entities.

### Repository

Responsible for persistence operations.

Repositories encapsulate database access through Drizzle and should prevent database queries from spreading throughout services and routers.

### Schema

Responsible for data validation and/or API input/output schemas as defined by the existing implementation conventions.

The exact responsibility of `schema` should be kept consistent across modules.

---

## 6. Backend Module Boundaries

The main backend modules should follow business capabilities rather than attempting to mirror every business entity with an independent technical subsystem.

A high-level structure is:

```text
Materials
├── Material Types
├── Materials
├── Material Variants
└── Supplies

Products
├── Product Templates
├── Product Items
├── Production
├── Material Consumption
├── Product Status
└── Sales

Settings
└── Labor Cost
```

These are logical module boundaries, not necessarily one-to-one mappings to database tables.

For example:

- Product Inventory can be derived from Product Items.
- Material Inventory can be derived from Supplies.
- Product cost can be calculated from Product Item data, consumption records, and labor settings.
- Sale information can be part of the Product Item domain rather than requiring an independent `Sale` business entity.

The architecture should prefer calculated/projection data where the underlying data already provides the source of truth.

---

## 7. Domain/Data Model

The technical data model should be based on normalized relational data rather than attempting to persist every business concept as an independent entity.

The business model and database model are therefore intentionally not identical.

### Material domain

Conceptually:

```text
Material Type
      │
      ▼
Material
      │
      ▼
Material Variant
      │
      ▼
Supply
```

Material Types, Materials, and Material Variants represent reusable definitions.

Supplies represent actual purchased stock.

### Product domain

```text
Product Template
      │
      ▼
Product Item
      │
      ├── Material Consumption ──► Supply
      │
      ├── Production Work
      │
      ├── Additional Costs
      │
      └── Status / Sale History
```

A Product Template defines a reusable product configuration.

A Product Item represents an individual physical item and therefore owns its actual production information.

---

## 8. Inventory

Inventory is derived rather than maintained as a separate manually editable quantity.

### Material inventory

Available material is derived from remaining quantities of Supplies belonging to a Material Variant.

```text
Supply 1 remaining
Supply 2 remaining
Supply 3 remaining
        │
        ▼
Material Variant stock
```

There is no independent editable stock quantity for a Material Variant.

### Product inventory

Available product inventory is derived from Product Items whose current status is `In stock`.

Product inventory can therefore group Product Items by Product Template without maintaining a separate product-stock entity.

---

## 9. Material Consumption

Material consumption is a transactional operation between Product Items and Supplies.

Creating or modifying consumption must update the relevant Supply quantities and consumption records atomically.

The user controls which Supplies are selected and their order. The application determines the quantity consumed from each selected Supply.

When consumption changes:

- canceled consumption returns quantity to the corresponding Supply
- increased consumption consumes additional quantity
- insufficient total stock causes the operation to fail
- all affected changes occur within one database transaction

This operation is shared by both initial Product Item creation and later Product Item editing.

---

## 10. Product Item State and History

A Product Item has a current status:

```text
In stock
Sold
Repair
Reserved
```

Status changes are allowed in any direction.

Current status and historical status information are separate concepts.

The system retains a **status history** so that previous states and their associated information are not lost when the Product Item changes state.

For example:

```text
Product Item
│
├── current status
│
└── status history
      ├── In stock
      ├── Reserved
      ├── In stock
      └── Sold
```

This also provides a foundation for future auditing without requiring a separate generic audit system at this stage.

---

## 11. Cost Calculation

Product Item cost is derived from:

```text
Material Cost
     +
Labor Cost
     +
Additional Costs
     =
Product Cost
```

Material cost is derived from Material Consumption records and the applicable Supply purchase cost.

Labor cost is:

```text
Actual Production Hours × Configured Labor Cost
```

Development work is excluded.

### Cost behavior

Cost is dynamic while the Product Item is considered active inventory.

For an `In stock` Product Item, changes to:

- relevant Supply cost
- relevant labor cost

may change the calculated Product Item cost.

Once a Product Item becomes `Sold`, its cost becomes historical and is retained independently of subsequent changes.

If a sold Product Item returns to `In stock`, it becomes subject to normal inventory cost recalculation again.

This behavior should be enforced by the backend/domain layer rather than implemented only in the UI.

---

## 12. Data Integrity

Because inventory and cost are closely related, operations that modify multiple records must use database transactions.

Examples include:

- creating a produced Product Item
- batch production
- editing material consumption
- changing Supply quantities
- deleting/soft-deleting Supplies
- operations that affect historical Product Item cost

A transaction should contain the complete logical operation rather than individual database writes being committed independently.

The database is the source of truth for persisted application state.

---

## 13. Soft Deletion

Supplies use soft deletion.

This is necessary because historical Product Item consumption can reference a Supply even after the Supply is removed from normal active application data.

Conceptually:

```text
Supply
├── active
└── deleted
```

Deleted Supplies:

- are excluded from normal active inventory
- cannot be used for new consumption
- remain available to historical records
- retain information needed for historical cost/consumption

The same approach may be considered for other entities if future requirements introduce similar historical dependencies.

---

## 14. API Architecture

The backend exposes a REST API consumed by the frontend application.

The API is organized around application resources and operations rather than directly exposing database tables.

Simple CRUD resources can use conventional REST operations.

Business operations that involve multiple entities should be represented as explicit application operations where appropriate.

For example, production is conceptually different from simply inserting a Product Item because it may involve:

- selecting a Product Template
- selecting Supplies
- consuming material
- calculating cost
- creating consumption records
- creating Product Items

The API should therefore model such operations around their business meaning rather than forcing every operation into generic CRUD.

API contracts should eventually be shared between frontend and backend through a dedicated shared package.

---

## 15. Frontend Architecture

The frontend is a React SPA built with Vite and TypeScript.

It uses the same feature-oriented organization as the backend.

Frontend features are responsible for:

- pages and workflows
- feature-specific UI
- forms
- API interaction
- client-side state
- presentation and user feedback

Shared UI primitives are provided by shadcn/ui.

The frontend should not be treated as the source of truth for business rules.

Client-side validation improves usability, but all important business rules must be validated and enforced by the backend.

---

## 16. Configuration

Application configuration is provided through environment variables.

Configuration is intentionally kept simple.

Expected configuration includes items such as:

- database location
- backend port
- frontend/backend runtime configuration
- application timezone

The configured labor cost is **not infrastructure configuration**. It is business data and therefore belongs in the database.

The application uses a single configured timezone.

---

## 17. Deployment

Production runs on a home server within the local network.

Docker Compose coordinates the application services:

```text
Docker Compose
│
├── Frontend container
│
└── Backend container
       │
       └── SQLite database
```

The application is not intended to be publicly accessible.

Authentication is therefore outside the current implementation scope.

The architecture should nevertheless keep the API/application boundary clean enough that authentication can be added later without redesigning the domain modules.

---

## 18. Database and Data Safety

SQLite is the persistent application database and is stored on the host/server rather than committed to source control.

The database file is excluded from Git.

Because the application contains operational and historical business data, database protection is considered an infrastructure requirement.

The deployment should provide:

- regular automated database backups
- backups stored separately from the active database
- retention of multiple backup versions
- a documented restore procedure
- protection against accidental deletion/corruption of the active database

SQLite backups should be performed using a mechanism appropriate for SQLite's transactional behavior rather than simply copying the database file while it may be actively written.

The backup strategy should be designed so that application development, migrations, or accidental data corruption do not result in irreversible loss of business data.

A backup is only considered useful if the restore process is known to work, so restoration should be tested periodically.

---

## 19. Extensibility Principles

The system should remain intentionally small while allowing incremental extension.

### Feature-based organization

Features should own their application behavior instead of creating large global layers.

### Explicit module boundaries

Modules communicate through services/contracts rather than reaching into each other's persistence implementation.

### Database as source of truth

Derived information should generally be calculated from normalized persisted data rather than duplicated unnecessarily.

### Business logic in backend

Business rules must not depend on frontend behavior.

### Transactions for business operations

Multi-record changes should be atomic.

### Avoid premature abstraction

Shared infrastructure, generic frameworks, event buses, repositories, and other abstractions should only be introduced when a concrete requirement justifies them.

### Extension without premature complexity

Future capabilities such as authentication, additional users, reporting, or integrations should be possible without making them part of the current architecture.

---

## 20. Architectural Decisions

| Decision | Choice |
|---|---|
| Architecture | Modular monolithic web application |
| Repository | pnpm monorepo |
| Language | TypeScript |
| Backend | Node.js + Express |
| Frontend | React + Vite |
| API | REST |
| Database | SQLite |
| Database access | Drizzle |
| Backend organization | Feature-based |
| Backend module pattern | Schema / Repository / Service / Router |
| Frontend organization | Feature-based |
| UI | shadcn/ui |
| Deployment | Docker Compose |
| Runtime environment | Private LAN / home server |
| Authentication | Not currently required |
| Configuration | Environment variables |
| Timezone | Single configured timezone |
| Currency | RUB |
| Monetary storage | SQL decimal |
| Material stock | Derived from Supplies |
| Product stock | Derived from Product Items |
| Supply deletion | Soft delete |
| Material consumption | Explicit historical records |
| Status history | Explicit historical records |
| API contracts | Shared package planned |

---

## 21. Architectural Guidelines

### Historical records

If a relationship represents something that happened, and later changes to the referenced entity must not erase that fact, represent the relationship as its own persisted record.

This applies clearly to material consumption and status history and should be considered for other historical relationships discovered during detailed design.

### Cross-entity business operations

Operations involving multiple entities should be coordinated by a service and executed within a single database transaction where consistency requires it.

The architecture should remain pragmatic: the existing feature-based `schema / repository / service / router` pattern is preferred over introducing a more elaborate domain architecture without a concrete need.
