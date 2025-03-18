import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-sm text-white",
          // Enhanced Recharts component styles for improved readability
          "[&_.recharts-cartesian-axis-tick_text]:fill-gray-300",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-gray-400/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-gray-400",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-none",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-gray-400",
          "[&_.recharts-radial-bar-background-sector]:fill-gray-600",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-gray-600",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-gray-400",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-sector]:outline-none",
          "[&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) =>
              `${prefix} [data-chart=${id}] {\n${colorConfig
                .map(([key, itemConfig]) => {
                  const color =
                    itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
                    itemConfig.color;
                  return color ? `  --color-${key}: ${color};` : "";
                })
                .join("\n")}\n}`
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
      labelFormatter?: (value: any, payload: any[]) => React.ReactNode;
      formatter?: (
        value: any,
        name: string,
        item: any,
        index: number,
        payload: any
      ) => React.ReactNode;
    }
>(
  (
    {
      active,
      payload,
      className,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) return null;
      const [item] = payload;
      const key = labelKey || item?.dataKey || item?.name || "value";
      const itemConfig = getPayloadConfigFromPayload(config, item, key as string);
      const value = label && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;
      if (labelFormatter) {
        return (
          <div className={cn("font-semibold text-base", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }
      if (!value) return null;
      return <div className={cn("font-semibold text-base", labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) return null;

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "min-w-[10rem] bg-gray-800 text-white rounded-lg p-3 shadow-lg",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-2 mt-2">
          {payload.map((item, index) => {
            const key = nameKey || item.name || item.dataKey || "value";
            const itemConfig = getPayloadConfigFromPayload(config, item, key as string);
            const indicatorColor = color || item.payload?.fill || item.color;
            return (
              <div
                key={item.dataKey || index}
                className={cn("flex items-center justify-between", {
                  "items-center": indicator === "dot",
                })}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {!hideIndicator && (
                      <>
                        {itemConfig?.icon ? (
                          <itemConfig.icon />
                        ) : (
                          <div
                            className={cn(
                              "rounded-sm border",
                              {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-dashed border": indicator === "dashed",
                              }
                            )}
                            style={{
                              backgroundColor: indicatorColor,
                              borderColor: indicatorColor,
                            }}
                          />
                        )}
                      </>
                    )}
                    <div className="flex flex-1 justify-between items-center ml-2">
                      <div className="flex flex-col">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-sm font-medium">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value !== undefined && (
                        <span className="font-mono text-lg text-blue-400">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();

    if (!payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = nameKey || item.dataKey || "value";
          const itemConfig = getPayloadConfigFromPayload(config, item, key as string);
          return (
            <div key={item.value} className={cn("flex items-center gap-2")}>
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-sm font-medium text-white">
                {itemConfig?.label || item.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

// Helper function to extract configuration from payload items.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: any,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const innerPayload =
    payload.payload && typeof payload.payload === "object" ? payload.payload : {};

  let configLabelKey = key;

  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (innerPayload && key in innerPayload && typeof innerPayload[key] === "string") {
    configLabelKey = innerPayload[key];
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  getPayloadConfigFromPayload,
};
