export function Footer() {
  return (
    <footer className="bg-background dark:bg-background-dark border-t border-border dark:border-border-dark">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted dark:text-muted-dark">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 