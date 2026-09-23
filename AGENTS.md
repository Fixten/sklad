# Project overview

This is node js pnpm monorepo project written in typescript. It has 2 packages: frontend and backend located in the root.

# Docs

Project has docmentation in docs folder. It has product subfolder with business requirements and tech subfolder with tech requirements.

# Backend

The backend contract is documented in `backend/public/spec.json` (OpenAPI 3.0). To (re)generate it from the backend code, run `pnpm openapi:generate`. When working on the frontend, inspect this generated file to understand the backend API instead of reading the backend package source.
