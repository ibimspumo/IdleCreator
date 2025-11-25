/**
 * Creator Application
 *
 * Main logic for the visual game creator
 */

class CreatorApp {
    constructor() {
        this.template = new GameTemplate();
        this.currentStep = 1;
        this.totalSteps = 4;

        // Initialize with default values
        this.initializeDefaults();

        // Bind methods
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.goToStep = this.goToStep.bind(this);
    }

    /**
     * Initialize the creator after DOM is ready
     */
    initialize() {
        // Load initial data into forms
        this.loadGameInfo();

        // Render initial step
        this.renderStep();
        this.updateProgress();

        // Initialize upgrade list
        this.renderUpgradesList();
    }

    /**
     * Initialize template with sensible defaults
     */
    initializeDefaults() {
        this.template.meta.name = "My Idle Game";
        this.template.meta.description = "An awesome idle game";
        this.template.meta.author = "Creator";
        this.template.meta.version = "1.0.0";

        this.template.resources.primary = {
            name: "Point",
            namePlural: "Points",
            icon: "⭐",
            clickVerb: "Click"
        };

        this.template.theme = {
            primaryColor: "#4a90e2",
            secondaryColor: "#f39c12",
            backgroundColor: "#1a1a2e",
            textColor: "#ffffff"
        };

        this.template.settings.tickRate = 100;
        this.template.settings.saveInterval = 5000;
        this.template.settings.costMultiplier = 1.15;
    }

    /**
     * Navigate to next step
     */
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            // Save current step data before proceeding
            this.saveCurrentStep();

            this.currentStep++;
            this.renderStep();
            this.updateProgress();

            // Load next step data
            this.loadCurrentStep();
        }
    }

    /**
     * Save current step data
     */
    saveCurrentStep() {
        if (this.currentStep === 1) {
            this.saveGameInfo();
        } else if (this.currentStep === 2) {
            this.saveTheme();
        }
    }

    /**
     * Load current step data
     */
    loadCurrentStep() {
        if (this.currentStep === 1) {
            this.loadGameInfo();
        } else if (this.currentStep === 2) {
            this.loadTheme();
        } else if (this.currentStep === 4) {
            this.updateExportSummary();
        }
    }

    /**
     * Load game info into form
     */
    loadGameInfo() {
        const gameNameEl = document.getElementById('game-name');
        const gameDescEl = document.getElementById('game-description');
        const gameAuthorEl = document.getElementById('game-author');
        const resourceNameEl = document.getElementById('resource-name');
        const resourcePluralEl = document.getElementById('resource-plural');
        const resourceIconEl = document.getElementById('resource-icon');
        const clickVerbEl = document.getElementById('click-verb');
        const costMultiplierEl = document.getElementById('cost-multiplier');

        if (gameNameEl) gameNameEl.value = this.template.meta.name;
        if (gameDescEl) gameDescEl.value = this.template.meta.description;
        if (gameAuthorEl) gameAuthorEl.value = this.template.meta.author;
        if (resourceNameEl) resourceNameEl.value = this.template.resources.primary.name;
        if (resourcePluralEl) resourcePluralEl.value = this.template.resources.primary.namePlural;
        if (resourceIconEl) resourceIconEl.value = this.template.resources.primary.icon;
        if (clickVerbEl) clickVerbEl.value = this.template.resources.primary.clickVerb;
        if (costMultiplierEl) costMultiplierEl.value = this.template.settings.costMultiplier;
    }

    /**
     * Load theme into form
     */
    loadTheme() {
        const primaryEl = document.getElementById('primary-color');
        const secondaryEl = document.getElementById('secondary-color');
        const backgroundEl = document.getElementById('background-color');
        const textEl = document.getElementById('text-color');
        const primaryTextEl = document.getElementById('primary-color-text');
        const secondaryTextEl = document.getElementById('secondary-color-text');
        const backgroundTextEl = document.getElementById('background-color-text');
        const textTextEl = document.getElementById('text-color-text');

        if (primaryEl) primaryEl.value = this.template.theme.primaryColor;
        if (secondaryEl) secondaryEl.value = this.template.theme.secondaryColor;
        if (backgroundEl) backgroundEl.value = this.template.theme.backgroundColor;
        if (textEl) textEl.value = this.template.theme.textColor;

        // Update text inputs
        if (primaryTextEl) primaryTextEl.value = this.template.theme.primaryColor;
        if (secondaryTextEl) secondaryTextEl.value = this.template.theme.secondaryColor;
        if (backgroundTextEl) backgroundTextEl.value = this.template.theme.backgroundColor;
        if (textTextEl) textTextEl.value = this.template.theme.textColor;

        // Update preview if ThemeBuilder is available
        if (typeof ThemeBuilder !== 'undefined' && ThemeBuilder.updatePreview) {
            ThemeBuilder.updatePreview();
        }
    }

    /**
     * Update export summary
     */
    updateExportSummary() {
        const nameEl = document.getElementById('summary-name');
        const descEl = document.getElementById('summary-description');
        const authorEl = document.getElementById('summary-author');
        const upgradesEl = document.getElementById('summary-upgrades');
        const resourceEl = document.getElementById('summary-resource');

        if (nameEl) nameEl.textContent = this.template.meta.name;
        if (descEl) descEl.textContent = this.template.meta.description || 'No description';
        if (authorEl) authorEl.textContent = this.template.meta.author;
        if (upgradesEl) upgradesEl.textContent = this.template.upgrades.length;
        if (resourceEl) resourceEl.textContent = `${this.template.resources.primary.namePlural} ${this.template.resources.primary.icon}`;
    }

    /**
     * Navigate to previous step
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderStep();
            this.updateProgress();
        }
    }

    /**
     * Navigate to specific step
     */
    goToStep(step) {
        if (step >= 1 && step <= this.totalSteps) {
            this.currentStep = step;
            this.renderStep();
            this.updateProgress();
        }
    }

    /**
     * Update progress indicator
     */
    updateProgress() {
        const steps = document.querySelectorAll('.step-indicator');
        steps.forEach((step, index) => {
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    /**
     * Render current step
     */
    renderStep() {
        const container = document.getElementById('step-content');

        // Hide all steps
        document.querySelectorAll('.creator-step').forEach(step => {
            step.style.display = 'none';
        });

        // Show current step
        const currentStepEl = document.getElementById(`step-${this.currentStep}`);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
        }

        // Update navigation buttons
        this.updateNavButtons();
    }

    /**
     * Update navigation button states
     */
    updateNavButtons() {
        const prevBtn = document.getElementById('prev-step-btn');
        const nextBtn = document.getElementById('next-step-btn');
        const finishBtn = document.getElementById('finish-btn');

        if (prevBtn) {
            prevBtn.disabled = this.currentStep === 1;
        }

        if (nextBtn) {
            nextBtn.style.display = this.currentStep === this.totalSteps ? 'none' : 'inline-block';
        }

        if (finishBtn) {
            finishBtn.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
        }
    }

    /**
     * Save game info from Step 1
     */
    saveGameInfo() {
        const gameNameEl = document.getElementById('game-name');
        const gameDescEl = document.getElementById('game-description');
        const gameAuthorEl = document.getElementById('game-author');
        const resourceNameEl = document.getElementById('resource-name');
        const resourcePluralEl = document.getElementById('resource-plural');
        const resourceIconEl = document.getElementById('resource-icon');
        const clickVerbEl = document.getElementById('click-verb');
        const costMultiplierEl = document.getElementById('cost-multiplier');

        if (gameNameEl) this.template.meta.name = gameNameEl.value || "My Idle Game";
        if (gameDescEl) this.template.meta.description = gameDescEl.value || "";
        if (gameAuthorEl) this.template.meta.author = gameAuthorEl.value || "Creator";

        if (resourceNameEl) this.template.resources.primary.name = resourceNameEl.value || "Point";
        if (resourcePluralEl) this.template.resources.primary.namePlural = resourcePluralEl.value || "Points";
        if (resourceIconEl) this.template.resources.primary.icon = resourceIconEl.value || "⭐";
        if (clickVerbEl) this.template.resources.primary.clickVerb = clickVerbEl.value || "Click";

        if (costMultiplierEl) this.template.settings.costMultiplier = parseFloat(costMultiplierEl.value) || 1.15;
    }

    /**
     * Save theme from Step 2
     */
    saveTheme() {
        const primaryEl = document.getElementById('primary-color');
        const secondaryEl = document.getElementById('secondary-color');
        const backgroundEl = document.getElementById('background-color');
        const textEl = document.getElementById('text-color');

        if (primaryEl) this.template.theme.primaryColor = primaryEl.value;
        if (secondaryEl) this.template.theme.secondaryColor = secondaryEl.value;
        if (backgroundEl) this.template.theme.backgroundColor = backgroundEl.value;
        if (textEl) this.template.theme.textColor = textEl.value;
    }

    /**
     * Add new upgrade
     */
    addUpgrade(upgradeData) {
        this.template.addUpgrade(upgradeData);
        this.renderUpgradesList();
    }

    /**
     * Remove upgrade
     */
    removeUpgrade(upgradeId) {
        this.template.removeUpgrade(upgradeId);
        this.renderUpgradesList();
    }

    /**
     * Update upgrade
     */
    updateUpgrade(upgradeId, updates) {
        this.template.updateUpgrade(upgradeId, updates);
        this.renderUpgradesList();
    }

    /**
     * Render upgrades list
     */
    renderUpgradesList() {
        const container = document.getElementById('upgrades-list');
        if (!container) return;

        if (this.template.upgrades.length === 0) {
            container.innerHTML = '<p class="empty-state">No upgrades yet. Add your first upgrade!</p>';
            return;
        }

        container.innerHTML = this.template.upgrades.map((upgrade, index) => `
            <div class="upgrade-item" data-upgrade-id="${upgrade.id}">
                <div class="upgrade-item-header">
                    <span class="upgrade-icon">${upgrade.icon}</span>
                    <span class="upgrade-name">${upgrade.name}</span>
                    <div class="upgrade-item-actions">
                        <button class="btn-small" onclick="creator.editUpgrade('${upgrade.id}')">Edit</button>
                        <button class="btn-small btn-danger" onclick="creator.removeUpgrade('${upgrade.id}')">Remove</button>
                    </div>
                </div>
                <div class="upgrade-item-details">
                    <p>${upgrade.description}</p>
                    <p class="meta">Cost: ${upgrade.baseCost} • Effect: ${this.describeEffect(upgrade.effect)}</p>
                    ${upgrade.unlockCondition ? `<p class="meta">Unlocks: ${this.describeCondition(upgrade.unlockCondition)}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    /**
     * Describe effect in human-readable format
     */
    describeEffect(effect) {
        if (!effect) return "None";

        const metadata = effectEngine.getTypeMetadata(effect.type);
        if (!metadata) return effect.type;

        return `${metadata.name} (${effect.value})`;
    }

    /**
     * Describe condition in human-readable format
     */
    describeCondition(condition) {
        if (!condition) return "Always unlocked";
        return conditionEngine.describe(condition);
    }

    /**
     * Edit existing upgrade
     */
    editUpgrade(upgradeId) {
        const upgrade = this.template.upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;

        // Populate upgrade form with existing data
        document.getElementById('upgrade-id').value = upgrade.id;
        document.getElementById('upgrade-name').value = upgrade.name;
        document.getElementById('upgrade-description').value = upgrade.description;
        document.getElementById('upgrade-icon').value = upgrade.icon;
        document.getElementById('upgrade-base-cost').value = upgrade.baseCost;

        // Populate effect
        if (upgrade.effect) {
            document.getElementById('effect-type').value = upgrade.effect.type;
            document.getElementById('effect-value').value = upgrade.effect.value;
        }

        // Populate unlock condition
        if (upgrade.unlockCondition) {
            document.getElementById('unlock-condition-type').value = upgrade.unlockCondition.type;
            document.getElementById('unlock-condition-value').value = upgrade.unlockCondition.value;
        }

        // Show form in edit mode
        document.getElementById('upgrade-form-title').textContent = 'Edit Upgrade';
        document.getElementById('upgrade-form-submit').textContent = 'Update Upgrade';
        document.getElementById('upgrade-form').dataset.editMode = 'true';
        document.getElementById('upgrade-form').dataset.editId = upgradeId;

        // Scroll to form
        document.getElementById('upgrade-form').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Validate template before export
     */
    validateTemplate() {
        const errors = [];

        if (!this.template.meta.name || this.template.meta.name.trim() === '') {
            errors.push("Game name is required");
        }

        if (this.template.upgrades.length === 0) {
            errors.push("At least one upgrade is required");
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Finish and export template
     */
    finish() {
        // Save all data before finishing
        this.saveGameInfo();
        this.saveTheme();

        // Validate template
        const validation = this.validateTemplate();

        if (!validation.valid) {
            alert("Please fix these errors:\n\n" + validation.errors.join("\n"));
            return;
        }

        // Show export dialog
        ImportExportUI.showExportDialog(this.template);
    }

    /**
     * Preview template
     */
    preview() {
        try {
            // Save all current data
            this.saveGameInfo();
            this.saveTheme();

            // Check if there are any upgrades
            if (this.template.upgrades.length === 0) {
                alert('Add at least one upgrade before previewing!');
                return;
            }

            // Validate template
            const validation = this.validateTemplate();
            if (!validation.valid) {
                alert("Cannot preview:\n\n" + validation.errors.join("\n"));
                return;
            }

            // Export and open preview
            const base64 = CompressionUtils.exportTemplate(this.template);
            const url = window.location.origin + window.location.pathname.replace('create.html', 'game.html') + '#game=' + base64;

            // Open in new tab
            const newWindow = window.open(url, '_blank');
            if (!newWindow) {
                alert('Preview blocked! Please allow popups for this site.');
            }
        } catch (error) {
            console.error('Preview error:', error);
            alert('Error creating preview: ' + error.message);
        }
    }

    /**
     * Reset creator
     */
    reset() {
        if (confirm('Reset creator? All changes will be lost.')) {
            this.template = new GameTemplate();
            this.initializeDefaults();
            this.goToStep(1);
            this.renderStep();
            this.renderUpgradesList();
        }
    }
}
