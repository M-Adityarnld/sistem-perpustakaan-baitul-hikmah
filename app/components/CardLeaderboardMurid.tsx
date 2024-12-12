import React from "react";
import { PieChart, Pie, Cell, Label } from "recharts";

interface CardLeaderboardMuridProps {
  name: string;
  kelas: string;
  booksRead: number;
  totalBooksToRead: number;
  className?: string;
}
const CardLeaderboardMurid = ({
  name,
  kelas,
  booksRead,
  totalBooksToRead,
}: CardLeaderboardMuridProps) => {
  // Prepare data for donut chart
  const chartData = [
    { name: "Read", value: booksRead },
    { name: "Unread", value: totalBooksToRead - booksRead },
  ];

  // Color scheme
  const BG_COLORS = ["#055A39", "#064359", "#C50043"];
  const GRADIENT = ["#adf7b6", "#a0ced9", "#ffc09f"];
  const COLORS = ["#a0ced9", "#E5E7EB"];

  return (
    <div
      className={`rounded-lg bg-gradient-to-r from-[#064359] to-[#055A39] border-jewel-green border-2 px-8 py-1 w-full gap-4 flex items-center`}
    >
      {/* Info Section */}
      <div className="flex flex-col justify-center flex-grow ">
        <p className="text-sm text-gray-600">{kelas}</p>
        <h2 className="text-lg font-source-serif leading-none font-bold">
          {name}
        </h2>
      </div>

      {/* Chart Section */}
      <div className="flex-shrink-0">
        <PieChart width={88} height={88}>
          <Pie
            data={chartData}
            cx={44}
            cy={39}
            innerRadius={20}
            outerRadius={38}
            cornerRadius={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              value={`${booksRead}/${totalBooksToRead}`}
              position="center"
              className="text-xs font-bold text-black-custom"
              fill="#101010"
            />
          </Pie>
        </PieChart>
      </div>
    </div>
  );
};

export default CardLeaderboardMurid;