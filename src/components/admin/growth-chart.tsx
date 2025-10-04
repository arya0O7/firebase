"use client"

import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { ChartTooltipContent, ChartContainer, ChartConfig, ChartTooltip } from "@/components/ui/chart"

interface GrowthChartProps {
    data: { month: string; signups: number }[];
}

const chartConfig = {
    signups: {
      label: "Store Sign-ups",
      color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

export function GrowthChart({ data }: GrowthChartProps) {
  return (
    <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="signups" fill="var(--color-signups)" radius={4} />
            </BarChart>
        </ChartContainer>
    </div>
  )
}
