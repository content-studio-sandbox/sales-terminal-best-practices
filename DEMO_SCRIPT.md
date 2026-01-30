y# Interactive Terminal Demo Script

## 🎯 Purpose
This script demonstrates all commands shown on the `/terminal-basics` page actually work in the interactive terminal.

## 📍 Location
Navigate to: **http://localhost:8082/interactive-terminal**

---

## ✅ Navigation Commands Test

### Test 1: Check Current Location
```bash
pwd
```
**Expected Output:** `/home/sales-user/projects`

### Test 2: List Files
```bash
ls
```
**Expected Output:** 
```
project1/
project2/
README.md
notes.txt
```

### Test 3: List Files (Detailed)
```bash
ls -la
```
**Expected Output:** Detailed listing with permissions, sizes, dates

### Test 4: Change Directory
```bash
cd project1
pwd
```
**Expected Output:** `/home/sales-user/projects/project1`

### Test 5: Go Back Up
```bash
cd ..
pwd
```
**Expected Output:** `/home/sales-user/projects`

### Test 6: Go Home
```bash
cd ~
pwd
```
**Expected Output:** `/home/sales-user/projects` (home directory)

---

## ✅ File Operations Test

### Test 7: Create Directory
```bash
mkdir sales-demo
ls
```
**Expected Output:** Should show `sales-demo/` in the list

### Test 8: Enter New Directory
```bash
cd sales-demo
pwd
```
**Expected Output:** `/home/sales-user/projects/sales-demo`

### Test 9: Create Files
```bash
touch notes.txt
touch presentation.pptx
ls
```
**Expected Output:**
```
notes.txt
presentation.pptx
```

### Test 10: Create Subdirectory
```bash
mkdir resources
ls
```
**Expected Output:**
```
notes.txt
presentation.pptx
resources/
```

### Test 11: Copy File
```bash
cp notes.txt notes-backup.txt
ls
```
**Expected Output:**
```
notes.txt
notes-backup.txt
presentation.pptx
resources/
```

### Test 12: Move File
```bash
mv notes-backup.txt resources/
ls
```
**Expected Output:**
```
notes.txt
presentation.pptx
resources/
```

### Test 13: Verify Move
```bash
cd resources
ls
```
**Expected Output:** `notes-backup.txt`

### Test 14: Go Back
```bash
cd ..
pwd
```
**Expected Output:** `/home/sales-user/projects/sales-demo`

### Test 15: Remove File
```bash
rm presentation.pptx
ls
```
**Expected Output:**
```
notes.txt
resources/
```

### Test 16: Remove Directory (should fail without -rf)
```bash
rm resources/
```
**Expected Output:** Error message saying it's a directory

### Test 17: Remove Directory (with -rf)
```bash
rm -rf resources/
ls
```
**Expected Output:** `notes.txt` (resources/ should be gone)

---

## ✅ Additional Commands Test

### Test 18: View File Contents
```bash
cd ~
cat README.md
```
**Expected Output:** File contents displayed

### Test 19: Echo Command
```bash
echo Hello from the terminal!
```
**Expected Output:** `Hello from the terminal!`

### Test 20: Date Command
```bash
date
```
**Expected Output:** Current date and time

### Test 21: Who Am I
```bash
whoami
```
**Expected Output:** `sales-user`

### Test 22: Command History
```bash
history
```
**Expected Output:** List of all commands you've typed

### Test 23: Clear Screen
```bash
clear
```
**Expected Output:** Terminal screen clears

### Test 24: Help Command
```bash
help
```
**Expected Output:** Full list of available commands organized by category

### Test 25: Tips Command
```bash
tips
```
**Expected Output:** Hot tips for tech sellers

---

## ✅ Git Commands Test

### Test 26: Git Status
```bash
git status
```
**Expected Output:** Git status output

### Test 27: Git Log
```bash
git log
```
**Expected Output:** Commit history

### Test 28: Git Branch
```bash
git branch
```
**Expected Output:** List of branches

### Test 29: Git Checkout
```bash
git checkout develop
```
**Expected Output:** Switched to branch 'develop'

---

## ✅ Docker Commands Test

### Test 30: Docker PS
```bash
docker ps
```
**Expected Output:** List of running containers

### Test 31: Docker Images
```bash
docker images
```
**Expected Output:** List of Docker images

---

## ✅ Kubernetes Commands Test

### Test 32: Kubectl Get Pods
```bash
kubectl get pods
```
**Expected Output:** List of pods

### Test 33: Kubectl Describe
```bash
kubectl describe pod web-app
```
**Expected Output:** Detailed pod information

---

## 🎉 Success Criteria

All 33 tests should pass with realistic output. If any command doesn't work:
1. Check the command spelling
2. Verify you're in the correct directory
3. Check the browser console for errors
4. Refresh the page and try again

---

## 💡 Pro Tips for Demo

1. **Start Fresh**: Click "Reset" button before each demo
2. **Go Slow**: Let audience see each command and output
3. **Explain**: Describe what each command does before running it
4. **Show Mistakes**: Intentionally make a typo to show error handling
5. **Use Tab**: Demonstrate tab completion (though simulated here)
6. **Show History**: Use up arrow to show command history
7. **Highlight Safety**: Emphasize this is a safe learning environment

---

## 🚀 Demo Flow Suggestion

### For Sales Teams (5 minutes):
1. Show basic navigation (pwd, ls, cd)
2. Create a project folder (mkdir, cd)
3. Create some files (touch)
4. Show git commands (git status, git log)
5. Show tips command

### For Technical Teams (10 minutes):
1. All basic commands
2. File operations (cp, mv, rm)
3. Git workflow (branch, checkout, pull, push)
4. Docker commands (ps, images, logs)
5. Kubernetes commands (get, describe, logs)
6. Show tips and help commands

### For Executives (3 minutes):
1. Show it's a browser-based terminal
2. Demonstrate 3-4 basic commands
3. Show git status and docker ps
4. Emphasize: "This is how developers work daily"
5. Show tips command for learning resources