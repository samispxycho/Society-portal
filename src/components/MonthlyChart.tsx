"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function MonthlyChart({ data }: any) {
  return (
    <div className="w-full h-full">

      <ResponsiveContainer>

        <BarChart
          data={data}
          margin={{ top: 25, right: 10, left: 0, bottom: 0 }}
        >

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          {/* Changed color here */}
          <Bar dataKey="total" fill="#16a34a" radius={[6, 6, 0, 0]} />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}