# Cloud Favorites Implementation Plan

## Goal
Enable users to save their favorite tools to the cloud, so their preferences are synchronized across all devices (Desktop, Mobile, etc.).

## Technology Stack
- **Database**: Vercel Postgres (Serverless SQL)
- **ORM**: Prisma (for easy database interaction)
- **API**: Next.js App Router API Routes (`/api/favorites`)
- **Authentication**: NextAuth.js (already installed) to identify users.

## Database Schema (Prisma)
We need to store:
1.  **Users** (handled by NextAuth, but we need to map them if using adapters, or just rely on email/id). *Since we are using standard NextAuth, we might need the NextAuth Prisma Adapter schemas if we want full DB persistence for sessions, but for favorites, we just need a link.*
    *   Actually, to keep it simple and robust, we will add the standard NextAuth Schema to `prisma/schema.prisma` so user accounts are stored in Postgres, not just JWTs.
2.  **Favorites**: A robust many-to-many or one-to-many relationship.
    *   `User` has many `Favorite`.
    *   `Favorite` stores `toolId`.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  favorites     Favorite[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  toolId    String   // The ID string of the tool (e.g., "pdf-merge")
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, toolId]) // Prevent duplicate favorites for same tool
}

// ... + Standard NextAuth Account/Session models
```

## API Routes
### `GET /api/favorites`
- **Auth**: Protected (Requires Login).
- **Action**: Returns list of `toolId`s favorited by the current user.

### `POST /api/favorites`
- **Auth**: Protected.
- **Body**: `{ toolId: string }`
- **Action**: Adds a row to `Favorite` table.

### `DELETE /api/favorites`
- **Auth**: Protected.
- **Query**: `?toolId=xyz`
- **Action**: Removes the row.

## UI Components
1.  **`FavoriteButton`**: A heart icon component.
    *   Fetches status from API on load (or via a new `FavoritesContext`).
    *   Optimistic UI updates (toggles immediately, then syncs).
2.  **`FavoritesContext`**: To manage the list of favorites globally so we don't refetch for every single button.
3.  **`ProfilePage`**: Show a list of favorited tools.

## Step-by-Step
1.  **Setup**: Install Prisma, Initialize, Add Schema.
2.  **Link**: Connect to Vercel Postgres.
3.  **Migrate**: Push schema to DB.
4.  **Backend**: Write API endpoints.
5.  **Frontend**: Implement Context and Button.
