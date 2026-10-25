---
name: yeknal-aspnet-core
description: "Build, review, refactor, or migrate ASP.NET Core web apps: Blazor, Razor Pages, MVC, Minimal APIs, controllers, SignalR, gRPC, middleware, DI, configuration, auth, and deployment. Use when working on a .NET web app."
metadata:
  internal: true
---

# ASP.NET Core

## Overview

Pick the right ASP.NET Core application model, compose the host and request pipeline correctly, and implement features the way Microsoft documents them today.

Load only the references that fit the task. Do not load every reference by default.

## Workflow

1. Confirm the target framework, SDK, and current app model.
2. Open [references/stack-selection.md](references/stack-selection.md) first for new apps or major refactors.
3. Open [references/program-and-pipeline.md](references/program-and-pipeline.md) next for `Program.cs`, DI, configuration, middleware, routing, logging, and static assets.
4. Open exactly one primary app-model reference:
   - [references/ui-blazor.md](references/ui-blazor.md)
   - [references/ui-razor-pages.md](references/ui-razor-pages.md)
   - [references/ui-mvc.md](references/ui-mvc.md)
   - [references/apis-minimal-and-controllers.md](references/apis-minimal-and-controllers.md)
5. Add cross-cutting references only as needed:
   - [references/data-state-and-services.md](references/data-state-and-services.md)
   - [references/security-and-identity.md](references/security-and-identity.md)
   - [references/realtime-grpc-and-background-work.md](references/realtime-grpc-and-background-work.md)
   - [references/testing-performance-and-operations.md](references/testing-performance-and-operations.md)
6. Open [references/versioning-and-upgrades.md](references/versioning-and-upgrades.md) before introducing new platform APIs into an older solution or migrating between major versions.
7. Use [references/source-map.md](references/source-map.md) when you need the Microsoft Learn section that matches a task the focused references do not cover.

## Default Operating Assumptions

- Prefer the latest stable ASP.NET Core and .NET unless the repository or user request pins an older target. Verify the current version on Microsoft Learn rather than assuming one from this skill.
- Prefer `WebApplicationBuilder` and `WebApplication`. Avoid older `Startup` and `WebHost` patterns unless the codebase already uses them or the task is a migration.
- Prefer built-in DI, options/configuration, logging, ProblemDetails, OpenAPI, health checks, rate limiting, output caching, and Identity before adding third-party infrastructure.
- Keep feature slices cohesive so the page, component, endpoint, controller, validation, service, data access, and tests stay easy to trace.
- Respect the existing app model. Do not rewrite Razor Pages to MVC or controllers to Minimal APIs without a clear reason.

## Execution Notes

- When generating new code, start from the correct `dotnet new` template and keep the generated structure recognizable.
- When editing an existing solution, follow the solution's own conventions first and use these references to avoid framework misuse or outdated patterns.
- When a task mentions "latest", verify the feature on Microsoft Learn or the ASP.NET Core docs repo before relying on memory.
