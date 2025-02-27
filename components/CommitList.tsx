// components/CommitList.tsx
import { Commit, CommitDetail } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CommitListProps {
  commits: Commit[];
  selectedCommit: CommitDetail | null;
  onSelectCommit: (commit: Commit) => void;
  loading: boolean;
}

export default function CommitList({
  commits,
  selectedCommit,
  onSelectCommit,
  loading
}: CommitListProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Commits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (commits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Commits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-10">No commits found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Commits</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-400px)]">
          {commits.map((commit) => (
            <div
              key={commit.sha}
              className={`p-4 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedCommit?.sha === commit.sha ? "bg-primary/5" : ""
              }`}
              onClick={() => onSelectCommit(commit)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 rounded-full">
                  {commit.author?.avatar_url ? (
                    <img src={commit.author.avatar_url} alt="Author avatar" />
                  ) : (
                    <div className="bg-primary/10 h-full w-full flex items-center justify-center text-xs">
                      {(commit.author?.login || commit.commit.author?.name || "?")[0].toUpperCase()}
                    </div>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{commit.commit.message}</div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span className="font-medium">
                      {commit.author?.login || commit.commit.author?.name}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      {commit.commit.author?.date && formatDistanceToNow(
                        new Date(commit.commit.author.date),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {commit.sha.substring(0, 7)}
                </Badge>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}