import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { ParentPair } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function ParentPairManager() {
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const { toast } = useToast();

  const { data: pairs, isLoading } = useQuery<ParentPair[]>({
    queryKey: ["/api/parent-pairs"],
  });

  const createPairMutation = useMutation({
    mutationFn: async (data: { phone1: string; phone2: string }) => {
      return apiRequest("POST", "/api/parent-pairs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/parent-pairs"] });
      setPhone1("");
      setPhone2("");
      toast({
        title: "Parent pair created",
        description: "The co-parent relationship has been registered successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create parent pair. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone1 || !phone2) {
      toast({
        title: "Missing information",
        description: "Please enter both phone numbers",
        variant: "destructive",
      });
      return;
    }
    createPairMutation.mutate({ phone1, phone2 });
  };

  return (
    <Card data-testid="card-parent-pair-manager">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Parent Pair Management
        </CardTitle>
        <CardDescription>
          Register co-parent phone numbers to enable message moderation between them
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone1">Parent 1 Phone Number</Label>
              <Input
                id="phone1"
                type="tel"
                placeholder="+1234567890"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                data-testid="input-phone1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone2">Parent 2 Phone Number</Label>
              <Input
                id="phone2"
                type="tel"
                placeholder="+1234567890"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                data-testid="input-phone2"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={createPairMutation.isPending}
            data-testid="button-create-pair"
          >
            <Plus className="h-4 w-4 mr-2" />
            {createPairMutation.isPending ? "Creating..." : "Create Parent Pair"}
          </Button>
        </form>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Registered Pairs ({pairs?.length || 0})</h4>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : pairs && pairs.length > 0 ? (
            <div className="space-y-2">
              {pairs.map((pair) => (
                <div
                  key={pair.id}
                  className="flex items-center justify-between p-3 rounded-md border"
                  data-testid={`pair-item-${pair.id}`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" data-testid="text-pair-phone1">{pair.phone1}</Badge>
                    <span className="text-muted-foreground">↔</span>
                    <Badge variant="outline" data-testid="text-pair-phone2">{pair.phone2}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground" data-testid="text-empty-pairs">
              No parent pairs registered yet. Add one above to get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
