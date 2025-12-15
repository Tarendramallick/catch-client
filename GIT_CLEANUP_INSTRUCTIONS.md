# Git Repository Cleanup Instructions

Your repository currently contains large files that shouldn't be tracked by Git. Follow these steps to clean up:

## Step 1: Remove tracked files from Git (keep local files)

Run these commands in your terminal:

\`\`\`bash
# Remove node_modules from git tracking (keep local files)
git rm -r --cached node_modules

# Remove .next build folder from git tracking (keep local files)
git rm -r --cached .next

# Stage the .gitignore file
git add .gitignore

# Commit the changes
git commit -m "Remove node_modules and .next from tracking, add .gitignore"
\`\`\`

## Step 2: Push to GitHub

\`\`\`bash
# Push the changes
git push origin main
\`\`\`

## Step 3: Clean up Git history (if files were previously committed)

If the large files are still in your Git history, you need to remove them completely:

\`\`\`bash
# Install git-filter-repo if you don't have it
# On Ubuntu/Debian:
sudo apt-get install git-filter-repo

# Remove node_modules and .next from all history
git filter-repo --path node_modules --invert-paths --force
git filter-repo --path .next --invert-paths --force

# Force push to update remote
git push origin main --force
\`\`\`

## Alternative: Start fresh (if above doesn't work)

If you're having persistent issues, you can start with a clean repository:

\`\`\`bash
# 1. Delete the .git folder to remove all Git history
rm -rf .git

# 2. Initialize a new Git repository
git init

# 3. Add all files (node_modules and .next will be ignored due to .gitignore)
git add .

# 4. Create initial commit
git commit -m "Initial commit with proper .gitignore"

# 5. Add your GitHub remote
git remote add origin https://github.com/Tarendramallick/catch-client

# 6. Force push to GitHub
git push -u origin main --force
\`\`\`

## Important Notes

- **Never commit `node_modules`** - Dependencies should be installed via `npm install`
- **Never commit `.next`** - Build folder is generated during deployment
- **Never commit `.env`** - Contains sensitive credentials
- On Vercel, dependencies are automatically installed during deployment
- Your `.gitignore` is now properly configured to prevent this in the future
