/**
 * ZIP Exporter - Creates downloadable ZIP file with game files
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateHTML } from './htmlGenerator';

export async function exportToZIP(gameData) {
  const zip = new JSZip();

  // Generate HTML file
  const htmlContent = generateHTML(gameData, gameData.layout.blocks);
  zip.file('index.html', htmlContent);

  // Add README
  const readme = generateREADME(gameData);
  zip.file('README.txt', readme);

  // Generate and download ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  const filename = `${gameData.meta.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-game.zip`;
  saveAs(blob, filename);

  return true;
}

function generateREADME(gameData) {
  return `${gameData.meta.title}
${'='.repeat(gameData.meta.title.length)}

${gameData.meta.description || 'An idle/incremental game'}

${gameData.meta.author ? `Created by: ${gameData.meta.author}\n` : ''}
Generated with: Idle Game Creator
Created: ${new Date().toLocaleDateString()}

HOW TO PLAY
============

1. Open index.html in any modern web browser
2. Click the main button to generate resources
3. Buy buildings to automate production
4. Purchase upgrades to boost your earnings
5. Unlock achievements as you progress

The game automatically saves to your browser's local storage.

REQUIREMENTS
============

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript must be enabled
- No internet connection required after download

TECHNICAL INFO
==============

This is a standalone HTML5 game with no external dependencies.
All code, styles, and game logic are contained in the single index.html file.

- Game Engine: Vanilla JavaScript
- Layout System: CSS Flexbox/Grid
- Storage: Browser LocalStorage

Enjoy playing!
`;
}
