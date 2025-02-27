// components/RepositorySelector.tsx
import { Repository } from "@/lib/types";
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface RepositorySelectorProps {
  repositories: Repository[];
  selectedRepo: Repository | null;
  onSelectRepository: (repo: Repository) => void;
}

export default function RepositorySelector({
  repositories,
  selectedRepo,
  onSelectRepository,
}: RepositorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepos = repositories.filter((repo) =>
    repo.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Repositories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="search"
          placeholder="Search repositories..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-2">
            {filteredRepos.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No repositories found</p>
            ) : (
              filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  className={`p-3 rounded-md cursor-pointer border hover:border-primary transition-colors ${
                    selectedRepo?.id === repo.id 
                      ? "bg-primary/5 border-primary" 
                      : "border-border"
                  }`}
                  onClick={() => onSelectRepository(repo)}
                >
                  <div className="font-medium">{repo.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{repo.owner.login}</span>
                    <Badge variant="outline" className="text-xs">Repo</Badge>
                  </div>
                  {repo.description && (
                    <p className="text-sm text-muted-foreground mt-2 truncate">
                      {repo.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}