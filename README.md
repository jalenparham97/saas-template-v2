# SaaS Template v2

A modern, full-stack SaaS application template built with the latest technologies for rapid development and deployment.

## Tech Stack

This project uses a carefully selected stack of modern technologies:

- **Framework**: [Next.js 15](https://nextjs.org) - React framework with App Router
- **Database**: [PostgreSQL](https://postgresql.org) with [Prisma](https://prisma.io) ORM
- **Authentication**: [Better Auth](https://better-auth.com) with Google & GitHub OAuth
- **Payments**: [Stripe](https://stripe.com) integration with webhooks
- **Styling**: [Tailwind CSS](https://tailwindcss.com) with [shadcn/ui](https://ui.shadcn.com)
- **API**: [tRPC](https://trpc.io) for type-safe APIs
- **Email**: [React Email](https://react.email) with [Resend](https://resend.com)
- **File Upload**: [Better Upload](https://better-upload.com) with AWS S3
- **Type Safety**: [TypeScript](https://typescriptlang.org) with strict configuration
- **Package Manager**: [Bun](https://bun.sh) - Fast JavaScript runtime and package manager

## Features

This SaaS template includes a comprehensive set of features for rapid development:

### 🔐 Authentication & Security
- **Multi-provider Authentication**: Email/password, Google OAuth, GitHub OAuth
- **Advanced Security**: Passkey support, email verification, password reset
- **Session Management**: Multiple active sessions with individual revocation
- **Account Linking**: Link multiple OAuth providers to single account
- **Admin System**: Role-based access control (admin, superadmin)

### 👤 User Management
- **Profile Management**: Update name, email, profile pictures
- **Avatar Generation**: Automatic avatar creation for new users
- **Email Changes**: Secure email change process with verification
- **Account Deletion**: Full account deletion capability
- **File Uploads**: Profile picture uploads with S3 storage

### 💳 Subscription & Payments
- **Stripe Integration**: Complete payment processing with webhooks
- **Subscription Plans**: Pro plan with 14-day free trial
- **Billing Portal**: Integrated Stripe billing management
- **Usage Tracking**: Monitor subscription status and renewals
- **Plan Upgrades**: Seamless subscription upgrades

### 📧 Email System
- **Transactional Emails**: Welcome, verification, password reset emails
- **Email Templates**: Beautiful React Email templates
- **Email Provider**: Resend integration for reliable delivery
- **Email Verification**: Automated email verification flow

### 🗃️ File Management
- **Cloud Storage**: AWS S3 compatible storage (Tigris Data)
- **File Uploads**: Drag & drop file uploads with progress tracking
- **Image Processing**: Avatar generation and image optimization
- **File Deletion**: Secure file deletion and cleanup

### 🎨 User Interface
- **Modern Design**: Clean, responsive design with Tailwind CSS
- **Component Library**: Comprehensive shadcn/ui component set
- **Dark/Light Mode**: Theme support (customizable)
- **Mobile Responsive**: Fully responsive across all devices
- **Loading States**: Smooth loading indicators and skeleton screens

### 🛠️ Admin Dashboard
- **User Management**: View and manage all users
- **Subscription Oversight**: Monitor all user subscriptions
- **Analytics Dashboard**: Basic analytics and metrics
- **System Administration**: Admin-only features and controls

### 🔧 Developer Experience
- **Type Safety**: Full TypeScript coverage with strict mode
- **API Layer**: Type-safe tRPC APIs with React Query
- **Database**: Prisma ORM with PostgreSQL
- **Code Quality**: ESLint, Prettier, and automated formatting
- **Fast Development**: Hot reload with Turbo and Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.0+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd saas-template-v2
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables in `.env`:
- Database URL
- Better Auth secret and URL
- OAuth provider credentials (Google, GitHub)
- Stripe keys
- AWS S3 credentials
- Resend API key

4. Start the database:
```bash
./start-database.sh
```

5. Run database migrations:
```bash
bun run db:generate
```

6. Start the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Available Scripts

- `bun dev` - Start development server with Turbo
- `bun run build` - Build for production
- `bun start` - Start production server
- `bun run check` - Run linting and type checking
- `bun run lint` - Run ESLint
- `bun run typecheck` - Run TypeScript compiler
- `bun run format:check` - Check code formatting
- `bun run format:write` - Format code with Prettier
- `bun run db:generate` - Generate Prisma client and run migrations
- `bun run db:migrate` - Deploy migrations
- `bun run db:push` - Push schema changes
- `bun run db:studio` - Open Prisma Studio
- `bun run preview-emails` - Preview email templates
- `bun run stripe:listen` - Listen to Stripe webhooks
- `bun run better-auth:generate` - Generate Better Auth types

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── emails/             # Email templates and components
├── lib/                # Utility functions and constants
├── server/             # Server-side code (auth, tRPC)
├── styles/             # Global styles
└── trpc/               # tRPC client configuration
```


