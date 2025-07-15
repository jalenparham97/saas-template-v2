# Copilot Instructions for SaaS Template v2

## Architecture Overview

This is a production-ready SaaS template built with Next.js 15 App Router, featuring a modular architecture:

- **Database Layer**: PostgreSQL with Prisma ORM for type-safe database operations
- **Authentication**: Better Auth with multi-provider support (Google, GitHub, email/password, passkeys)
- **API Layer**: tRPC for type-safe API routes with React Query client-side caching
- **Payment Processing**: Stripe integration with subscription management via Better Auth Stripe plugin
- **File Storage**: AWS S3-compatible storage (Tigris Data) via Better Upload
- **Email System**: React Email templates with Resend delivery
- **UI Components**: shadcn/ui with Tailwind CSS and Radix UI primitives
- **Package Manager**: Bun for fast dependency management and script execution

## Critical Patterns & Conventions

### Authentication & Authorization

- Use `auth.api.getSession()` from Better Auth for server-side session checking in tRPC context
- Protected routes use `protectedProcedure` in tRPC routers with automatic session validation
- Admin features check for `admin` or `superadmin` roles via Better Auth admin plugin
- All auth logic centralized in `src/lib/auth.ts` with Better Auth configuration
- Client-side auth via `authClient` from `@/lib/auth-client.ts` with React hooks
- Middleware in `src/middleware.ts` handles route protection and redirects

### Database & Queries

- Prisma schema defines User, Session, Account, Verification, Passkey, and Subscription models
- Use tRPC procedures for all database operations - no direct Prisma calls in components
- Database context injected via `createTRPCContext` in `src/server/api/trpc.ts`
- Run `bun run db:generate` after schema changes to update Prisma client
- Custom query hooks in `src/queries/` for common operations (user, storage)

### tRPC API Structure

- Routers organized by domain: `user`, `storage`, `payments` in `src/server/api/routers/`
- Use `protectedProcedure` for authenticated endpoints, `publicProcedure` for public ones
- Input validation with Zod schemas defined in `src/schemas/`
- Error handling with ZodError formatting built into tRPC config
- Server-side calls via `createCaller` for RSC components
- React Query integration with 30s staleTime for optimal caching
- `src/queries/` - React Query hooks wrapping tRPC
- Type inference: `RouterInputs`/`RouterOutputs` from `src/trpc/react.tsx`

## File Organization Patterns

### **API Routes**

- `src/app/api/auth/[...all]/` - Better Auth endpoints
- `src/app/api/(external-api)/v1/` - Public REST API
- `src/app/api/integrations/` - QStash webhook handlers
- `src/app/api/jobs/` - Background job processors

### **Component Organization**

- `src/components/ui/` - Reusable UI components (shadcn/ui based)
- `src/components/{domain}/` - Feature-specific components
- `src/app/` - Next.js App Router pages and layouts

### Component Organization

- UI components in `src/components/ui/` follow shadcn/ui patterns with "new-york" style
- Feature components grouped by domain: `auth/`, `dashboard/`, `settings/`, `admin/`
- Use `cn()` utility from `src/lib/utils.ts` for className merging (clsx + tailwind-merge)
- Button component supports loading states, icons, href prop for Link integration
- Form handling with react-hook-form + zodResolver for validation
- Custom Input component with label, error states, and description support

### File Uploads & Storage

- Use Better Upload for file handling with S3-compatible storage (Tigris Data)
- Upload components in `src/components/ui/image-uploader.tsx` and `upload-dropzone-progress.tsx`
- Storage operations via tRPC `storage` router with presigned URLs
- S3 config in `src/lib/s3.ts` with `s3Client` for Tigris Data endpoint
- File upload routes in `src/app/api/upload/route.ts` with auth checking
- Avatar generation API at `/api/avatar` for users without profile pictures
- Image URLs created via `createImageUploadUrl()` utility function

### Email Templates

- React Email templates in `src/emails/templates/` with shared components in `src/emails/components/`
- Email sending logic in `src/lib/mail.ts` using Resend with `APP_NAME` branding
- Preview emails locally with `bun run preview-emails` on port 3333
- Templates include: welcome, verify-email, password-reset, change-email
- Shared styles in `src/emails/components/sharedStyles.tsx` for consistent design
- Email functions integrated with Better Auth for verification and password reset flows

### Environment & Configuration

- Type-safe environment variables via `@t3-oss/env-nextjs` in `src/env.js`
- Constants in `src/lib/contants.ts` including app name, routes, and middleware config
- Stripe webhook handling requires `STRIPE_WEBHOOK_SECRET` for Better Auth integration
- Environment validation with server/client separation and runtime mapping
- Use `SKIP_ENV_VALIDATION=true` for Docker builds to bypass validation

### Utility Functions & Helpers

- Date formatting with dayjs in `src/utils/format-date.ts` with relative time support
- Feature access control via `hasFeatureAccess()` in `src/utils/has-feature-access.ts`
- User agent parsing with `parseUserAgent()` for session tracking
- Color utilities for avatar generation and contrast checking
- File size conversion with `bytesToMegabytes()` for upload limits
- Custom hooks in `src/hooks/` for clipboard, dialog state, mobile detection

## Development Workflows

### Database Operations

```bash
bun run db:generate   # Generate Prisma client
bun run db:studio     # Open Prisma Studio for data viewing
bun run db:push       # Push schema changes without migrations
bun run db:migrate    # Deploy migrations to production
```

### Development Server

```bash
bun dev               # Start with Turbo for fast refresh
bun run preview       # Build and start production preview
```

### Authentication & Email

```bash
bun run better-auth:generate  # Generate Better Auth types after config changes
bun run preview-emails        # Preview email templates on localhost:3333
```

### Stripe Integration

```bash
bun run stripe:listen # Forward webhooks to local development server
```

### Code Quality & Testing

```bash
bun run check         # Run linting and type checking
bun run lint          # Run ESLint only
bun run lint:fix      # Run ESLint with auto-fix
bun run typecheck     # Run TypeScript compiler check
bun run format:check  # Check code formatting with Prettier
bun run format:write  # Format code with Prettier
```

## Key Integration Points

### Better Auth Configuration

- Multi-provider setup in `src/lib/auth.ts` with Stripe plugin for subscription handling
- Passkey support configured for localhost (update `rpID` and `origin` for production)
- Email verification and password reset flows integrated with React Email templates
- Admin plugin with `admin` and `superadmin` roles for user management
- Session management with device tracking via user agent parsing
- Database adapter using Prisma with PostgreSQL provider

### Stripe Subscription Flow

- Subscription model linked via `stripeCustomerId` and `stripeSubscriptionId`
- Pro plan with 14-day trial configured in Better Auth Stripe plugin
- Webhook endpoints handle subscription status changes automatically
- Billing portal integration via `paymentsRouter.getBillingPortalSession`
- Feature access control based on subscription plans in `hasFeatureAccess()`

### File Upload Security

- S3 bucket configured with presigned URLs for secure uploads (60s expiry)
- File cleanup handled via storage router when entities are deleted
- Avatar generation for users without profile pictures using SVG generation
- Upload routes with authentication checking via `checkAuthSession()`
- File type restrictions and size limits enforced in upload components
- Image URL generation with public bucket URL for display

### tRPC & React Query Integration

- Server-side rendering support with hydration helpers in `src/trpc/server.ts`
- Client-side caching with 30s staleTime for optimal performance
- SuperJSON transformer for serializing complex data types
- Error formatting with ZodError flattening for form validation
- Context creation with session and database injection

## Common Gotchas & Best Practices

### Import & Path Management

- Always use absolute imports with `@/` prefix as configured in `tsconfig.json`
- shadcn/ui components use aliases: `@/components`, `@/lib`, `@/hooks`
- Import types with `type` keyword for better tree-shaking: `import { type User } from "@prisma/client"`

### Database & Schema Changes

- Prisma client regeneration required after schema changes via `bun run db:generate`
- Use `bun run db:push` for development, `bun run db:migrate` for production
- Database context is automatically injected in tRPC procedures - don't import `db` directly in components

### API & Router Configuration

- tRPC procedures must be added to appropriate router in `src/server/api/root.ts`
- Use `protectedProcedure` for authenticated endpoints, never `publicProcedure` for sensitive data
- Input validation schemas in `src/schemas/` should match form validation schemas

### Environment & Configuration

- Environment variables must be added to both schema and runtime mapping in `src/env.js`
- Client-side env vars must be prefixed with `NEXT_PUBLIC_`
- Use `SKIP_ENV_VALIDATION=true` for Docker builds only

### Authentication & Security

- Better Auth requires `better-auth:generate` command after auth config changes
- Stripe webhook secret must match between Stripe CLI and environment variables
- Session checking in middleware uses `getSessionCookie()` for performance
- File uploads require authentication - use `checkAuthSession()` in upload routes

### Component & Form Patterns

- Use `cn()` utility for className merging instead of manual string concatenation
- Form validation with `zodResolver` and error display via Input component's `error` prop
- Loading states should use Button component's `loading` prop for consistency
- Custom hooks in `src/hooks/` for reusable stateful logic (dialogs, clipboard, etc.)

### Performance & Caching

- React Query staleTime set to 30s - adjust per query if needed
- Use `"use client"` directive only when necessary for client-side interactivity
- Server components preferred for data fetching with tRPC server-side calls
