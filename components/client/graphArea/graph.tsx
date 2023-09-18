import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useStockStore } from "@/stores/stocks";
import { useGoogleTrendsStore } from "@/stores/googleTrends";

function unixTimestampToDate(unixTimestamp: number): string {
  const milliseconds = unixTimestamp * 1000;
  const date = new Date(milliseconds);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}-${day}`;
}

export default function Graph() {
  const stockData = useStockStore((state) => state.stockData);
  const googleTrendsData = useGoogleTrendsStore(
    (state) => state.googleTrendsData
  );

  let graphLineData = [];

  // Loop over object values
  Object.keys(stockData).forEach((key) => {
    stockData[key].t.forEach((timestamp, index) => {
      const existingEntry = graphLineData.find(
        (entry) => entry.time === timestamp
      );
      const newEntry = {
        time: timestamp,
        date: unixTimestampToDate(timestamp),
        [key]: stockData[key].c[index],
        [`${key}-average`]: stockData[key].averages[index],
      };

      if (existingEntry) {
        Object.assign(existingEntry, newEntry);
      } else {
        graphLineData.push(newEntry);
      }
    });
  });

  googleTrendsData.forEach((trendData, index) => {
    console.log(trendData.searchTerm);

    trendData.data.forEach((item) => {
      const existingEntry = graphLineData.find(
        (entry) => entry.time === item.timestamp
      );

      const newEntry = {
        time: item.timestamp,
        date: unixTimestampToDate(item.timestamp),
        [`${index}-trend-search-value`]: item.value,
      };

      if (existingEntry) {
        Object.assign(existingEntry, newEntry);
      } else {
        graphLineData.push(newEntry);
      }
    });
  });

  graphLineData = graphLineData.slice().sort(function (a, b) {
    return a.time - b.time;
  });

  if (graphLineData.length) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={graphLineData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="date" />
          <YAxis />

          <Tooltip />
          <Legend />

          {Object.keys(stockData).map((symbol) => (
            <Line
              key={symbol}
              name={`Stock: ${symbol.toUpperCase()}`}
              type="monotone"
              dataKey={`${symbol}-average`}
              stroke="#3b82f5"
              activeDot={{ r: 8 }}
              legendType="circle"
            />
          ))}

          {googleTrendsData.map((trendSearch, index) => (
            <Line
              key={trendSearch.searchTerm}
              name={`Trend: ${trendSearch.searchTerm}`}
              type="monotone"
              dataKey={`${index}-trend-search-value`}
              stroke="#34A853"
              activeDot={{ r: 8 }}
              connectNulls={true}
              legendType="circle"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  } else {
    return (
      <section className="w-full h-full flex items-center justify-center px-4 py-12 md:px-6 lg:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl">
            Welcome
          </h1>
          <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400">
            StockVsTrends has been rebuilt from the ground up, finally briging
            you features that have sat untouched for years! Start now by
            searching!
          </p>
          <p className="max-w-[900px] text-zinc-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-zinc-400 flex items-center ">
            Have an idea for a feature?{" "}
            <svg
              className="ml-2 h-6 w-6"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <a className="underline ml-0" href="#">
              {" "}
              Add an issue
            </a>
          </p>
        </div>
      </section>
    );
  }
}
