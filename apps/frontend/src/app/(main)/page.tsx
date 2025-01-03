import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/auth-provider';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, CheckCircleIcon, UserGroupIcon, VideoCameraIcon, CalendarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

async function getUserData(accessToken: string) {
  try {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userData = session?.accessToken ? await getUserData(session.accessToken) : null;
  
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative bg-background dark:bg-background-dark py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold tracking-tight text-foreground dark:text-foreground-dark sm:text-7xl md:text-8xl">
              Connect with Expert Consultants
            </h1>
            <p className="mt-8 text-xl text-muted dark:text-muted-dark">
              Book one-on-one video consultations with professionals in various fields. Get the guidance you need, when you need it.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-white dark:text-white bg-primary-500 hover:bg-primary-600 transition-colors"
              >
                Find a Consultant
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/become-consultant"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-primary-500 bg-background dark:bg-background-dark border border-border dark:border-border-dark hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Become a Consultant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Consultants */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground dark:text-foreground-dark">Featured Consultants</h2>
          <p className="mt-4 text-lg text-muted dark:text-muted-dark">Connect with our top-rated professionals</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-2xl p-6 hover:shadow-lg transition-all">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                <div>
                  <h3 className="text-lg font-medium text-foreground dark:text-foreground-dark">John Doe</h3>
                  <p className="text-sm text-muted dark:text-muted-dark">Business Strategy</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-muted dark:text-muted-dark">
                  <CalendarIcon className="h-5 w-5 text-muted dark:text-muted-dark" />
                  <span className="ml-2">Available Today</span>
                </div>
                <div className="flex items-center text-sm text-muted dark:text-muted-dark">
                  <span className="font-medium text-foreground dark:text-foreground-dark">$100</span>
                  <span className="ml-1">/hour</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground dark:text-foreground-dark">Browse by Category</h2>
          <p className="mt-4 text-lg text-muted dark:text-muted-dark">Find the right expert for your needs</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Business Strategy', icon: UserGroupIcon },
            { name: 'Legal Advice', icon: ShieldCheckIcon },
            { name: 'Career Coaching', icon: CheckCircleIcon },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase().replace(' ', '-')}`}
              className="group bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <div>
                <category.icon className="h-8 w-8 text-primary-500" />
                <h3 className="mt-4 text-lg font-medium text-foreground dark:text-foreground-dark group-hover:text-primary-500">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground dark:text-foreground-dark">How It Works</h2>
          <p className="mt-4 text-lg text-muted dark:text-muted-dark">Get started in three simple steps</p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: 'Find & Choose',
              description: 'Browse experts in your field',
              icon: UserGroupIcon,
            },
            {
              title: 'Book',
              description: 'Select time and schedule meeting',
              icon: CalendarIcon,
            },
            {
              title: 'Connect',
              description: 'Join video consultation',
              icon: VideoCameraIcon,
            },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto h-12 w-12 text-primary-500">
                <step.icon className="h-12 w-12" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-foreground dark:text-foreground-dark">{step.title}</h3>
              <p className="mt-2 text-sm text-muted dark:text-muted-dark">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-neutral-50 dark:bg-neutral-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { label: 'Active Consultants', value: '500+' },
              { label: 'Consultations Completed', value: '10,000+' },
              { label: 'Client Satisfaction', value: '98%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary-500">{stat.value}</p>
                <p className="mt-2 text-sm text-muted dark:text-muted-dark">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16">
        <h2 className="text-4xl font-bold text-foreground dark:text-foreground-dark">Ready to Get Started?</h2>
        <p className="mt-4 text-lg text-muted dark:text-muted-dark">
          Join our platform and connect with expert consultants today
        </p>
        <div className="mt-8">
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg text-white dark:text-white bg-primary-500 hover:bg-primary-600 transition-colors"
          >
            Find Your Expert
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
