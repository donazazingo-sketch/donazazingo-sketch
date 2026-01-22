# GitHub Setup Guide

Follow these steps to upload your app to GitHub:

## 1. Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository: `donazazingo-sketch`
5. Choose public or private
6. **Do NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## 2. Initialize Git and Push to GitHub

Open your terminal in the `donazazingo-sketch` directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Inventory Tracker app"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/donazazingo-sketch.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## 3. Alternative: Using GitHub Desktop

1. Open GitHub Desktop
2. Click "File" → "Add Local Repository"
3. Navigate to the `donazazingo-sketch` folder
4. Click "Publish repository" button
5. Choose your GitHub account and repository name
6. Click "Publish repository"

## 4. Update README.md

Before pushing, update the README.md file:
- Replace `yourusername` with your GitHub username
- Replace "Your Name" with your actual name (if desired)

## 5. Optional: Deploy to Vercel

Since this is a Next.js app, you can easily deploy it to Vercel:

1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

Your app will be live at `https://your-project-name.vercel.app`

## Files Included for GitHub

✅ `.gitignore` - Excludes node_modules and build files  
✅ `README.md` - Comprehensive project documentation  
✅ `LICENSE` - MIT License  
✅ `.github/workflows/ci.yml` - GitHub Actions CI workflow (optional)

Your project is now ready for GitHub! 🚀
