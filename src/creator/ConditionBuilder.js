/**
 * Condition Builder Component
 *
 * Populates unlock condition dropdown and handles condition selection
 */

class ConditionBuilder {
    /**
     * Populate condition type dropdown
     */
    static populateConditionTypes() {
        const select = document.getElementById('unlock-condition-type');
        if (!select) return;

        const types = conditionEngine.getAvailableTypes();

        // Filter out compound conditions (and, or, not) - too complex for MVP
        const simpleTypes = types.filter(t => !['and', 'or', 'not'].includes(t));

        simpleTypes.forEach(type => {
            const metadata = conditionEngine.getTypeMetadata(type);
            const option = document.createElement('option');
            option.value = type;
            option.textContent = metadata.name;
            select.appendChild(option);
        });

        // Add change listener
        select.addEventListener('change', () => {
            this.updateConditionDescription();
            this.toggleValueInput();
        });
    }

    /**
     * Update condition description
     */
    static updateConditionDescription() {
        const select = document.getElementById('unlock-condition-type');
        const descriptionEl = document.getElementById('condition-description');

        if (!select || !descriptionEl) return;

        const type = select.value;
        if (!type) {
            descriptionEl.textContent = '';
            return;
        }

        const metadata = conditionEngine.getTypeMetadata(type);
        descriptionEl.textContent = metadata.description;
    }

    /**
     * Toggle value input visibility
     */
    static toggleValueInput() {
        const select = document.getElementById('unlock-condition-type');
        const valueGroup = document.getElementById('unlock-value-group');

        if (!select || !valueGroup) return;

        const type = select.value;

        // Hide for 'always' and 'never', show for everything else
        if (type === '' || type === 'always' || type === 'never') {
            valueGroup.style.display = 'none';
        } else {
            valueGroup.style.display = 'block';
        }
    }

    /**
     * Get current condition from form
     */
    static getCurrentCondition() {
        const type = document.getElementById('unlock-condition-type').value;

        if (!type || type === '') {
            return null; // Always unlocked
        }

        if (type === 'always' || type === 'never') {
            return { type };
        }

        const value = parseFloat(document.getElementById('unlock-condition-value').value);

        if (isNaN(value)) {
            return null;
        }

        return { type, value };
    }

    /**
     * Reset condition form
     */
    static resetForm() {
        document.getElementById('unlock-condition-type').value = '';
        document.getElementById('unlock-condition-value').value = '0';
        document.getElementById('condition-description').textContent = '';
        document.getElementById('unlock-value-group').style.display = 'none';
    }
}

// Auto-populate on load
if (typeof conditionEngine !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        ConditionBuilder.populateConditionTypes();
    });
}
