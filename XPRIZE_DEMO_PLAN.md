# Xprize Demo Video - Production Plan
**LaunchPad AI for Xprize AI Tutor Prize**

---

## 🎯 Objective
Create a compelling 3-5 minute demo video showcasing LaunchPad AI's capabilities, presented by Ciara via HeyGen.

---

## ✅ What's Ready Now

### 1. **Demo Chat Interface**
- **Location:** `http://localhost:3000`
- **Status:** Running and ready for screen recording
- **Features:**
  - Clean, professional UI
  - Pre-scripted conversation flow
  - Shows Phoenix → Atlas → Ledger routing
  - Auto-advancing demo (click "Send" to progress)

### 2. **Demo Script**
- **Location:** `/Users/bobd/.openclaw/workspace/launchpad-ai/DEMO_SCRIPT.md`
- **Content:**
  - 7-scene narrative arc
  - Timing breakdowns
  - Ciara's speaking parts
  - Screen recording instructions

### 3. **Working Backend**
- Phoenix agent operational
- Gemini integration complete
- Function calling working
- Real API responses available

---

## 📹 Screen Recording Instructions

### How to Record the Demo

1. **Start the demo server** (already running):
   ```bash
   cd /Users/bobd/.openclaw/workspace/launchpad-ai/demo
   npm start
   ```

2. **Open in browser:**
   - Navigate to `http://localhost:3000`
   - You'll see the LaunchPad AI chat interface

3. **Set up screen recording:**
   - Use QuickTime, OBS, or your preferred tool
   - Record at 1920x1080 resolution
   - Focus on browser window (hide tabs/bookmarks)

4. **Record the conversation:**
   - Click "Send" button to advance through demo
   - Each click shows next message in sequence
   - Pause 2-3 seconds between messages for readability
   - Total conversation: ~6 interactions

### What Gets Recorded

**Message 1 (User):**
> "I want to start a sustainable fashion business, but I don't know where to begin."

**Message 2 (Phoenix 🦅):**
> Welcome message + structured coaching advice (niche, validation, lean start)

**Message 3 (User):**
> "What's the market size for sustainable fashion?"

**Message 4 (Phoenix 🦅):**
> "Let me connect you with Atlas, our market research specialist."
> [Shows routing badge]

**Message 5 (Atlas 🗺️):**
> Market sizing data, growth trends, geographic breakdown

**Message 6 (User):**
> "How much money do I need to get started?"

**Message 7 (Phoenix 🦅):**
> "Let me bring in Ledger to help model this out."
> [Shows routing badge]

**Message 8 (Ledger 📊):**
> Startup cost breakdown with ranges and lean strategy

---

## 🎨 Visual Assets Needed

### Priority 1 - Must Have

1. **Opening Slide**
   - PHI logo
   - "LaunchPad AI" title
   - Tagline: "AI-Powered Entrepreneurship Coaching"

2. **Problem Statement Slide**
   - Statistics about limited incubator access
   - Map showing underserved areas

3. **Agent Roster Slide**
   - Phoenix 🦅 - Chief of Staff
   - Atlas 🗺️ - Market Research
   - Ledger 📊 - Financial Modeling
   - Compass 🧭 - Mentorship (coming soon)
   - Catalyst ⚡ - Fundraising (coming soon)

4. **Architecture Diagram**
   ```
   User Question
       ↓
   Phoenix 🦅 (Orchestrator)
       ↓
   ┌────┴────┬────────┬─────────┐
   Atlas    Ledger  Compass  Catalyst
   🗺️       📊      🧭       ⚡
   ```

5. **Technology Stack Slide**
   - Google Vertex AI
   - Gemini 2.5 Pro (reasoning)
   - Gemini 2.0 Flash (speed)
   - Function calling visualization

6. **Impact Slide**
   - 40+ programs served
   - Diverse entrepreneur profiles
   - Geographic reach

7. **Closing Slide**
   - pivotintl.org
   - Contact info
   - Social media handles
   - Xprize logo

### Priority 2 - Nice to Have

- B-roll footage suggestions (stock video)
- Animated transitions
- Progress bars showing conversation flow
- User testimonial mockups

---

## 🎤 Ciara's Script (HeyGen)

### Tone & Delivery
- **Energy:** Confident, inspiring, warm
- **Pace:** Medium - emphasize key phrases
- **Style:** TED talk meets startup pitch

### Key Phrases to Emphasize
- "democratizing opportunity"
- "accessible to anyone, anywhere"
- "never sleeps, never judges, scales infinitely"
- "not replacing human connection — making it scalable"

### Full Script
See `DEMO_SCRIPT.md` for complete 7-scene narrative with timing.

---

## 🎬 Production Timeline

### Phase 1: Asset Creation (You + Design Team)
**Timeline:** 1-2 days

- [ ] Create slide deck (Canva/Figma)
- [ ] Record demo chat interface (5 min screen recording)
- [ ] Gather B-roll footage (optional)
- [ ] Export all assets

### Phase 2: HeyGen Production (Ciara)
**Timeline:** 2-3 days

- [ ] Upload script to HeyGen
- [ ] Select Ciara avatar and settings
- [ ] Generate initial draft
- [ ] Review and refine
- [ ] Add music and captions

### Phase 3: Post-Production
**Timeline:** 1 day

- [ ] Combine Ciara narration + screen recordings + slides
- [ ] Add transitions and effects
- [ ] Color correction
- [ ] Final review

### Phase 4: Distribution
**Timeline:** 1 day

- [ ] Export final video (1080p, multiple formats)
- [ ] Upload to Xprize submission portal
- [ ] Post to YouTube (Pivot International channel)
- [ ] Share on LinkedIn, Twitter
- [ ] Embed on pivotintl.org homepage

**Total Estimated Timeline:** 5-7 days

---

## 📊 Success Checklist

### Technical Demonstration
- [ ] Shows real working system
- [ ] Demonstrates AI reasoning (Phoenix routing)
- [ ] Shows multi-agent collaboration
- [ ] Proves scalability potential
- [ ] Displays professional UI/UX

### Storytelling
- [ ] Clear problem statement
- [ ] Compelling solution
- [ ] Emotional connection to mission
- [ ] Memorable demo moment
- [ ] Strong call to action

### Production Quality
- [ ] Professional avatar presentation
- [ ] Clear audio
- [ ] Smooth transitions
- [ ] Accessible captions
- [ ] Appropriate music

---

## 🚀 Next Steps (Priority Order)

### Immediate (Today)
1. ✅ Demo interface created and running
2. ✅ Demo script written
3. **→ Record screen demo** (5 minutes)
4. **→ Create slide deck** (Canva)

### This Week
5. Send assets + script to Ciara
6. HeyGen video production
7. Review draft and refine
8. Final video export

### Next Week
9. Submit to Xprize
10. Launch distribution campaign
11. Embed on pivotintl.org
12. Social media promotion

---

## 📞 Contact & Resources

### Demo Server
- **URL:** http://localhost:3000
- **Control:** Click "Send" to advance conversation
- **Stop:** `Ctrl+C` in terminal

### Files
- **Demo script:** `DEMO_SCRIPT.md`
- **Chat interface:** `demo/public/index.html`
- **Server:** `demo/server.js`
- **Setup guide:** `SETUP_COMPLETE.md`

### Tools Needed
- **Screen recording:** QuickTime, OBS, or Loom
- **Slide creation:** Canva (free) or Figma
- **HeyGen:** Avatar video production
- **Video editing:** Final Cut, Premiere, or DaVinci Resolve

---

## 💡 Pro Tips

### For Screen Recording
- Hide browser tabs/bookmarks for clean look
- Use private/incognito window
- Slow, deliberate clicks
- Pause 2-3 seconds between messages
- Keep cursor movements smooth

### For HeyGen Production
- Break script into short segments (30-45 sec each)
- Use natural pauses between scenes
- Test multiple takes for emphasis
- Preview with and without subtitles

### For Distribution
- Export multiple formats (MP4, MOV, WebM)
- Create short clips for social (30 sec, 60 sec, 90 sec)
- Add end cards with CTAs
- Prepare email/LinkedIn copy in advance

---

**Status:** Ready for screen recording and asset creation! 🎬

*The foundation is solid. Time to show the world what we've built.* 🦅
