# Terminal Basics Presentation

## Files Included

1. **presentation.md** - Markdown presentation file (Marp format)
2. **presentation-script.md** - Detailed speaker notes and script
3. **terminal-training-plan.md** - Comprehensive training guide (leave-behind)

## Converting to PowerPoint

### Option 1: Using Marp (Recommended)

**Install Marp CLI:**
```bash
npm install -g @marp-team/marp-cli
```

**Convert to PowerPoint:**
```bash
marp presentation.md --pptx -o terminal-basics-presentation.pptx
```

**Convert to PDF (alternative):**
```bash
marp presentation.md --pdf -o terminal-basics-presentation.pdf
```

### Option 2: Using Pandoc

**Install Pandoc:**
```bash
brew install pandoc  # macOS
```

**Convert to PowerPoint:**
```bash
pandoc presentation.md -o terminal-basics-presentation.pptx
```

### Option 3: Manual Import to PowerPoint

1. Open PowerPoint
2. Create new presentation
3. Use the script in `presentation-script.md` as your guide
4. Copy slide content from `presentation.md`
5. Apply IBM Design Language manually:
   - Font: IBM Plex Sans
   - Primary Color: IBM Blue (#0f62fe)
   - Background: White (#ffffff)
   - Text: Carbon Gray (#161616)
   - Clean, minimalist layouts

## IBM Design Language Guidelines

### Colors
- **Primary Blue**: #0f62fe (IBM Blue)
- **Background**: #ffffff (White)
- **Text**: #161616 (Carbon Gray 100)
- **Code Background**: #f4f4f4 (Gray 10)

### Typography
- **Font Family**: IBM Plex Sans
- **Headings**: 600 weight (Semi-bold)
- **Body**: 400 weight (Regular)
- **Code**: IBM Plex Mono

### Layout Principles
- Clean, minimalist design
- Generous white space
- Left-aligned text (not centered except for title/closing slides)
- Consistent margins and padding
- One main idea per slide

## Presentation Details

- **Duration**: 15 minutes
- **Audience**: 60 people
- **Format**: Professional with wit
- **Core Message**: "Create your own workflow that works for you"

## Using the Script

The `presentation-script.md` file contains:
- Detailed talking points for each slide
- Timing for each section (totals 15 minutes)
- Delivery notes and tips
- Audience engagement strategies
- Question handling guidance
- Analogies and humor cues

### Timing Breakdown
- Content: ~12 minutes
- Questions: ~2-3 minutes
- Buffer: ~1 minute

## Customization Tips

### Before Presenting
1. Review the script and make it your own
2. Practice the analogies (car comparisons, bike example)
3. Adjust humor to your style
4. Add personal anecdotes if relevant
5. Time yourself (aim for 12-13 minutes of content)

### During Presentation
- Maintain high energy
- Make eye contact with different sections
- Use hand gestures for emphasis
- Pause for reactions/laughs
- Watch for confused faces and adjust

### After Presentation
- Share the training plan location
- Offer office hours for questions
- Create discussion channel (Slack/Teams)
- Consider follow-up workshops

## Key Messages to Emphasize

1. **No "right" way** - only what works for you
2. **Start simple** - complexity comes with time
3. **Practice daily** - consistency beats intensity
4. **Customize everything** - make it yours
5. **Share knowledge** - we learn together

## Backup Plans

### If Running Long
- Shorten slides 7 (oh-my-zsh) and 11 (advanced topics)
- Take questions offline
- Focus on core slides: 1-6, 12, 14-15

### If Running Short
- Expand on personal anecdotes
- Add more examples in navigation/pipes sections
- Take more questions

### Technical Issues
- Have PDF backup ready
- Print key slides as handouts
- Be prepared to present without slides if needed

## Resources to Share

After the presentation, share:
1. Location of training plan: `terminal-basics/terminal-training-plan.md`
2. This presentation file for reference
3. Recommended tools and resources
4. Your contact info for follow-up questions

## Success Metrics

The presentation is successful if:
- People open and use the training plan
- Questions come up in following weeks
- Terminal usage increases in the team
- People start customizing their setups
- Attendees feel empowered, not overwhelmed

## Notes

- The presentation uses Marp syntax with IBM Design Language styling
- Speaker notes are comprehensive but should be adapted to your style
- Humor and analogies are suggestions - use what feels natural
- The goal is inspiration, not intimidation
- Emphasize experimentation and personal workflow

## Questions?

If you need help with:
- Converting the presentation
- Customizing content
- Technical setup
- Presentation delivery

Feel free to reach out!

---

**Good luck with your presentation! You've got this. 🚀**