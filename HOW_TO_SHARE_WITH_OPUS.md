# How to Share This Issue with Claude Opus

## Quick Start

1. **Open a new conversation with Claude Opus**

2. **Copy and paste this message:**

```
I need your help debugging a critical authentication bug in my Next.js app. 

Please read the detailed problem description in the attached PROMPT_FOR_OPUS.md file, then analyze these files:

1. src/components/HeaderWrapper.tsx (192 lines - HAS DUPLICATE CODE)
2. src/lib/auth.ts (152 lines)
3. Terminal logs showing the sign-out loop

The main issue: After successful Google OAuth login, signOut() is called automatically in a loop without user interaction. We've tried 20+ different fixes and are going in circles.

I need you to:
- Find the root cause of the automatic sign-out loop
- Identify and remove duplicate code in HeaderWrapper.tsx
- Provide a clean, working implementation
- Explain why this fix will work when others haven't

Please be thorough and provide complete code - no snippets with "...existing code..." placeholders.
```

3. **Attach these files to the conversation:**
   - `PROMPT_FOR_OPUS.md` (the detailed problem description)
   - `src/components/HeaderWrapper.tsx` (the corrupted file)
   - `src/lib/auth.ts` (the auth configuration)
   - Copy recent terminal logs showing the loop

## Files to Attach

### Method 1: Using the Debug Snapshot
```bash
# The files are already copied to debug_snapshot/ folder:
- debug_snapshot/HeaderWrapper.tsx
- debug_snapshot/auth.ts
```

### Method 2: Get Files Directly
```bash
# Copy these files to attach:
src/components/HeaderWrapper.tsx
src/lib/auth.ts
PROMPT_FOR_OPUS.md
```

## Terminal Logs to Share

Get the latest terminal output showing the sign-out loop:
```bash
# From the running dev server terminal, copy the section showing:
GET /api/auth/callback/google... 302
GET / 200
POST /api/auth/signout 200    ← The automatic loop
GET / 200
POST /api/auth/signout 200
(repeating...)
```

## What to Expect from Opus

Opus should provide:
1. **Root cause analysis** - Clear explanation of what's causing the loop
2. **File analysis** - Detailed breakdown of the duplicate code issue
3. **Clean implementation** - Complete, working HeaderWrapper.tsx
4. **Testing steps** - How to verify the fix works
5. **Additional recommendations** - Any other issues found

## After Getting Opus's Response

1. **Read the analysis carefully** - Understand the root cause
2. **Back up current code** - Run: `git add -A && git commit -m "backup before opus fix"`
3. **Apply the fix** - Copy Opus's clean implementation
4. **Clear caches** - Run: `rm -rf .next && rm -rf node_modules/.cache`
5. **Restart server** - Stop and restart `npm run dev`
6. **Test in incognito** - Open fresh incognito window and test both sign-in and sign-out
7. **Verify no loop** - Check terminal for automatic signout calls

## If You Need More Context

Additional files that might be useful:
- `src/app/layout.tsx` - Root layout
- `src/components/Providers.tsx` - Session provider
- `middleware.ts` - Request middleware
- `.env.local` - Environment variables (REMOVE SECRETS before sharing!)

## Tips for Working with Opus

1. **Be specific** - Ask follow-up questions if anything is unclear
2. **Test incrementally** - Apply changes one at a time if unsure
3. **Share results** - If the fix doesn't work, share new terminal logs
4. **Keep conversation focused** - Stick to the auth issue until resolved

## Success Checklist

Before marking this as resolved, verify:
- [ ] Sign in with Google works
- [ ] User name displays in blue badge
- [ ] No automatic sign-out loop after login
- [ ] Can click "Sign out" and be logged out
- [ ] "Sign in" button appears after sign-out
- [ ] Works in both regular and incognito browsers
- [ ] HeaderWrapper.tsx file size is ~160-170 lines (not 192)
- [ ] No duplicate code found in grep searches
- [ ] Session persists across page refreshes

## Emergency Rollback

If Opus's fix breaks everything:
```bash
# Restore to last working state
git log --oneline -10  # Find the last good commit
git checkout <commit-hash> src/components/HeaderWrapper.tsx
git checkout <commit-hash> src/lib/auth.ts
rm -rf .next
npm run dev
```

---

Good luck! This bug has been persistent, but with Opus's analytical capabilities and fresh perspective, we should be able to crack it.
