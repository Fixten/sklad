# Product Overview

Sklad is a small-business management application for managing materials, products, production, inventory, and sales.

The application is used to:

- Track purchased materials and available material stock.
- Maintain reusable product templates.
- Record individual physical product items.
- Track production and material consumption.
- Track product status and sales.
- Calculate product costs from actual material usage, labor, and additional costs.
- Provide a graphical interface for daily business operations.

The initial application is for a single business. Authentication, roles, payments, accounting, reporting, import/export, and notifications are outside the current scope.

---

## Working Day

The main working-day flow is:

1. Open the application.
2. Review products currently in stock.
3. Record products that have been sold.
4. Record newly purchased materials.
5. Record newly produced or existing physical product items.
6. Check product costs.

These operations should be accessible without requiring the user to navigate through unrelated configuration or technical functionality.

The application is a web application and should be usable on mobile devices.

---

## Feature Flags

The project provides feature flags that allow any application feature to be enabled or disabled
through configuration, without changing code.

- A feature is **enabled by default**. Disabling it must be an explicit, deliberate configuration change.
- Feature flags exist so that not-yet-complete or not-currently-needed functionality can be turned off
  while the rest of the application keeps working.
- Disabling a feature removes it from the application's user-facing functionality only.
- The API documentation always describes the full set of endpoints, including those of disabled features,
  so the contract stays complete and reviewable.

Configuration and technical behaviour are described in `docs/tech/architecture.md` §16.1.
