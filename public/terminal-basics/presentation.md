---
marp: true
theme: default
paginate: true
backgroundColor: #ffffff
color: #161616
style: |
  section {
    font-family: 'IBM Plex Sans', sans-serif;
  }
  h1 {
    color: #0f62fe;
    font-weight: 600;
  }
  h2 {
    color: #0f62fe;
    font-weight: 400;
  }
  strong {
    color: #0f62fe;
  }
  code {
    background: #f4f4f4;
    color: #161616;
  }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Terminal Basics
## Your Workflow, Your Way

**Building Productive Development Environments**

---

<!-- _class: lead -->

# The Big Picture

> "Create your own workflow and work environment that works for **you**."

This is a **starting point** based on collective experience.

The end goal: **Make you as productive as possible** to perform the task at hand.

---

# Why Terminal Skills Matter

- **Speed**: Commands execute faster than clicking through menus
- **Automation**: Repeat tasks with a single command
- **Remote Work**: Essential for SSH and cloud environments
- **Universal**: Works across Mac, Linux, and Windows (WSL)
- **Power**: Access to tools GUIs don't expose

*The terminal isn't scary—it's liberating.*

---

# Learning Path Overview

```
Terminal Apps → Shells → Editors → Navigation → 
Redirection → Advanced Topics → Mastery
```

**Today's Focus**: The foundation you need to start building your workflow

**Your Mission**: Experiment, customize, make it yours

---

# 1. Terminal Applications

**Built-in Options**
- **Terminal.app** (Mac) - Simple, reliable, always there
- Good for: Quick tasks, beginners

**Power User Alternatives**
- **iTerm2** - Split panes, customization, hotkeys
- **Terminus** - Cross-platform, modern UI
- **Warp** - AI-powered, IDE-like features

**Choose based on**: Your needs, not hype

---

# 2. Understanding Shells

**What is a Shell?**
The interpreter between you and the operating system

**The Big Three**
- **sh** - The original, maximum portability
- **bash** - The workhorse, most common
- **zsh** - Modern features, macOS default

**Pro Tip**: Learn bash first, explore zsh for daily use

---

# Shell Superpowers: oh-my-zsh

**Transform your zsh experience**
- 300+ plugins (git, docker, kubectl)
- 150+ themes for beautiful prompts
- Auto-completion on steroids
- Community-driven

**Installation**: One command, instant productivity boost

*Make your terminal work harder so you don't have to.*

---

# 3. Text Editors

**nano** - The Friendly One
- Commands shown on screen
- No learning curve
- Perfect for quick edits

**vim** - The Power Tool
- Steep learning curve, massive payoff
- Available everywhere
- Muscle memory = speed

**Start with nano, graduate to vim when ready**

---

# 4. Filesystem Navigation

**Essential Commands**
```bash
pwd     # Where am I?
ls      # What's here?
cd      # Take me there
mkdir   # Create space
rm      # Remove (carefully!)
```

**Master these, master your environment**

*Tab completion is your best friend*

---

# 5. Redirection & Pipes

**The Unix Philosophy**: Do one thing well, chain them together

```bash
command1 | command2 | command3
```

**Real Power**
- `>` Save output to file
- `>>` Append to file
- `|` Chain commands together

*This is where terminal becomes magical*

---

# 6. Advanced Topics

**Level Up Your Game**
- **Environment Variables** - Configure your environment
- **Aliases** - Create shortcuts for common commands
- **Command History** - Never retype commands
- **File Permissions** - Security and access control
- **Terminal Multiplexers** - screen/tmux for persistence

*Small optimizations compound into massive productivity gains*

---

# Your Action Plan

**Week 1**: Pick a terminal app, get comfortable
**Week 2**: Learn basic navigation and file operations
**Week 3**: Master your editor (start with nano)
**Week 4**: Explore pipes and redirection
**Month 2**: Customize with aliases and oh-my-zsh
**Month 3**: You're dangerous (in a good way)

---

# The Training Plan

**Comprehensive Guide Available**
- 6 detailed sections with exercises
- Quick reference cheat sheets
- Troubleshooting tips
- Progressive learning path

**Location**: `terminal-basics/terminal-training-plan.md`

*Your roadmap to terminal mastery*

---

# Remember

✅ **There's no "right" way** - only what works for you
✅ **Start simple** - complexity comes with time
✅ **Practice daily** - even 5 minutes counts
✅ **Customize everything** - make it yours
✅ **Share knowledge** - we all learn together

---

<!-- _class: lead -->

# Key Takeaway

## The terminal is not a destination
## It's a tool to make you more productive

**Your workflow. Your rules. Your productivity.**

---

<!-- _class: lead -->

# Questions?

**Let's discuss how to make the terminal work for YOU**

Resources: `terminal-basics/terminal-training-plan.md`

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Thank You

**Now go build something amazing**

*The terminal is waiting...*