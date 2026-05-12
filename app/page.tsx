"use client";

import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { TRANSACTION_LIST } from "@/constants/transactionList";
import { Transaction } from "@/types/transaction";
import {
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ArrowDownLeft,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [isExpense, setIsExpense] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState("2026-04-29");
  const [accountSearch, setAccountSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState<"date" | "category" | "account">(
    "date",
  );
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTION_LIST);

  const accounts = ["BCA", "JAGO"];
  const filteredAccounts = accounts.filter((account) =>
    account.toLowerCase().includes(accountSearch.toLowerCase()),
  );

  const categories = ["Food", "Shopping"];
  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatRupiah = (value: string | number) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const number = rawValue.replace(/[^0-9]/g, "");
    setAmount(number);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cek apakah user sedang mengetik di input
      const isTyping = document.activeElement?.tagName === "INPUT";

      // Jika sedang mengetik, abaikan shortcut satu tombol (T, Y)
      // Jika sedang mengetik, abaikan shortcut satu tombol (T, Y) kecuali Tab
      if (
        isTyping &&
        !e.metaKey &&
        !e.ctrlKey &&
        e.key !== "Tab" &&
        e.key !== "Enter"
      ) {
        return;
      }

      // Tab: Circular Navigation
      if (e.key === "Tab") {
        if (!containerRef.current) return;
        const inputs = Array.from(
          containerRef.current.querySelectorAll("input"),
        );
        const currentIndex = inputs.indexOf(
          document.activeElement as HTMLInputElement,
        );

        if (currentIndex !== -1) {
          e.preventDefault();
          let nextIndex;
          if (e.shiftKey) {
            nextIndex = (currentIndex - 1 + inputs.length) % inputs.length;
          } else {
            nextIndex = (currentIndex + 1) % inputs.length;
          }
          inputs[nextIndex].focus();
        }
      }

      if (e.key === "t" || e.key === "T") {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
      } else if (e.key === "y" || e.key === "Y") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setDate(yesterday.toISOString().split("T")[0]);
      } else if (e.key === "Enter") {
        const isAllFilled =
          date.trim() !== "" &&
          accountSearch.trim() !== "" &&
          categorySearch.trim() !== "" &&
          notes.trim() !== "" &&
          amount.trim() !== "";

        if (isAllFilled) {
          alert(
            `Data Submitted!\nDate: ${date}\nAccount: ${accountSearch}\nCategory: ${categorySearch}\nNotes: ${notes}\nAmount: ${amount}`,
          );

          setTransactions([...transactions, {
            type: isExpense ? 'expense': 'income',
            date: date,
            account: accountSearch,
            category: categorySearch,
            notes: notes,
            amount: Number.parseInt(amount)
          }])
          
        } else {
          alert(
            `Incomplete!\n- Date: ${date}\n- Account: ${accountSearch}\n- Category: ${categorySearch}\n- Notes: ${notes}\n- Amount: ${amount}`,
          );
        }
      } else if (e.key === "ArrowLeft") {
        if (!isTyping) {
          const d = new Date(date);
          d.setDate(d.getDate() - 1);
          setDate(d.toISOString().split("T")[0]);
        }
      } else if (e.key === "ArrowRight") {
        if (!isTyping) {
          const d = new Date(date);
          d.setDate(d.getDate() + 1);
          setDate(d.toISOString().split("T")[0]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [date, accountSearch, amount]);

  const displayAmount = formatRupiah(amount);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const total = totalIncome - totalExpense;

  const groupedTransactions = filteredTransactions.reduce(
    (acc, t) => {
      let key = "";
      if (groupBy === "date") {
        const d = /^\d+$/.test(t.date) ? new Date(Number(t.date)) : new Date(t.date);
        const today = new Date();
        if (d.toDateString() === today.toDateString()) {
          key = "Today";
        } else {
          key = d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      } else if (groupBy === "category") {
        key = t.category;
      } else if (groupBy === "account") {
        key = t.account;
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(t);
      return acc;
    },
    {} as Record<string, Transaction[]>,
  );

  return (
    <main className="flex flex-1 w-full max-w-214 flex-col items-center bg-bg-default border border-border-default border-t-0">
      <div className="flex gap-1 px-3 py-2 w-full border-b border-border-default bg-bg-surface">
        {isExpense ? (
          <Badge variant="expense" onClick={() => setIsExpense(!isExpense)}>
            Expense
          </Badge>
        ) : (
          <Badge variant="income" onClick={() => setIsExpense(!isExpense)}>
            Income
          </Badge>
        )}

        <Separator orientation="vertical" />

        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-1">
            <Kbd>Tab</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">
              Next
            </p>
          </div>

          <div className="flex justify-center items-center gap-1">
            <Kbd>Enter</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">
              Submit
            </p>
          </div>
        </div>

        <Separator orientation="vertical" />

        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-1">
            <Kbd>⌘←</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">
              Back
            </p>
          </div>

          <div className="flex justify-center items-center gap-1">
            <Kbd>⌘→</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">
              Fwd
            </p>
          </div>
        </div>

        <Separator orientation="vertical" />

        <div className="flex justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-1">
            <Kbd>T</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">
              Today
            </p>
          </div>

          <div className="flex justify-center items-center gap-1">
            <Kbd>Y</Kbd>
            <p className="font-geist-mono text-text-muted text-[0.625rem] font-normal">
              Yesterday
            </p>
          </div>
        </div>
      </div>

      {/* INPUT */}
      <div
        ref={containerRef}
        className="grid grid-cols-5 w-full border-b border-border-default bg-bg-surface"
      >
        {/* DATE */}
        <div className="group flex flex-col p-3 bg-white border-r border-border-default focus-within:border-b-2 focus-within:border-b-black transition-all focus-within:bg-bg-edit relative">
          <label className="font-geist-mono text-[0.625rem] font-normal group-focus-within:text-text-default text-text-muted uppercase mb-1">
            Date
          </label>
          <div className="flex items-center justify-between text-sm font-medium font-geist-mono">
            <span>{formatDate(date)}</span>
            <Calendar className="h-4 w-4 text-text-muted group-focus-within:text-text-default transition-colors" />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="absolute -bottom-3 inset-2 opacity-0  cursor-pointer"
          />
        </div>

        {/* ACCOUNT */}
        <div className="group flex flex-col p-3 bg-white border-r border-border-default focus-within:border-b-2 focus-within:border-b-black transition-all focus-within:bg-bg-edit relative">
          <label className="font-geist-mono text-[0.625rem] font-normal group-focus-within:text-text-default text-text-muted uppercase mb-1">
            Account
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search to select"
              value={accountSearch}
              onChange={(e) => setAccountSearch(e.target.value)}
              className="peer bg-transparent border-none outline-none text-sm font-medium p-0 focus:ring-0 placeholder-transparent focus:placeholder-text-muted font-geist-mono placeholder:font-geist-mono w-full"
            />
            <span className="absolute left-0 top-0 text-text-muted pointer-events-none peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden font-geist-mono text-sm font-medium">
              -
            </span>
          </div>

          {/* Dropdown Popover */}
          <div className="hidden group-focus-within:block absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-border-default rounded-xl shadow-lg z-10">
            {filteredAccounts.map((account, index) => (
              <div
                key={account}
                className={`flex items-center p-3 hover:bg-bg-edit cursor-pointer ${index > 0 ? "border-t border-border-default" : ""}`}
                onMouseDown={() => setAccountSearch(account)}
              >
                <span className="text-text-muted mr-3 font-geist-mono text-sm">
                  {index + 1}
                </span>
                <span className="text-text-default font-medium text-sm font-geist-mono">
                  {account}
                </span>
              </div>
            ))}
            {filteredAccounts.length === 0 && (
              <div className="p-3 text-sm text-text-muted text-center">
                No results
              </div>
            )}
          </div>
        </div>

        {/* CATEGORY */}
        <div className="group flex flex-col p-3 bg-white border-r border-border-default focus-within:border-b-2 focus-within:border-b-black transition-all focus-within:bg-bg-edit relative">
          <label className="font-geist-mono text-[0.625rem] font-normal group-focus-within:text-text-default text-text-muted uppercase mb-1">
            Category
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search to select"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="peer bg-transparent border-none outline-none text-sm font-medium p-0 focus:ring-0 placeholder-transparent focus:placeholder-text-muted font-geist-mono placeholder:font-geist-mono w-full"
            />
            <span className="absolute left-0 top-0 text-text-muted pointer-events-none peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden font-geist-mono text-sm font-medium">
              -
            </span>
          </div>

          {/* Dropdown Popover */}
          <div className="hidden group-focus-within:block absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-border-default rounded-xl shadow-lg z-10">
            {filteredCategories.map((category, index) => (
              <div
                key={category}
                className={`flex items-center p-3 hover:bg-bg-edit cursor-pointer ${index > 0 ? "border-t border-border-default" : ""}`}
                onMouseDown={() => setCategorySearch(category)}
              >
                <span className="text-text-muted mr-3 font-geist-mono text-sm">
                  {index + 1}
                </span>
                <span className="text-text-default font-medium text-sm font-geist-mono">
                  {category}
                </span>
              </div>
            ))}
            {filteredCategories.length === 0 && (
              <div className="p-3 text-sm text-text-muted text-center">
                No results
              </div>
            )}
          </div>
        </div>

        {/* NOTE */}
        <div className="group flex flex-col p-3 bg-white border-r border-border-default focus-within:border-b-2 focus-within:border-b-black transition-all focus-within:bg-bg-edit">
          <label className="font-geist-mono text-[0.625rem] font-normal group-focus-within:text-text-default text-text-muted uppercase mb-1">
            Note
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Add Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="peer bg-transparent border-none outline-none text-sm font-medium p-0 focus:ring-0 placeholder-transparent focus:placeholder-text-muted font-geist-mono placeholder:font-geist-mono w-full"
            />
            <span className="absolute left-0 top-0 text-text-muted pointer-events-none peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden font-geist-mono text-sm font-medium">
              -
            </span>
          </div>
        </div>

        {/* AMOUNT */}
        <div className="group flex flex-col p-3 bg-white border-r border-border-default focus-within:border-b-2 focus-within:border-b-black transition-all focus-within:bg-bg-edit">
          <label className="font-geist-mono text-[0.625rem] font-normal group-focus-within:text-text-default text-text-muted uppercase mb-1">
            Amount
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Add Amount"
              value={displayAmount}
              onChange={handleAmountChange}
              className="peer bg-transparent border-none outline-none text-sm font-medium p-0 focus:ring-0 placeholder-transparent focus:placeholder-text-muted font-geist-mono placeholder:font-geist-mono w-full"
            />
            <span className="absolute left-0 top-0 text-text-muted pointer-events-none peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden font-geist-mono text-sm font-medium">
              -
            </span>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 w-full border-b border-border-default bg-bg-surface">
        {/* EXPENSE */}
        <div className="flex justify-between items-center p-3 border-r border-border-default">
          <div className="flex items-center gap-1">
            <span className="font-geist-mono text-[0.625rem] font-medium text-text-secondary uppercase">
              Expense
            </span>
            <ArrowUpRight className="h-2.5 w-2.5 text-text-secondary" />
          </div>
          <span className="font-geist-mono text-xs font-medium text-danger-default">
            {formatRupiah(totalExpense)}
          </span>
        </div>

        {/* INCOME */}
        <div className="flex justify-between items-center p-3 border-r border-border-default">
          <div className="flex items-center gap-1">
            <span className="font-geist-mono text-[0.625rem] font-medium text-text-secondary uppercase">
              Income
            </span>
            <ArrowDownRight className="h-2.5 w-2.5 text-text-secondary" />
          </div>
          <span className="font-geist-mono text-xs font-medium text-success-default">
            {formatRupiah(totalIncome)}
          </span>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center p-3">
          <span className="font-geist-mono text-[0.625rem] font-medium text-text-secondary uppercase">
            Total
          </span>
          <span
            className={`font-geist-mono text-xs font-medium ${total >= 0 ? "text-success-default" : "text-danger-default"}`}
          >
            {formatRupiah(total)}
          </span>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-col items-center w-full bg-bg-surface">
        <div className="w-full flex justify-between py-2 px-4 bg-bg-surface-alt">
          <div className="flex gap-2">
            <button
              onClick={() => setGroupBy("date")}
              className={`${groupBy === "date" ? "bg-white shadow-sm border border-border-default" : "text-text-secondary hover:text-text-default border border-transparent shadow-sm shadow-transparent"}  px-2 py-1 rounded-full text-xs font-semibold font-geist-sans transition-all`}
            >
              By Date
            </button>
            <button
              onClick={() => setGroupBy("category")}
              className={`${groupBy === "category" ? "bg-white shadow-sm border border-border-default" : "text-text-secondary hover:text-text-default border border-transparent shadow-sm shadow-transparent"}  px-2 py-1 rounded-full text-xs font-semibold font-geist-sans transition-all`}
            >
              By Category
            </button>
            <button
              onClick={() => setGroupBy("account")}
              className={`${groupBy === "account" ? "bg-white shadow-sm border border-border-default" : "text-text-secondary hover:text-text-default border border-transparent shadow-sm shadow-transparent"}  px-2 py-1 rounded-full text-xs font-semibold font-geist-sans transition-all`}
            >
              By Account
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search transaction"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-[0.5px] border-border-default rounded-[0.5rem] pl-8 pr-2 py-1.5 text-[0.625rem] w-40 outline-none font-normal focus:border-black transition-colors placeholder:font-sans"
            />
            <Search className="absolute left-2.5 top-[0.45rem] h-3.5 w-3.5 text-text-secondary" />
          </div>
        </div>

        {/* TRANSACTION LIST */}
        <div className="w-full px-4 py-2 bg-bg-surface">
          {Object.entries(groupedTransactions).map(([groupKey, items]) => {
            const groupTotal = items.reduce(
              (sum, t) => sum + (t.type === "income" ? t.amount : -t.amount),
              0,
            );

            return (
              <div key={groupKey} className="mb-4">
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="font-geist-sans text-[0.625rem] font-semibold text-text-muted uppercase">
                    {groupKey}
                  </span>
                  <span
                    className={`font-geist-mono text-xs font-medium ${groupTotal >= 0 ? "text-success-default" : "text-danger-default"}`}
                  >
                    {groupTotal >= 0 ? "+" : ""}
                    {formatRupiah(groupTotal)}
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map((t, index) => (
                    <div
                      key={index}
                      className="bg-white px-3 py-2 rounded-lg border border-border-default flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">

                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${t.type === "income" ? "bg-success-bg" : "bg-danger-bg"}`}
                        >
                          {t.type === "income" ? (
                            <ArrowDownRight
                              className="h-4 w-4 text-success-default"
                              strokeWidth={2}
                            />
                          ) : (
                            <ArrowUpRight
                              className="h-4 w-4 text-danger-default"
                              strokeWidth={2}
                            />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1 text-xs font-geist-mono mb-0.5">
                            <span className="text-account-blue-hover font-medium">
                              {t.account}
                            </span>
                            <span className="text-border-default">/</span>
                            <span className="text-text-muted font-geist-mono font-semibold flex items-center gap-1">
                              {t.category === "Gift" && <span>🎁</span>}
                              {t.category}
                            </span>
                          </div>
                          <div className="text-sm font-geist-sans font-medium text-text-default">
                            {t.notes}
                          </div>
                        </div>
                      </div>
                      <div className="font-geist-mono text-sm font-medium text-text-default">
                        {formatRupiah(t.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
