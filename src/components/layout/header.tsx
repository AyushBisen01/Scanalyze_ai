import { Stethoscope } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="mr-4 flex items-center">
          <Stethoscope className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold text-foreground">RadioAgent</h1>
        </div>
      </div>
    </header>
  );
}
