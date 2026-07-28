import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background text-foreground animate-in fade-in zoom-in duration-500">
      <h1 className="text-8xl font-serif font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-6 text-white">Page Not Found</h2>
      <p className="text-white/60 mb-8 max-w-md text-center">
        The track you're looking for seems to have been misplaced in the mix.
      </p>
      <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground font-serif font-medium rounded-md hover:bg-primary/90 transition-colors">
        Return Home
      </Link>
    </div>
  );
}