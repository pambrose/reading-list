import { SignOutButton } from "./sign-out-button";
import { ThemeToggle } from "./theme-toggle";

export function Header({ userEmail }: { userEmail: string }) {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Reading List</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</span>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
