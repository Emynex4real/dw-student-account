/**
 * DashboardPage — placeholder for the main student dashboard.
 * Will show metrics, recent activity, and quick links in later steps.
 */
const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Student Dashboard
      </h1>

      {/* Placeholder stat cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Enrolled Courses', value: '—', icon: '📚', color: 'bg-blue-50 text-blue-700' },
          { label: 'Upcoming Deadlines', value: '—', icon: '📅', color: 'bg-amber-50 text-amber-700' },
          { label: 'Avg. Grade', value: '—', icon: '🎓', color: 'bg-green-50 text-green-700' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder content area */}
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-gray-400 text-sm">
          Dashboard content will be populated in upcoming steps.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
