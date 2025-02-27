// components/RealtimeUpdates.tsx
import { PushEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RealtimeUpdatesProps {
  realtimeCommits: PushEvent[];
}

export default function RealtimeUpdates({ realtimeCommits }: RealtimeUpdatesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Real-time Updates</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {realtimeCommits.length === 0 ? (
          <div className="text-muted-foreground text-center py-10">
            No real-time updates yet. They will appear here when they occur.
          </div>
        ) : (
          <ScrollArea className="h-[350px]">
            <div className="divide-y">
              {realtimeCommits.map((event, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{event.repository.full_name}</h4>
                    <Badge variant="outline">{event.branch}</Badge>
                  </div>
                  
                  <div className="mt-3 space-y-3">
                    {event.commits.map((commit) => (
                      <div key={commit.id} className="bg-muted/20 p-3 rounded-md border">
                        <div className="font-medium truncate">{commit.message}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-muted-foreground">
                            {commit.author.name} · {new Date(commit.timestamp).toLocaleString()}
                          </div>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="outline" className="bg-green-50 text-green-600">
                              +{commit.added.length}
                            </Badge>
                            <Badge variant="outline" className="bg-red-50 text-red-600">
                              -{commit.removed.length}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              ~{commit.modified.length}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}