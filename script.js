// Array to store submitted projects
const projects = [];

// Object to track user votes locally
const userVotes = {};

// Function to validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Function to show the bocadillo
function showBocadillo(message) {
    const bocadillo = document.getElementById('bocadillo');
    bocadillo.innerText = message;
    bocadillo.style.display = 'block';

    setTimeout(() => {
        bocadillo.style.display = 'none';
    }, 4000); // Display the bocadillo for 4 seconds
}

// Function to submit a project
function submitProject() {
    const projectLink = document.getElementById('project-link').value.trim();

    if (!projectLink) {
        showBocadillo("Hey, don't leave it empty!");
        return;
    }

    if (!isValidUrl(projectLink)) {
        showBocadillo("Invalid URL! Try again.");
        return;
    }

    // Check for duplicate submissions
    const existingProject = projects.find(
        (project) => project.link.toLowerCase() === projectLink.toLowerCase()
    );

    if (existingProject) {
        showBocadillo("This one's already in the system!");
        return;
    }

    // Add the project and show confirmation
    projects.push({ link: projectLink, positiveVotes: 0, negativeVotes: 0 });
    userVotes[projectLink] = false; // Initialize as not voted
    document.getElementById('project-link').value = ''; // Clear input field
    showBocadillo("URL submitted! Drunkard AI is analyzing...");

    // Update the voting list dynamically
    renderProjects();
}

// Function to handle positive votes
function votePositive(index) {
    const project = projects[index];

    if (userVotes[project.link]) {
        showBocadillo("You've already voted on this project!");
        return;
    }

    projects[index].positiveVotes += 1; // Increment positive vote count
    userVotes[project.link] = true; // Mark as voted
    renderProjects(); // Re-render the project list
}

// Function to handle negative votes
function voteNegative(index) {
    const project = projects[index];

    if (userVotes[project.link]) {
        showBocadillo("You've already voted on this project!");
        return;
    }

    projects[index].negativeVotes += 1; // Increment negative vote count
    userVotes[project.link] = true; // Mark as voted
    renderProjects(); // Re-render the project list
}

// Function to render projects dynamically
function renderProjects() {
    const container = document.getElementById('voting-container');
    container.innerHTML = ''; // Clear existing content

    // Sort projects by total votes (positive - negative)
    projects
        .sort((a, b) => (b.positiveVotes - b.negativeVotes) - (a.positiveVotes - a.negativeVotes))
        .forEach((project, index) => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'vote-item';
            projectDiv.innerHTML = `
                <span>
                    <a href="${project.link}" target="_blank">${project.link}</a>
                    <br>
                    💎 Positive Votes: ${project.positiveVotes} | 🔥 Negative Votes: ${project.negativeVotes}
                </span>
                <div>
                    <button onclick="votePositive(${index})">Vote 💎</button>
                    <button onclick="voteNegative(${index})">Vote 🔥</button>
                </div>
            `;
            container.appendChild(projectDiv);
        });
}

// Initial render to ensure functionality on load
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
});
