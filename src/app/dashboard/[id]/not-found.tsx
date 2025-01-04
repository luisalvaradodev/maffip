import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Dashboard Not Found</h2>
      <p className="text-gray-600 mb-4">Could not find the requested dashboard.</p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboards</Link>
      </Button>
    </div>
  );
}

