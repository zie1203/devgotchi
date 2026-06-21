// =============================================================== //
// == ENGINE STATES & SPRITE CONFIGURATION MATRIX                 == //
// =============================================================== //
const PET_STATES = {
    NORMAL:  { sprite: "(o_o)",      mood: "Neutral",  speech: "Code... Code...",      ticker: "System status nominal. Ready to design." },
    GRIND:   { sprite: "(⌐■_■)",     mood: "Crushing", speech: "10x ENGINE OVERDRIVE", ticker: "Massive code modifications detected! Spawning hat..." },
    SLACKER: { sprite: "(>_<)",      mood: "Stressed", speech: "P-please commit...",  ticker: "No commits detected in 3+ days. Energy critical!" },
    SLEEP:   { sprite: "(-_-)zZZ",   mood: "Sleeping", speech: "Zzz... git push...",   ticker: "Workspace inactive. Deep sleep mode enabled." }
};

// =============================================================== //
// == CENTRAL STATE ENGINE OBJECT                               == //
// =============================================================== //
const DevGotchi = {
    // Current reactive state data
    state: {
        username: "",
        energy: 100,
        level: 1,
        commitsThisWeek: 0,
        currentMode: "NORMAL" // Links directly to PET_STATES keys
    },

    // UI Cache Registry
    dom: {},

    // Initialization Sequence
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.updateUI();
        this.logSystem("Core engine online. Awaiting data parameters.");
    },

    // Secure DOM Node References
    cacheDOM() {
        this.dom.energy = document.getElementById("stat-energy");
        this.dom.mood = document.getElementById("stat-mood");
        this.dom.level = document.getElementById("stat-level");
        
        this.dom.petSprite = document.getElementById("pet-sprite");
        this.dom.petSpeech = document.getElementById("pet-speech");
        this.dom.statusTicker = document.getElementById("status-ticker");
        this.dom.stateReadout = document.getElementById("engine-state-readout");

        // Interactive Input / Actions
        this.dom.usernameInput = document.getElementById("github-username");
        this.dom.btnConnect = document.getElementById("btn-connect-api");
        this.dom.btnCoffee = document.getElementById("btn-coffee");
        this.dom.btnClean = document.getElementById("btn-clean");
        this.dom.btnSync = document.getElementById("btn-sync");
    },

    // Link Listeners to Interactions
    bindEvents() {
        // Hardware Device Buttons
        this.dom.btnCoffee.addEventListener("click", () => this.handleCoffee());
        this.dom.btnClean.addEventListener("click", () => this.handleRefactor());
        this.dom.btnSync.addEventListener("click", () => this.handleManualSync());

        // Recruiter Simulator Control Overrides
        document.querySelectorAll(".trigger-state").forEach(button => {
            button.addEventListener("click", (e) => {
                const targetState = e.currentTarget.getAttribute("data-state");
                this.simulateState(targetState);
            });
        });

        // GitHub Core Connect Hook
        this.dom.btnConnect.addEventListener("click", () => {
            const val = this.dom.usernameInput.value.trim();
            if (val) this.syncGitHubUser(val);
        });
    },

    // Synchronize Data Layer directly with Virtual Screen Viewports
    updateUI() {
        const currentMatrix = PET_STATES[this.state.currentMode];

        // 1. Render LCD Digital Stats Line
        this.dom.energy.textContent = `⚡ ${this.state.energy}%`;
        this.dom.mood.textContent = `😐 ${currentMatrix.mood}`;
        this.dom.level.textContent = `Lvl ${this.state.level}`;

        // 2. Refresh Main Animation Viewport elements
        this.dom.petSprite.textContent = currentMatrix.sprite;
        this.dom.petSpeech.textContent = currentMatrix.speech;
        this.dom.statusTicker.textContent = currentMatrix.ticker;

        // 3. Output raw code properties directly into Console Log Matrix 
        this.dom.stateReadout.textContent = `Active State: State_${this.state.currentMode} | Energy: ${this.state.energy} | Commits: ${this.state.commitsThisWeek}`;
    },

    // Helper utilities for terminal logs
    logSystem(message) {
        const logScreen = document.querySelector(".log-screen");
        const logLine = document.createElement("div");
        logLine.textContent = `[System]: ${message}`;
        logScreen.insertBefore(logLine, logScreen.firstChild);
    },

    // =============================================================== //
    // == TACTILE CONSOLE DEVICE ACTION MUTATORS                      == //
    // =============================================================== //
    handleCoffee() {
        this.state.energy = Math.min(this.state.energy + 15, 100);
        this.logSystem("Action executed: Fed hot coffee brew (+15% Energy).");
        
        // If they were sleeping, revive them to normal
        if (this.state.currentMode === "SLEEP") {
            this.state.currentMode = "NORMAL";
        }
        
        this.updateUI();
    },

    handleRefactor() {
        this.state.level += 1;
        this.logSystem(`Action executed: Cleaned code smells. Evolution spiked (Lvl ${this.state.level}).`);
        this.updateUI();
    },

    handleManualSync() {
        this.logSystem("Manual network refresh loop triggered via Button C.");
        if (this.state.username) {
            this.syncGitHubUser(this.state.username);
        } else {
            this.logSystem("Sync failed: No trainer account attached yet.");
        }
    },

    // =============================================================== //
    // == RECRUITER MODE SIMULATOR OVERRIDES                        == //
    // =============================================================== //
    simulateState(condition) {
        this.logSystem(`Time Warp Warp activated. Loading scenario: "${condition.toUpperCase()}"`);
        
        switch (condition) {
            case "grind":
                this.state.currentMode = "GRIND";
                this.state.energy = 100;
                this.state.commitsThisWeek = 24;
                break;
            case "healthy":
                this.state.currentMode = "NORMAL";
                this.state.energy = 85;
                this.state.commitsThisWeek = 4;
                break;
            case "slacker":
                this.state.currentMode = "SLACKER";
                this.state.energy = 20;
                this.state.commitsThisWeek = 0;
                break;
        }
        this.updateUI();
    },

   // =============================================================== //
// == GITHUB API LIVE ASYNCHRONOUS CONNECTOR                       == //
// =============================================================== //
    async syncGitHubUser(username) {
        this.state.username = username;
        this.logSystem(`Opening public API pipeline to: @${username}...`);
        this.dom.statusTicker.textContent = "Scanning GitHub grid network...";

        try {
            // Fetch public event metrics without requiring auth tokens
            const response = await fetch(`https://api.github.com/users/${username}/events/public`);
            
            // Handle HTTP status failures cleanly
            if (!response.ok) {
                if (response.status === 404) throw new Error("Trainer profile not found (404).");
                if (response.status === 403) throw new Error("API rate threshold reached. Try later.");
                throw new Error(`Server returned status code: ${response.status}`);
            }

            const events = await response.json();
            
            // Filter the payload down specifically to Git Push events
            const pushEvents = events.filter(evt => evt.type === "PushEvent");
            
            if (pushEvents.length === 0) {
                this.logSystem("Account linked, but zero push metrics exist in public cache.");
                this.state.commitsThisWeek = 0;
                this.state.currentMode = "SLACKER";
                this.state.energy = 25;
                this.updateUI();
                return;
            }

            // Aggregate total commit numbers packed inside recent push events
            let totalCommits = 0;
            pushEvents.forEach(evt => {
                if (evt.payload && evt.payload.commits) {
                    totalCommits += evt.payload.commits.length;
                }
            });

            // Calculate precise timeline variations since the latest push event
            const latestPushTime = new Date(pushEvents[0].created_at);
            const currentTime = new Date();
            const timeDifferenceMs = currentTime - latestPushTime;
            const daysSinceLastCommit = timeDifferenceMs / (1000 * 60 * 60 * 24);

            // Update State Engine properties
            this.state.commitsThisWeek = totalCommits;

            // Central State Machine Evaluation Logic
            if (daysSinceLastCommit >= 3.0) {
                this.state.currentMode = "SLACKER";
                this.state.energy = Math.max(10, this.state.energy - 50); // Severe energy depletion
            } else if (totalCommits >= 10) {
                this.state.currentMode = "GRIND";
                this.state.energy = 100; // Hyper focus spike
            } else {
                this.state.currentMode = "NORMAL";
                this.state.energy = Math.min(100, this.state.energy + 15);
            }

            this.logSystem(`Sync successful! Freshest push: ${daysSinceLastCommit.toFixed(1)} days ago. Found ${totalCommits} commits.`);
            this.updateUI();

        } catch (error) {
            this.logSystem(`API Error: ${error.message}`);
            this.dom.statusTicker.textContent = "Sync failed. Checking debug log console.";
        }
    }
};

// Fire up core machine loops on application document resolution
document.addEventListener("DOMContentLoaded", () => {
    DevGotchi.init();
});