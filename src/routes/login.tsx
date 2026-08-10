import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/layout/site-header";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="grid flex-1 place-items-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-display text-2xl tracking-tight">
              Sign in to Cashlane
            </CardTitle>
            <CardDescription>
              Secure your seller dashboard. Store data also saves locally in this
              browser so you can demo without an account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {authEnabled ? (
              GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/dashboard" })}
                >
                  Continue with {p.label}
                </Button>
              ))
            ) : (
              <p className="text-sm text-fg-muted">Sign-in is disabled.</p>
            )}
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/dashboard">Continue as guest</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
