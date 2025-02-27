// lib/types.ts
export interface Repository {
    id: number | null;
    name: string;
    full_name: string | null;
    owner: {
      login: string;
    };
    description: string | null;
    html_url: string | null;
    updated_at: string | null;
  }
  
  export interface Commit {
    sha: string;
    commit: {
      author: {
        name: string | null;
        email: string | null;
        date: string | null;
      };
      message: string;
    };
    html_url: string;
    author: {
      login: string;
      avatar_url: string;
    } | null;
  }
  
  export interface CommitDetail extends Commit {
    files: Array<{
      filename: string;
      status: string;
      additions: number;
      deletions: number;
      changes: number;
      patch?: string;
    }>;
    stats: {
      additions: number;
      deletions: number;
      total: number;
    };
  }
  
  export interface PushEvent {
    repository: {
      id: number;
      name: string;
      full_name: string;
      owner: string;
    };
    branch: string;
    commits: Array<{
      id: string;
      message: string;
      timestamp: string;
      url: string;
      author: {
        name: string;
        email: string;
      };
      added: string[];
      removed: string[];
      modified: string[];
    }>;
  }