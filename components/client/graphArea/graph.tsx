import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

import { StocksType, TrendsType } from "@/app/page";

function unixTimestampToDate(unixTimestamp: number): string {
  const milliseconds = unixTimestamp * 1000;
  const date = new Date(milliseconds);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${month}-${day}`;
}

const formatInfo = (value, name, props) => {
  return [`${value}%`, name];
};

const PercentageCustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="w-auto h-auto bg-gray-600 p-3 bg-opacity-70 rounded-lg">
        <p className="text-xs">{label}</p>
        {payload.map((item, index) => (
          <p key={item.name + index}>{`${item.name}: ${item.value}%`}</p>
        ))}
      </div>
    );
  }

  return null;
};

const DollarCustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="w-auto h-auto bg-gray-600 p-3 bg-opacity-70 rounded-lg">
        <p className="text-xs">{label}</p>
        {payload.map((item, index) => (
          <p key={item.name + index}>{`${item.name}: $${item.value}`}</p>
        ))}
      </div>
    );
  }

  return null;
};

export default function Graph({
  serverFetchedStocks,
  serverFetchedTrends,
  ogMode,
  splitMode,
}: {
  serverFetchedStocks: StocksType;
  serverFetchedTrends: TrendsType;
  ogMode: boolean;
  splitMode: boolean;
}) {
  let graphLineData: { time: number }[] = [];

  // Loop and add each data type to the chart
  serverFetchedStocks.forEach((dataItem, stockDataIndex) => {
    dataItem.data.timestamps.forEach((timestamp, timestampIndex) => {
      const existingEntry = graphLineData.find(
        (entry) => entry.time === timestamp
      );
      const newEntry = {
        time: timestamp,
        date: unixTimestampToDate(timestamp),
        [`${stockDataIndex}-stock-search-value`]:
          dataItem.data.averages[timestampIndex],
        [`${stockDataIndex}-stock-price`]: Number(
          dataItem.data.prices[timestampIndex]
        ).toFixed(2),
      };

      if (existingEntry) {
        Object.assign(existingEntry, newEntry);
      } else {
        graphLineData.push(newEntry);
      }
    });
  });

  serverFetchedTrends.forEach((trendData, index) => {
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
    if (splitMode) {
      const syncId = "pizza"; // Used to keep the graphs in sync when hovering
      const stocksExist = serverFetchedStocks?.length > 0;
      const trendsExist = serverFetchedTrends?.length > 0;

      return (
        <>
          {stocksExist && (
            <ResponsiveContainer
              width="100%"
              height={trendsExist ? "50%" : "100%"}
            >
              <LineChart
                width={500}
                height={300}
                data={graphLineData}
                margin={{
                  top: 0,
                  right: !ogMode ? 5 : 0,
                  left: !ogMode ? -10 : 0,
                  bottom: !ogMode ? 5 : 0,
                }}
                syncId={syncId}
              >
                <XAxis hide={ogMode} dataKey="date" />
                <YAxis hide={ogMode} unit="$" />

                <Tooltip
                  content={<DollarCustomTooltip />}
                  formatter={formatInfo}
                />
                {!ogMode && <Legend />}

                {serverFetchedStocks.map((item, index) => {
                  return (
                    <Line
                      key={item.searchTerm + "-stock"}
                      name={`$${item.searchTerm.toUpperCase()}`}
                      type="monotone"
                      dataKey={`${index}-stock-price`}
                      stroke="#3b82f5"
                      activeDot={{ r: 8 }}
                      legendType="circle"
                      connectNulls={true}
                      isAnimationActive={!ogMode}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          )}

          {trendsExist && (
            <ResponsiveContainer
              width="100%"
              height={stocksExist ? "50%" : "100%"}
            >
              <LineChart
                width={500}
                height="100%"
                data={graphLineData}
                margin={{
                  top: 0,
                  right: !ogMode ? 5 : 0,
                  left: !ogMode ? -10 : 0,
                  bottom: !ogMode ? 5 : 0,
                }}
                syncId={syncId}
              >
                <XAxis hide={ogMode} dataKey="date" />
                <YAxis hide={ogMode} unit="%" />

                <Tooltip
                  content={<PercentageCustomTooltip />}
                  formatter={formatInfo}
                />
                {!ogMode && <Legend />}

                {serverFetchedTrends.map((trendSearch, index) => (
                  <Line
                    key={trendSearch.searchTerm + "-GT"} // GT in case that stocks have the same key
                    name={`GT: ${trendSearch.searchTerm}`}
                    type="monotone"
                    dataKey={`${index}-trend-search-value`}
                    stroke="#34A853"
                    activeDot={{ r: 8 }}
                    connectNulls={true}
                    legendType="circle"
                    isAnimationActive={!ogMode}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </>
      );
    }
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={graphLineData}
          margin={{
            top: 0,
            right: !ogMode ? 5 : 0,
            left: !ogMode ? -10 : 0,
            bottom: !ogMode ? 0 : 0,
          }}
        >
          <XAxis hide={ogMode} dataKey="date" />
          <YAxis hide={ogMode} unit="%" />

          <Tooltip
            content={<PercentageCustomTooltip />}
            formatter={formatInfo}
          />
          {!ogMode && <Legend />}

          {serverFetchedStocks.map((item, index) => {
            return (
              <Line
                key={item.searchTerm + "-stock"}
                name={`$${item.searchTerm.toUpperCase()}`}
                type="monotone"
                dataKey={`${index}-stock-search-value`}
                stroke="#3b82f5"
                activeDot={{ r: 8 }}
                legendType="circle"
                connectNulls={true}
                isAnimationActive={!ogMode}
              />
            );
          })}

          {serverFetchedTrends.map((trendSearch, index) => (
            <Line
              key={trendSearch.searchTerm + "-GT"} // GT in case that stocks have the same key
              name={`GT: ${trendSearch.searchTerm}`}
              type="monotone"
              dataKey={`${index}-trend-search-value`}
              stroke="#34A853"
              activeDot={{ r: 8 }}
              connectNulls={true}
              legendType="circle"
              isAnimationActive={!ogMode}
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
            <a
              className="underline ml-0"
              href="https://github.com/gabenunez/StockvsTrend-v2/issues"
              target="_blank"
            >
              {" "}
              Add an issue
            </a>
          </p>
        </div>
      </section>
    );
  }
}
