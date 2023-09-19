import { Separator } from "@/components/ui/separator";
import SidebarForm from "@/components/client/forms/sidebar";
import GraphArea from "@/components/client/graphArea";

export default function Homepage() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      <aside className="w-full md:w-1/3 p-4 border-r border-gray-600">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-center text-green-500 hover:text-blue-500 transition-colors duration-500 ease-in-out">
          StocksVsTrends
        </h1>
        <Separator className="my-4" />

        <SidebarForm />
      </aside>
      <div className="w-full md:w-2/3 p-4 flex flex-col">
        <div className="h-full border rounded-lg border-gray-600 flex-grow">
          <GraphArea />
        </div>
        <footer className="w-full flex flex-col justify-center items-center bg-gray-700 text-white p-2 mt-4 rounded-lg">
          <div className="flex justify-center items-center text-sm">
            Made with
            <svg
              className="text-red-500 mx-1 h-4 w-4"
              fill="currentColor"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            by Gabe Nuñez
          </div>
          <p className="text-xs text-center mt-2">
            Use this tool at your own risk and have fun! :)
          </p>
        </footer>
      </div>
    </div>
  );
}
