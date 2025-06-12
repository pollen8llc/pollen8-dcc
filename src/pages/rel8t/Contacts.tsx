
import React, { useState } from "react";
import { Plus, Users, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ContactList from "@/components/rel8t/ContactList";
import { Rel8TNavigation } from "@/components/rel8t/Rel8TNavigation";
import { Shell } from "@/components/layout/Shell";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <Shell>
      <Rel8TNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground mt-2">
              Manage your professional network
            </p>
          </div>

          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">247</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">198</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">31</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "clients" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("clients")}
            >
              Clients
            </Button>
            <Button
              variant={selectedCategory === "partners" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("partners")}
            >
              Partners
            </Button>
            <Button
              variant={selectedCategory === "prospects" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("prospects")}
            >
              Prospects
            </Button>
          </div>
        </div>

        <ContactList />
      </div>
    </Shell>
  );
};

export default Contacts;
