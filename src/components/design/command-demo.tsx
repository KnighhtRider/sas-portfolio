"use client";

import { ArrowUpRight, FolderKanban, Home, Search, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Search aria-hidden="true" />
        Open command palette
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command palette demo"
        description="Design-system command palette states."
      >
        <Command>
          <CommandInput placeholder="Search routes and actions..." aria-label="Search commands" />
          <CommandList>
            <CommandEmpty>No command found.</CommandEmpty>
            <CommandGroup heading="Navigate">
              <CommandItem onSelect={() => setOpen(false)}>
                <Home aria-hidden="true" />
                Overview
                <CommandShortcut>G O</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <FolderKanban aria-hidden="true" />
                Projects
                <CommandShortcut>G P</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => setOpen(false)}>
                <ArrowUpRight aria-hidden="true" />
                Open GitHub
                <CommandShortcut>↗</CommandShortcut>
              </CommandItem>
              <CommandItem disabled>
                <Settings aria-hidden="true" />
                Settings
                <CommandShortcut>Disabled</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
