/**
 * Upgrade Builder Component
 *
 * Handles upgrade form submission and management
 */

class UpgradeBuilder {
    /**
     * Initialize upgrade form
     */
    static initialize() {
        const form = document.getElementById('upgrade-form');
        const submitBtn = document.getElementById('upgrade-form-submit');
        const cancelBtn = document.getElementById('upgrade-form-cancel');

        if (!form || !submitBtn || !cancelBtn) return;

        // Submit handler
        submitBtn.addEventListener('click', () => {
            this.handleSubmit();
        });

        // Cancel handler
        cancelBtn.addEventListener('click', () => {
            this.resetForm();
        });

        // Enter key in inputs
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitBtn.click();
                }
            });
        });
    }

    /**
     * Handle form submission
     */
    static handleSubmit() {
        const form = document.getElementById('upgrade-form');

        // Validate required fields
        if (!this.validateForm()) {
            return;
        }

        const upgradeData = this.getUpgradeDataFromForm();

        const isEditMode = form.dataset.editMode === 'true';
        const editId = form.dataset.editId;

        if (isEditMode && editId) {
            // Update existing upgrade
            creator.updateUpgrade(editId, upgradeData);
        } else {
            // Add new upgrade
            creator.addUpgrade(upgradeData);
        }

        // Reset form
        this.resetForm();
    }

    /**
     * Validate form
     */
    static validateForm() {
        const name = document.getElementById('upgrade-name').value.trim();
        const baseCost = parseFloat(document.getElementById('upgrade-base-cost').value);
        const effect = EffectBuilder.getCurrentEffect();

        if (!name) {
            alert('Please enter an upgrade name');
            return false;
        }

        if (!baseCost || baseCost <= 0) {
            alert('Please enter a valid base cost');
            return false;
        }

        if (!effect) {
            alert('Please select an effect type and value');
            return false;
        }

        return true;
    }

    /**
     * Get upgrade data from form
     */
    static getUpgradeDataFromForm() {
        const name = document.getElementById('upgrade-name').value.trim();
        const description = document.getElementById('upgrade-description').value.trim();
        const icon = document.getElementById('upgrade-icon').value.trim() || '⭐';
        const baseCost = parseFloat(document.getElementById('upgrade-base-cost').value);

        const effect = EffectBuilder.getCurrentEffect();
        const unlockCondition = ConditionBuilder.getCurrentCondition();

        return {
            name,
            description,
            icon,
            baseCost,
            effect,
            unlockCondition
        };
    }

    /**
     * Reset form to default state
     */
    static resetForm() {
        const form = document.getElementById('upgrade-form');

        // Reset form fields
        document.getElementById('upgrade-id').value = '';
        document.getElementById('upgrade-name').value = '';
        document.getElementById('upgrade-description').value = '';
        document.getElementById('upgrade-icon').value = '';
        document.getElementById('upgrade-base-cost').value = '10';

        // Reset effect and condition builders
        EffectBuilder.resetForm();
        ConditionBuilder.resetForm();

        // Reset form state
        form.dataset.editMode = 'false';
        form.dataset.editId = '';
        document.getElementById('upgrade-form-title').textContent = 'Add New Upgrade';
        document.getElementById('upgrade-form-submit').textContent = 'Add Upgrade';
    }
}

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => {
    UpgradeBuilder.initialize();
});
