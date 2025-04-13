import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-emerald-600">Thyme</div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-emerald-600 hover:text-emerald-700"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with the perfect service provider
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thyme makes it easy for providers to showcase their services and for
            clients to find the perfect match. Whether you're offering services
            or looking for them, we've got you covered.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              I'm a Provider
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50"
            >
              I'm a Client
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 bg-white">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* For Providers */}
          <div className="p-8 rounded-xl bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              For Providers
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Showcase your services to a wide audience</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Manage your schedule and bookings efficiently</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Build your reputation with client reviews</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Get paid securely through our platform</span>
              </li>
            </ul>
          </div>

          {/* For Clients */}
          <div className="p-8 rounded-xl bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              For Clients
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Find trusted providers in your area</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Read reviews and compare services</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Book appointments with ease</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">✓</span>
                <span>Pay securely through our platform</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-600">
        <p>© 2024 Thyme. All rights reserved.</p>
      </footer>
    </div>
  );
}
