# Epic 3 — Manage Product Templates

## Goal

Allow the user to define reusable product definitions from which physical Product Items can be created.

## Scope

A Product Template contains:

- Name
- Description
- Production instructions
- Required Material Variants and default quantities
- Expected production work hours
- Development work hours
- Drawing description

Each required Material Variant occurs once in a Product Template.

The Product Template references an exact Material Variant. If a product needs a different variant, the user can create/copy a template and change the required variant.

The user can create, view, edit, and delete Product Templates when permitted by existing Product Items.

Changes to a Product Template affect future Product Item creation only. Existing Product Items are not changed by later template edits.

## Enables

This epic establishes reusable product definitions required for creating physical Product Items.
