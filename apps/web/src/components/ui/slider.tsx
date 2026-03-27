"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  showTicks = false,
  ticksInterval = 5,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  showTicks?: boolean
  ticksInterval?: number
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  // 计算刻度位置
  const ticks = React.useMemo(() => {
    if (!showTicks) return []
    const tickMarks: number[] = []
    for (let i = min; i <= max; i += ticksInterval) {
      tickMarks.push(i)
    }
    return tickMarks
  }, [showTicks, min, max, ticksInterval])

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      step={step}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>

      {/* 刻度标记 */}
      {showTicks && ticks.length > 0 && (
        <div className="absolute left-0 top-1/2 w-full translate-y-1/2 pointer-events-none">
          {ticks.map((tick) => {
            const percent = ((tick - min) / (max - min)) * 100
            return (
              <div
                key={tick}
                className="absolute top-0 w-px h-2 bg-muted-foreground/30"
                style={{ left: `${percent}%` }}
              />
            )
          })}
        </div>
      )}

      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
