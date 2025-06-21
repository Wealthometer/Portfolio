// GitHub API Integration
import gsap from 'gsap'; // Import gsap

class GitHubAPI {
    constructor() {
        this.username = 'wealth'; // Replace with actual GitHub username
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    async fetchWithCache(url) {
        const now = Date.now();
        const cached = this.cache.get(url);
        
        if (cached && (now - cached.timestamp) < this.cacheExpiry) {
            return cached.data;
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.cache.set(url, { data, timestamp: now });
            return data;
        } catch (error) {
            console.error('GitHub API Error:', error);
            return null;
        }
    }

    async getUserData() {
        return await this.fetchWithCache(`${this.apiBase}/users/${this.username}`);
    }

    async getRepositories() {
        return await this.fetchWithCache(
            `${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=100`
        );
    }

    async getRepositoryStats(repoName) {
        const [repo, languages, commits] = await Promise.all([
            this.fetchWithCache(`${this.apiBase}/repos/${this.username}/${repoName}`),
            this.fetchWithCache(`${this.apiBase}/repos/${this.username}/${repoName}/languages`),
            this.fetchWithCache(`${this.apiBase}/repos/${this.username}/${repoName}/commits?per_page=1`)
        ]);
        
        return { repo, languages, commits };
    }

    async loadStats() {
        const statsContainer = document.getElementById('github-stats');
        if (!statsContainer) return;
        
        // Show loading state
        statsContainer.innerHTML = this.createLoadingHTML();
        
        try {
            const [userData, repos] = await Promise.all([
                this.getUserData(),
                this.getRepositories()
            ]);
            
            if (!userData || !repos) {
                throw new Error('Failed to fetch GitHub data');
            }
            
            const stats = this.calculateStats(userData, repos);
            statsContainer.innerHTML = this.createStatsHTML(stats);
            
            // Animate stats
            this.animateStats();
            
        } catch (error) {
            console.error('Error loading GitHub stats:', error);
            statsContainer.innerHTML = this.createErrorHTML();
        }
    }

    calculateStats(userData, repos) {
        const publicRepos = repos.filter(repo => !repo.private);
        const totalStars = publicRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = publicRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const languages = {};
        
        publicRepos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });
        
        const topLanguages = Object.entries(languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        return {
            publicRepos: publicRepos.length,
            totalStars,
            totalForks,
            followers: userData.followers,
            following: userData.following,
            topLanguages,
            joinDate: new Date(userData.created_at).getFullYear()
        };
    }

    createStatsHTML(stats) {
        return `
            <div class="stat-item">
                <span class="stat-number counter" data-target="${stats.publicRepos}">${stats.publicRepos}</span>
                <span class="stat-label">Public Repositories</span>
            </div>
            <div class="stat-item">
                <span class="stat-number counter" data-target="${stats.totalStars}">${stats.totalStars}</span>
                <span class="stat-label">Total Stars</span>
            </div>
            <div class="stat-item">
                <span class="stat-number counter" data-target="${stats.totalForks}">${stats.totalForks}</span>
                <span class="stat-label">Total Forks</span>
            </div>
            <div class="stat-item">
                <span class="stat-number counter" data-target="${stats.followers}">${stats.followers}</span>
                <span class="stat-label">Followers</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${stats.joinDate}</span>
                <span class="stat-label">Member Since</span>
            </div>
            <div class="stat-item languages-stat">
                <div class="stat-label">Top Languages</div>
                <div class="languages-list">
                    ${stats.topLanguages.map(([lang, count]) => 
                        `<span class="language-tag">${lang} (${count})</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    createLoadingHTML() {
        return `
            <div class="stat-item skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
            </div>
            <div class="stat-item skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
            </div>
            <div class="stat-item skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
            </div>
            <div class="stat-item skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
            </div>
        `;
    }

    createErrorHTML() {
        return `
            <div class="stat-item error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Unable to load GitHub stats</span>
                <button onclick="window.GitHubAPI.loadStats()" class="btn btn-secondary">
                    <i class="fas fa-redo"></i>
                    Retry
                </button>
            </div>
        `;
    }

    async loadProjects() {
        const projectsContainer = document.getElementById('projects-grid');
        if (!projectsContainer) return;
        
        // Show loading state
        projectsContainer.innerHTML = this.createProjectsLoadingHTML();
        
        try {
            const repos = await this.getRepositories();
            if (!repos) throw new Error('Failed to fetch repositories');
            
            // Filter and sort repositories
            const featuredRepos = repos
                .filter(repo => !repo.private && !repo.fork)
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 6);
            
            const projectsHTML = await Promise.all(
                featuredRepos.map(repo => this.createProjectHTML(repo))
            );
            
            projectsContainer.innerHTML = projectsHTML.join('');
            
            // Animate projects
            this.animateProjects();
            
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsContainer.innerHTML = this.createProjectsErrorHTML();
        }
    }

    async createProjectHTML(repo) {
        const languages = await this.fetchWithCache(`${this.apiBase}/repos/${repo.full_name}/languages`);
        const topLanguages = languages ? Object.keys(languages).slice(0, 3) : [];
        
        const category = this.categorizeProject(repo, topLanguages);
        
        return `
            <div class="project-card" data-category="${category}">
                <div class="project-image">
                    <i class="fas fa-code"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${repo.name}</h3>
                    <p class="project-description">
                        ${repo.description || 'No description available'}
                    </p>
                    <div class="project-tech">
                        ${topLanguages.map(lang => 
                            `<span class="tech-tag">${lang}</span>`
                        ).join('')}
                    </div>
                    <div class="project-stats">
                        <span class="stat">
                            <i class="fas fa-star"></i>
                            ${repo.stargazers_count}
                        </span>
                        <span class="stat">
                            <i class="fas fa-code-branch"></i>
                            ${repo.forks_count}
                        </span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i>
                            View Code
                        </a>
                        ${repo.homepage ? `
                            <a href="${repo.homepage}" target="_blank" class="project-link">
                                <i class="fas fa-external-link-alt"></i>
                                Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    categorizeProject(repo, languages) {
        const frontendLanguages = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'React'];
        const backendLanguages = ['Python', 'Node.js', 'Java', 'PHP', 'Go', 'Ruby'];
        
        const hasFrontend = languages.some(lang => frontendLanguages.includes(lang));
        const hasBackend = languages.some(lang => backendLanguages.includes(lang));
        
        if (hasFrontend && hasBackend) return 'fullstack';
        if (hasFrontend) return 'frontend';
        if (hasBackend) return 'backend';
        return 'other';
    }

    createProjectsLoadingHTML() {
        return Array(6).fill(0).map(() => `
            <div class="project-card skeleton">
                <div class="project-image skeleton"></div>
                <div class="project-content">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        `).join('');
    }

    createProjectsErrorHTML() {
        return `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to load projects</h3>
                <p>Please check your internet connection and try again.</p>
                <button onclick="window.GitHubAPI.loadProjects()" class="btn btn-primary">
                    <i class="fas fa-redo"></i>
                    Retry
                </button>
            </div>
        `;
    }

    animateStats() {
        // Animate counters
        gsap.utils.toArray('.counter').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const obj = { value: 0 };
            
            gsap.to(obj, {
                value: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: () => {
                    counter.textContent = Math.floor(obj.value);
                }
            });
        });
        
        // Animate stat items
        gsap.fromTo('.stat-item', 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                stagger: 0.1,
                ease: "power2.out"
            }
        );
    }

    animateProjects() {
        gsap.fromTo('.project-card', 
            { opacity: 0, y: 30, scale: 0.9 },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.6, 
                stagger: 0.1,
                ease: "back.out(1.7)"
            }
        );
    }
}

// Initialize GitHub API
window.GitHubAPI = new GitHubAPI();

// Add CSS for GitHub components
const githubStyles = document.createElement('style');
githubStyles.textContent = `
    .languages-stat {
        grid-column: span 2;
    }
    
    .languages-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    
    .language-tag {
        background: var(--background-primary);
        color: var(--text-primary);
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        border: 1px solid var(--border-color);
    }
    
    .project-stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .project-stats .stat {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .error-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
    
    .error-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #e74c3c;
    }
    
    .error-state h3 {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    @media (max-width: 768px) {
        .languages-stat {
            grid-column: span 1;
        }
    }
`;
document.head.appendChild(githubStyles);
