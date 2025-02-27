// lib/github.ts
import { Octokit } from "octokit";

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  async getRepositories() {
    const response = await this.octokit.request("GET /user/repos", {
      per_page: 100,
      sort: "updated",
      affiliation: "collaborator,owner",
    });
    return response.data;
  }

  async getCommits(owner: string, repo: string, perPage = 30) {
    const response = await this.octokit.request("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo,
      per_page: perPage,
    });
    // Transform API response to match our Commit type
    return response.data.map(commit => ({
    sha: commit.sha,
    commit: {
      author: {
        name: commit.commit.author?.name || null,
        email: commit.commit.author?.email || null,
        date: commit.commit.author?.date || null,
      },
      message: commit.commit.message,
    },
    html_url: commit.html_url,
    author: commit.author ? {
      login: commit.author.login,
      avatar_url: commit.author.avatar_url,
    } : null,
  }));
}

  async getCommitDetails(owner: string, repo: string, commitSha: string) {
    const response = await this.octokit.request("GET /repos/{owner}/{repo}/commits/{commit_sha}", {
      owner,
      repo,
      commit_sha: commitSha,
    });
    return response.data;
  }

  async setupWebhook(owner: string, repo: string, webhookUrl: string) {
    const response = await this.octokit.request("POST /repos/{owner}/{repo}/hooks", {
      owner,
      repo,
      active: true,
      events: ["push"],
      config: {
        url: webhookUrl,
        content_type: "json",
      },
    });
    return response.data;
  }
}

export function createGitHubService(accessToken: string) {
  return new GitHubService(accessToken);
}