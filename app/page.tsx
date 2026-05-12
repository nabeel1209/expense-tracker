'use client'

import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function Home() {
  const [isExpense, setIsExpense] = useState(true);
  return (
    <main className="flex flex-1 w-full max-w-214 flex-col items-center bg-bg-default border border-border-default border-t-0">

      <div className="flex gap-1 px-3 py-2 w-full border-b border-border-default bg-bg-surface">
        {isExpense ? 
          (<Badge variant='expense' onClick={() => setIsExpense(!isExpense)}>Expense</Badge>) : 
          (<Badge variant='income' onClick={() => setIsExpense(!isExpense)}>Income</Badge>)
        }

        <Separator orientation="vertical" />

        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-1">
            <Kbd>Tab</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">Next</p>
          </div>

          <div className="flex justify-center items-center gap-1">
            <Kbd>Enter</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">Submit</p>
          </div>
        </div>

        <Separator orientation="vertical" />
        
        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-1">
            <Kbd>⌘←</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">Back</p>
          </div>

          <div className="flex justify-center items-center gap-1">
            <Kbd>⌘→</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">Fwd</p>
          </div>
        </div>

        <Separator orientation="vertical" />

        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-1">
            <Kbd>T</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">Today</p>
          </div>

          <div className="flex justify-center items-center gap-1">
            <Kbd>Y</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">Yesterday</p>
          </div>
        </div>
      </div>

      <div>

      </div>

      <div>

      </div>

      <div>

      </div>

      <div>

      </div>
    </main>
  );
}
