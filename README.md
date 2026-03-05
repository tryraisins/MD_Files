# MD Files

A collection of reusable project guideline templates for **Security**, **Design**, and **SEO**. Pull any template instantly into your project using the [`yeknal`](https://www.npmjs.com/package/yeknal) CLI.

## Quick Start

Run any of these from the root of your project — no installation required:

```bash
# Fetch security guidelines + run a security audit
npx yeknal security

# Fetch design system guidelines
npx yeknal design

# Fetch SEO improvement checklist
npx yeknal seo
```

## Available Templates

| Command | File Downloaded | Description |
|---------|----------------|-------------|
| `npx yeknal security` | `Security-Master.md` | Security best practices, policies, and automated audit |
| `npx yeknal design` | `Design.md` | UI/UX design principles and standards |
| `npx yeknal seo` | `SEO-Prompt.md` | SEO checklist and improvement strategies |

## What Happens

1. The CLI fetches the requested markdown template from this repository.
2. The file is saved directly into your current working directory.
3. For `security`, it additionally runs `npx secure-repo audit` and saves the results to `security-audit.log`.

## Repository Structure

```
├── Security/
│   └── Security-Master.md
├── Design/
│   └── SKILL.md
├── SEO/
│   └── seo-improvement-prompt.md
└── yeknal-cli/          # CLI source code
    ├── bin/yeknal.js
    ├── package.json
    └── README.md
```

## License

ISC
