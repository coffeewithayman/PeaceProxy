import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import type { Message, ModerationAnalysis } from "@shared/schema";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MessageCardProps {
  message: Message;
}

export function MessageCard({ message }: MessageCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusConfig = {
    approved: {
      icon: CheckCircle2,
      label: "Approved",
      variant: "default" as const,
      borderColor: "border-l-chart-1",
      iconColor: "text-chart-1",
    },
    blocked: {
      icon: XCircle,
      label: "Blocked",
      variant: "destructive" as const,
      borderColor: "border-l-destructive",
      iconColor: "text-destructive",
    },
    pending: {
      icon: Clock,
      label: "Pending",
      variant: "secondary" as const,
      borderColor: "border-l-chart-3",
      iconColor: "text-chart-3",
    },
  };

  const config = statusConfig[message.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  let moderationData: ModerationAnalysis | null = null;
  if (message.moderationResult) {
    try {
      moderationData = JSON.parse(message.moderationResult);
    } catch (e) {
      console.error("Failed to parse moderation result", e);
    }
  }

  return (
    <Card className={`border-l-4 ${config.borderColor}`} data-testid={`card-message-${message.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono text-muted-foreground" data-testid="text-from-phone">
              From: {message.fromPhone}
            </span>
            <span className="text-sm font-mono text-muted-foreground" data-testid="text-to-phone">
              To: {message.toPhone}
            </span>
          </div>
          <span className="text-xs text-muted-foreground" data-testid="text-timestamp">
            {format(new Date(message.createdAt), "PPp")}
          </span>
        </div>
        <Badge variant={config.variant} className="shrink-0" data-testid={`badge-status-${message.status}`}>
          <StatusIcon className={`h-3 w-3 mr-1 ${config.iconColor}`} />
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="font-mono text-sm leading-relaxed" data-testid="text-message-content">
          {message.content}
        </p>
      </CardContent>
      {message.status === "blocked" && message.feedback && moderationData && (
        <CardFooter className="pt-0 flex-col items-start">
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                data-testid="button-toggle-feedback"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-chart-3" />
                  View Moderation Feedback
                </span>
                <span className="text-xs text-muted-foreground">
                  {isOpen ? "Hide" : "Show"}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-3">
              <div className="rounded-md bg-chart-3/10 p-4 space-y-2">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Issues Detected:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {moderationData.issues.map((issue, idx) => (
                      <li key={idx} data-testid={`text-issue-${idx}`}>{issue}</li>
                    ))}
                  </ul>
                </div>
                {moderationData.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Suggestions:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {moderationData.suggestions.map((suggestion, idx) => (
                        <li key={idx} data-testid={`text-suggestion-${idx}`}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">Tone:</span>
                  <span className="text-muted-foreground capitalize" data-testid="text-tone">
                    {moderationData.tone}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="font-semibold">Severity:</span>
                  <Badge
                    variant={
                      moderationData.severity === "high"
                        ? "destructive"
                        : moderationData.severity === "medium"
                        ? "secondary"
                        : "default"
                    }
                    data-testid={`badge-severity-${moderationData.severity}`}
                  >
                    {moderationData.severity}
                  </Badge>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardFooter>
      )}
    </Card>
  );
}
