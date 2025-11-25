/**
 * UI Notifications
 *
 * Funktionen für visuelle Benachrichtigungen
 */

/**
 * Zeigt eine Unlock-Benachrichtigung
 * @param {Upgrade} upgrade - Das freigeschaltete Upgrade
 */
function showUnlockNotification(upgrade) {
    const notification = document.createElement('div');
    notification.className = 'unlock-notification';
    notification.innerHTML = `
        <div class="unlock-notification-content">
            <span class="unlock-icon">🔓</span>
            <div class="unlock-message">
                <strong>Neues Upgrade freigeschaltet!</strong>
                <p>${upgrade.name}</p>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Animation: Slide in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove nach 3 Sekunden
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
