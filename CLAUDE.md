# CLAUDE.md - Coding Guidelines

## Commands
- `pnpm dev`: Run development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Run ESLint

## Code Style Guidelines
- **TypeScript**: Use strict mode; prefer interfaces for props; explicit return types
- **Imports**: Use path aliases (@/components); group by source; import types separately
- **Components**: PascalCase names; "use client" directive; functional components with arrow functions 
- **Naming**: "Neo" prefix for neobrutalist UI; descriptive function/variable names
- **State**: Context API for global state; React hooks; server actions with "use server"
- **Error Handling**: Try/catch blocks; return {error} objects; descriptive console.error messages
- **CSS**: Tailwind CSS for styling; clsx/tailwind-merge for conditional classes
- **Organization**: UI components in /components/ui; layouts in app/; actions in app/actions
- **Patterns**: Component composition; forwardRef for ref forwarding; custom hooks for logic reuse
- **Testing**: Currently no test command defined - add Jest/React Testing Library as needed

Use Typescript strict mode, prefer explicit return types, and follow Next.js App Router conventions.