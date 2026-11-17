"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CropEvaluation } from "@/lib/types";
import { cropName, statusLabel } from "@/lib/i18n";
import { useT } from "@/lib/useT";

const statusOrder = ["optimal", "acceptable", "marginal", "unsuitable", "missing", "unreliable"] as const;

const statusColors: Record<(typeof statusOrder)[number], string> = {
  optimal: "#39512f",
  acceptable: "#7f9f6d",
  marginal: "#d9a13b",
  unsuitable: "#c2634e",
  missing: "#d6d3cd",
  unreliable: "#e5c96a",
};

export function CropStatusChart({ evaluations }: { evaluations: CropEvaluation[] }) {
  const { lang, t } = useT();
  const data = evaluations.map((e) => {
    const row: Record<string, string | number> = { crop: cropName(lang, e.cropId) };
    for (const status of statusOrder) {
      row[status] = e.parameterAssessments.filter((a) => a.status === status).length;
    }
    return row;
  });
  const activeStatuses = statusOrder.filter((s) => data.some((row) => Number(row[s]) > 0));

  return (
    <div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
            <CartesianGrid horizontal={false} stroke="#ece6d8" />
            <XAxis
              type="number"
              domain={[0, 6]}
              allowDecimals={false}
              tick={{ fill: "#5f824d", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="crop"
              width={128}
              tick={{ fill: "#1f3520", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#f6f3ec" }}
              contentStyle={{ borderRadius: 10, border: "1px solid #e4ecdf", fontSize: 12, color: "#1f3520" }}
            />
            {activeStatuses.map((status, index) => (
              <Bar
                key={status}
                dataKey={status}
                stackId="status"
                fill={statusColors[status]}
                name={statusLabel(lang, status)}
                radius={index === activeStatuses.length - 1 ? [0, 4, 4, 0] : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {activeStatuses.map((status) => (
          <span key={status} className="inline-flex items-center gap-1.5 text-[0.7rem] text-brand-700">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: statusColors[status] }}
              aria-hidden
            />
            {statusLabel(lang, status)}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[0.7rem] leading-relaxed text-brand-500">{t("chart.note")}</p>
    </div>
  );
}
