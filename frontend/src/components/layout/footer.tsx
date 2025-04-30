export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-4 md:h-16 md:flex-row md:py-0">
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SQL-LLM. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
