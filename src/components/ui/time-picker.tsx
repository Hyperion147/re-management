"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimePickerProps {
  value?: string // format: "HH:mm" (24h)
  onChange?: (value: string) => void
  label?: string
  error?: string
}

export function TimePicker({ value, onChange, label, error }: TimePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Parse current value
  const selectedHour = value ? parseInt(value.split(":")[0]) : 10
  const selectedMinute = value ? parseInt(value.split(":")[1]) : 0
  
  const isPM = selectedHour >= 12
  const displayHour = selectedHour % 12 || 12
  
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const handleTimeChange = (hour: number, minute: number, ampm: 'AM' | 'PM') => {
    let newHour = hour
    if (ampm === 'PM' && hour < 12) newHour += 12
    if (ampm === 'AM' && hour === 12) newHour = 0
    
    const formattedHour = newHour.toString().padStart(2, '0')
    const formattedMinute = minute.toString().padStart(2, '0')
    onChange?.(`₹{formattedHour}:₹{formattedMinute}`)
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full px-5 py-6 justify-start text-left font-bold rounded-xl border transition-all",
              error ? "border-red-500 bg-red-50/10" : "border-gray-100 bg-gray-50/30",
              !value ? "text-muted-foreground" : "text-foreground text-sm"
            )}
          >
            <Clock className={cn("mr-2 h-4 w-4", error ? "text-red-500" : "text-gray-400")} />
            {value ? `₹{displayHour}:₹{selectedMinute.toString().padStart(2, '0')} ₹{isPM ? 'PM' : 'AM'}` : "Select time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="flex h-64">
            <ScrollArea className="flex-1 border-r border-gray-100">
              <div className="p-2 space-y-1">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Hour</div>
                {hours.map((h) => (
                  <button
                    key={h}
                    onClick={() => handleTimeChange(h, selectedMinute, isPM ? 'PM' : 'AM')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                      displayHour === h ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </ScrollArea>
            <ScrollArea className="flex-1 border-r border-gray-100">
              <div className="p-2 space-y-1">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Min</div>
                {minutes.filter(m => m % 5 === 0).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleTimeChange(displayHour, m, isPM ? 'PM' : 'AM')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                      selectedMinute === m ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    {m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </ScrollArea>
            <div className="flex-none w-20 p-2 space-y-1 bg-gray-50/50">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Period</div>
              {(['AM', 'PM'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handleTimeChange(displayHour, selectedMinute, p)}
                  className={cn(
                    "w-full text-center px-3 py-2 rounded-lg text-xs font-black transition-all",
                    (isPM ? 'PM' : 'AM') === p ? "bg-orange-100 text-orange-700 shadow-sm" : "hover:bg-white text-gray-400"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>}
    </div>
  )
}
