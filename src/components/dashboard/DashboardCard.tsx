export default function DashboardCard({ title, value, description }: { title: string; value: string | number; description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h2>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
}