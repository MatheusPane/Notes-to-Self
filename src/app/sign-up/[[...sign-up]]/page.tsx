import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-semibold text-navy mb-2">
            Create your safe space
          </h1>
          <p className="text-sm text-muted">
            Start your journey of self-reflection.
          </p>
        </div>
        <SignUp
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg border border-broken-white bg-cream",
            },
          }}
        />
      </div>
    </div>
  );
}
