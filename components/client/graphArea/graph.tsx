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
  console.log(stockData);
  const graphLineData = [];

  // Loop over object values
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

  console.log(graphLineData);
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
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              legendType="circle"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
