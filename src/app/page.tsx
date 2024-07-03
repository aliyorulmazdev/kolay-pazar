"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { EyeNoneIcon, HandIcon } from "@radix-ui/react-icons";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    results: { term: string; hashData: HashData }[];
    duration: number;
  }>({
    results: [],
    duration: 0,
  });
  const [selectedResult, setSelectedResult] = useState<{
    term: string;
    hashData: HashData;
  } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!input) {
        setSearchResults({ results: [], duration: 0 });
        return;
      }

      try {
        const res = await fetch(
          `https://v1.kolay-pazar.workers.dev/api/search?q=${encodeURIComponent(
            input
          )}`
        );
        if (!res.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await res.json();
        setSearchResults(data);
        setSelectedResult(null); // Clear selected result when fetching new results
      } catch (error) {
        console.error("Error fetching data:", error);
        setSearchResults({ results: [], duration: 0 });
      }
    };

    fetchData();
  }, [input]);

  const handleResultSelect = (result: { term: string; hashData: HashData }) => {
    setSelectedResult(result);
    setDrawerOpen(true); // Open drawer when a result is selected
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setInput(""); // Clear the search input
  };

  const handleClearInput = () => {
    setInput("");
  };

  return (
    <main className="h-screen w-screen grainy">
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <h1 className="text-5xl tracking-tight font-bold">Kolay Pazar⚡</h1>
        <p className="text-zinc-600 text-lg max-w-prose text-center">
          A high-performance API built with Hono, Next.js and Cloudflare. <br />{" "}
          Type a query below and get your results in milliseconds.
        </p>

        <div className="max-w-md w-full">
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search markets..."
              className="placeholder:text-zinc-500"
            />
            <Button className="m-4" onClick={handleClearInput}>
              <EyeNoneIcon />
            </Button>
            <CommandList>
              {searchResults.results.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}

              {searchResults.results.length > 0 && (
                <CommandGroup heading="Results">
                  {searchResults.results.map((result) => (
                    <CommandItem
                      key={result.term}
                      value={result.term}
                      onSelect={() => handleResultSelect(result)}
                    >
                      {result.term}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.results.length > 0 && (
                <>
                  <div className="h-px w-full bg-gray-200 my-4" />
                  <p className="p-2 text-xs text-gray-500">
                    Found {searchResults.results.length} results in{" "}
                    {searchResults.duration.toFixed(0)}ms
                  </p>
                </>
              )}
            </CommandList>
          </Command>
        </div>

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{selectedResult?.term}</DrawerTitle>
              <DrawerClose onClick={handleCloseDrawer} />
            </DrawerHeader>
            <div className="p-4 bg-white rounded-md w-[30rem]">
              {selectedResult && (
                <>
                  <p>
                    <strong>Location:</strong> {selectedResult.hashData.ilce}
                  </p>
                  <p>
                    <strong>Coordinates:</strong>{" "}
                    {selectedResult.hashData.koordinat}
                  </p>
                  <p>
                    <strong>Day:</strong> {selectedResult.hashData.gun}
                  </p>
                  <p>
                    <strong>Market Type:</strong>{" "}
                    {selectedResult.hashData.pazartipi}
                  </p>
                  <p>
                    <strong>Fish:</strong> {selectedResult.hashData.balik}
                  </p>
                </>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  );
}

interface HashData {
  ilce: string;
  koordinat: string;
  gun: string;
  pazartipi: string;
  balik: string;
}
