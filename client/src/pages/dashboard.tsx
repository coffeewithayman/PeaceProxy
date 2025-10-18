import { useQuery } from "@tanstack/react-query";
import type { Message } from "@shared/schema";
import { MessageCard } from "@/components/message-card";
import { StatsCard } from "@/components/stats-card";
import { Shield, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const stats = {
    total: messages?.length || 0,
    approved: messages?.filter((m) => m.status === "approved").length || 0,
    blocked: messages?.filter((m) => m.status === "blocked").length || 0,
    pending: messages?.filter((m) => m.status === "pending").length || 0,
  };

  const blockedPercentage =
    stats.total > 0 ? Math.round((stats.blocked / stats.total) * 100) : 0;

  const filteredMessages = (filter: string) => {
    if (filter === "all") return messages || [];
    return messages?.filter((m) => m.status === filter) || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-app-title">Co-Parent Message Moderator</h1>
              <p className="text-sm text-muted-foreground" data-testid="text-app-subtitle">
                AI-powered communication moderation
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Messages"
            value={stats.total}
            description="All messages processed"
            icon={MessageSquare}
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            description="Messages delivered"
            icon={CheckCircle}
          />
          <StatsCard
            title="Blocked"
            value={stats.blocked}
            description="Messages filtered"
            icon={XCircle}
          />
          <StatsCard
            title="Block Rate"
            value={`${blockedPercentage}%`}
            description="Moderation effectiveness"
            icon={Shield}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4" data-testid="text-activity-header">Message Activity</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4" data-testid="tabs-filter">
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="approved" data-testid="tab-approved">Approved</TabsTrigger>
              <TabsTrigger value="blocked" data-testid="tab-blocked">Blocked</TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">Pending</TabsTrigger>
            </TabsList>

            {["all", "approved", "blocked", "pending"].map((filter) => (
              <TabsContent key={filter} value={filter} className="mt-4 space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-6">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-20 w-full" />
                      </Card>
                    ))}
                  </div>
                ) : filteredMessages(filter).length === 0 ? (
                  <Card className="p-12">
                    <div className="text-center">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-state-title">
                        No {filter !== "all" ? filter : ""} messages yet
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-empty-state-description">
                        {filter === "all"
                          ? "Messages will appear here when they are received via SMS"
                          : `No ${filter} messages to display`}
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages(filter).map((message) => (
                      <MessageCard key={message.id} message={message} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
