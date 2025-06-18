/** @format */
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  type: 'User' | 'Organization';
}

function isGitHubUser(value: unknown): value is GitHubUser {
  if (typeof value !== 'object' || value === null) return false;
  
  const user = value as Record<string, unknown>;
  
  return (
    typeof user.login === 'string' &&
    typeof user.id === 'number' &&
    typeof user.avatar_url === 'string' &&
    typeof user.gravatar_id === 'string' &&
    typeof user.url === 'string' &&
    typeof user.html_url === 'string' &&
    (user.type === 'User' || user.type === 'Organization')
  );
}

export async function searchGithubUsers(
  email: string,
  token?: string
): Promise<GitHubUser | null> {
  try {
    const headers = new Headers({
      Accept: 'application/vnd.github+json',
    });
    
    if (token) headers.set('Authorization', `Bearer ${token}`);
    
    const response = await fetch(
      `https://api.github.com/search/users?q=${encodeURIComponent(
        email
      )}+in:email`,
      {headers}
    );
    
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    
    const data = await response.json();
    const items = data?.['items'] || [];
    
    if (items.length !== 1) return null;
    
    const user = items[0];
    return isGitHubUser(user) ? user : null;
  } catch (error) {
    console.error('GitHub user search failed:', error);
    return null;
  }
}
