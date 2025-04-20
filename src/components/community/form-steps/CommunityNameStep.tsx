
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CommunityNameStep({ form, onNext, onPrev }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Community Name</h2>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Name*</FormLabel>
            <FormControl>
              <Input placeholder="Enter your community name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-8 flex justify-between">
        <span />
        <Button
          onClick={async () => {
            const valid = await form.trigger("name");
            if (valid) onNext();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
