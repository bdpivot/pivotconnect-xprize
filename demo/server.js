/**
 * Simple demo server for LaunchPad AI
 * Serves the demo chat interface for screen recording
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🦅 LaunchPad AI Demo Server`);
  console.log(`📍 Running at: http://localhost:${PORT}`);
  console.log(`\n📹 Ready for screen recording!`);
  console.log(`\n   Recommended Demo:`);
  console.log(`   ⭐ http://localhost:${PORT}/mentor-demo-v2.html`);
  console.log(`\n   Other options:`);
  console.log(`   • http://localhost:${PORT}/index.html - Original coaching demo`);
  console.log(`   • http://localhost:${PORT}/mentor-demo.html - PivotConnect v1`);
  console.log(`\n   📝 Click 'Send' button 4 times to step through demo`);
  console.log(`   ✓ Button stays visible throughout`);
  console.log(`   ✓ Step counter shows progress (Step 1/4, etc.)\n`);
});
