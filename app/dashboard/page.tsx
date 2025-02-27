// app/dashboard/page.tsx
'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import RepositorySelector from "@/components/RepositorySelector";
import CommitList from "@/components/CommitList";
import CommitDetails from "@/components/CommitDetails";
import RealtimeUpdates from "@/components/RealtimeUpdates";
import { Repository, Commit, CommitDetail, PushEvent } from "@/lib/types";
import { createGitHubService } from "@/lib/github";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<CommitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commitLoading, setCommitLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [realtimeCommits, setRealtimeCommits] = useState<PushEvent[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.accessToken) {
      const fetchRepositories = async () => {
        try {
          const github = createGitHubService(session.accessToken as string);
          const repos = await github.getRepositories();
          setRepositories(repos);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching repositories:", error);
          setLoading(false);
        }
      };

      fetchRepositories();
    }
  }, [session]);

  useEffect(() => {
    if (selectedRepo && session?.accessToken) {
      const fetchCommits = async () => {
        try {
          setCommitLoading(true);
          const github = createGitHubService(session.accessToken as string);
          const repoCommits = await github.getCommits(
            selectedRepo.owner.login,
            selectedRepo.name
          );
          setCommits(repoCommits);
          setCommitLoading(false);
        } catch (error) {
          console.error("Error fetching commits:", error);
          setCommitLoading(false);
        }
      };

      fetchCommits();
    }
  }, [selectedRepo, session]);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    
    socket.on("push", (pushEvent: PushEvent) => {
      setRealtimeCommits((prev) => [pushEvent, ...prev]);
      
      if (selectedRepo && 
          pushEvent.repository.full_name === selectedRepo.full_name) {
        if (session?.accessToken) {
          const github = createGitHubService(session.accessToken as string);
          github.getCommits(selectedRepo.owner.login, selectedRepo.name)
            .then(repoCommits => {
              setCommits(repoCommits);
            })
            .catch(error => {
              console.error("Error fetching commits:", error);
            });
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedRepo, session]);

  const handleSelectRepository = (repo: Repository) => {
    setSelectedRepo(repo);
    setSelectedCommit(null);
  };

  const handleSelectCommit = async (commit: Commit) => {
    if (session?.accessToken && selectedRepo) {
      try {
        setDetailLoading(true);
        const github = createGitHubService(session.accessToken as string);
        const commitDetails = await github.getCommitDetails(
          selectedRepo?.owner.login,
          selectedRepo.name,
          commit.sha
        );
        setSelectedCommit(commitDetails);
        setDetailLoading(false);
      } catch (error) {
        console.error("Error fetching commit details:", error);
        setDetailLoading(false);
      }
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading your repositories...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">GitHub Repository Dashboard</h1>
        {selectedRepo && (
          <div className="text-muted-foreground">
            Currently viewing: <span className="font-medium">{selectedRepo.full_name}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <RepositorySelector 
            repositories={repositories} 
            selectedRepo={selectedRepo}
            onSelectRepository={handleSelectRepository}
          />
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CommitList 
              commits={commits} 
              selectedCommit={selectedCommit}
              onSelectCommit={handleSelectCommit}
              loading={commitLoading}
            />
            
            <CommitDetails 
              commit={selectedCommit}
              loading={detailLoading}
            />
          </div>
          
          <RealtimeUpdates realtimeCommits={realtimeCommits} />
        </div>
      </div>
    </div>
  );
}