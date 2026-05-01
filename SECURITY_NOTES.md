# Security Notes

## API Key Protection

### ✅ What's Protected
- `.env.local` is in `.gitignore` and will never be committed
- All test scripts now use environment variables or placeholders
- Documentation files use placeholder values

### ⚠️ Important Reminders

1. **Never commit API keys directly in code**
   - Always use environment variables
   - Use `process.env.GROQ_API_KEY` in test scripts
   - Use placeholders in documentation

2. **Running Test Scripts**
   Before running any test script, set your API key:
   
   **Windows PowerShell:**
   ```powershell
   $env:GROQ_API_KEY="your_actual_api_key"
   node test-groq-api.js
   ```
   
   **Windows CMD:**
   ```cmd
   set GROQ_API_KEY=your_actual_api_key
   node test-groq-api.js
   ```
   
   **Linux/Mac:**
   ```bash
   export GROQ_API_KEY="your_actual_api_key"
   node test-groq-api.js
   ```

3. **Deployment**
   - Set environment variables in your deployment platform (Vercel, etc.)
   - Never include actual keys in deployment documentation
   - Rotate keys if they're ever exposed

### 🔒 Current Status
- ✅ All API keys removed from repository
- ✅ `.env.local` properly gitignored
- ✅ Test scripts use environment variables
- ✅ Documentation uses placeholders
- ✅ Force-pushed to remove key from git history

### 📝 If You Accidentally Commit a Secret

1. **Remove it from all files** (replace with placeholder)
2. **Amend the commit:**
   ```bash
   git add -A
   git commit --amend --no-edit
   ```
3. **Force push:**
   ```bash
   git push origin main --force
   ```
4. **Rotate the exposed key** (get a new one from Groq)
5. **Update `.env.local`** with the new key

### 🛡️ GitHub Secret Scanning

GitHub automatically scans for exposed secrets. If you see a push protection error:
- It means GitHub detected a secret in your commit
- Follow the steps above to remove it
- Never use the "allow secret" option unless absolutely necessary

### 📚 Additional Resources

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Groq API Key Management](https://console.groq.com/keys)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

---

**Last Updated**: May 1, 2026
