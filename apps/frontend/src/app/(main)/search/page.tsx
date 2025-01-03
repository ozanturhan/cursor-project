import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground dark:text-foreground-dark">Find Experts</h1>
        <p className="mt-4 text-lg text-muted dark:text-muted-dark">Connect with professionals who can help you succeed</p>
        
        {/* Search Bar */}
        <div className="mt-8 flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-muted dark:text-muted-dark" />
            </div>
            <input
              type="text"
              placeholder="Search by expertise, name, or keyword"
              className="block w-full pl-10 pr-3 py-4 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark border border-border dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="inline-flex items-center px-6 py-4 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-muted dark:text-muted-dark" />
            <span className="ml-2 text-muted dark:text-muted-dark">Filters</span>
          </button>
        </div>

        {/* Filter Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['Available Today', 'Under $100/hr', 'Top Rated', 'Business Strategy', 'Legal'].map((filter) => (
            <span
              key={filter}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-neutral-100 dark:bg-neutral-800 text-muted dark:text-muted-dark"
            >
              {filter}
              <button className="ml-2 text-muted dark:text-muted-dark hover:text-foreground dark:hover:text-foreground-dark">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <p className="text-muted dark:text-muted-dark">Showing 127 experts</p>
          <select className="bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-muted dark:text-muted-dark">
            <option>Most Relevant</option>
            <option>Highest Rated</option>
            <option>Lowest Price</option>
            <option>Highest Price</option>
          </select>
        </div>

        {/* Expert Cards */}
        <div className="mt-6 grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="h-16 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800" />
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-medium text-foreground dark:text-foreground-dark">Sarah Wilson</h3>
                      <p className="text-muted dark:text-muted-dark">Business Strategy Consultant</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <StarIcon className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 text-muted dark:text-muted-dark">4.9</span>
                        <span className="ml-1 text-muted dark:text-muted-dark">(127)</span>
                      </div>
                      <p className="mt-1">
                        <span className="font-medium text-foreground dark:text-foreground-dark">$150</span>
                        <span className="text-muted dark:text-muted-dark">/hour</span>
                      </p>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-muted dark:text-muted-dark">
                    10+ years helping startups and enterprises develop growth strategies and improve operational efficiency.
                  </p>
                  
                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Strategy', 'Operations', 'Growth', 'Available Today'].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-neutral-100 dark:bg-neutral-800 text-muted dark:text-muted-dark"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center px-8 py-4 text-base font-medium rounded-lg text-white dark:text-white bg-primary-500 hover:bg-primary-600 transition-colors">
            Load More Experts
          </button>
        </div>
      </div>
    </div>
  );
} 