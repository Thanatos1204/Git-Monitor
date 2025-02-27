// components/CommitDetails.tsx
import { CommitDetail } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface CommitDetailsProps {
  commit: CommitDetail | null;
  loading: boolean;
}

export default function CommitDetails({ commit, loading }: CommitDetailsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Commit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!commit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Commit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-10">
            Select a commit to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Commit Details</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="p-4">
            <h3 className="text-lg font-medium leading-6">{commit.commit.message}</h3>
            
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <span className="font-medium">{commit.author?.login || commit.commit.author?.name}</span>
              <span className="mx-2">•</span>
              <span>
                {commit.commit.author?.date
                  ? new Date(commit.commit.author.date).toLocaleString()
                  : "Unknown date"}
              </span>
            </div>

            <div className="flex gap-3 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">+{commit.stats.additions}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">-{commit.stats.deletions}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-muted-foreground mr-2"></div>
                <span className="text-sm">Total {commit.stats.total}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <Tabs defaultValue="files">
              <TabsList className="mb-4">
                <TabsTrigger value="files">Changed Files ({commit.files.length})</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="files" className="space-y-4">
                {commit.files.map((file, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <div className="flex justify-between items-center bg-muted/50 p-2 border-b">
                      <div className="font-mono text-sm truncate max-w-[70%]">
                        {file.filename}
                      </div>
                      <div className="flex space-x-2 text-xs">
                        <Badge variant="outline" className="text-green-600 bg-green-50">
                          +{file.additions}
                        </Badge>
                        <Badge variant="outline" className="text-red-600 bg-red-50">
                          -{file.deletions}
                        </Badge>
                      </div>
                    </div>
                    {file.patch && (
                      <div className="p-2 overflow-x-auto bg-muted/30">
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {file.patch}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Files changed</span>
                    <span className="font-medium">{commit.files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additions</span>
                    <span className="font-medium text-green-600">+{commit.stats.additions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deletions</span>
                    <span className="font-medium text-red-600">-{commit.stats.deletions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total changes</span>
                    <span className="font-medium">{commit.stats.total}</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}