import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Homepage() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800 text-white">
      <aside className="w-full md:w-1/3 p-4 border-r border-gray-600">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter text-center text-green-500 hover:text-blue-500 transition-colors duration-500 ease-in-out">
          StocksVsTrends
        </h1>
        <Separator className="my-4" />
        <form className="space-y-4">
          <div>
            <Label className="text-gray-300" htmlFor="stock-symbol">
              Stock Symbol
            </Label>
            <Input
              className="bg-gray-700 text-white placeholder-gray-500"
              id="stock-symbol"
              placeholder="Enter stock symbol"
            />
          </div>
          <div>
            <Label className="text-gray-300" htmlFor="trend-query">
              Trend Query
            </Label>
            <Input
              className="bg-gray-700 text-white placeholder-gray-500"
              id="trend-query"
              placeholder="Enter trend query"
            />
          </div>
          <Button
            className="bg-gray-600 hover:bg-gray-500 text-white"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </aside>
      <div className="w-full md:w-2/3 p-4 flex flex-col">
        <div className="h-full border rounded-lg border-gray-600 flex-grow" />
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
