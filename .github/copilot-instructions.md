# Copilot Instructions for this Repository

## Overview

This is a test repository with custom agent configurations. The primary artifact is the planner agent in `.github/agents/planner.agent.md`.

## Custom Agents

### planner
A read-only planning agent used to explore codebases and design implementation plans without modifying files. Useful when you need to:
- Plan complex changes before implementing them
- Understand existing architecture and patterns
- Design solutions based on observed conventions

**Key constraint**: The planner agent operates in read-only mode and cannot modify files. It focuses on exploration and design.

## When to Use Which Tool

- **planner agent** (via `task` tool): Use when you need to explore the codebase and create a detailed implementation plan before making changes
- **explore agent**: For quick codebase questions and understanding specific patterns
- **Direct file editing**: For implementing changes after planning is complete

## Repository Structure

```
.github/
├── agents/
│   └── planner.agent.md    # Planner agent configuration
└── copilot-instructions.md # This file
```

## Notes for Future Sessions

- When planning complex tasks, use the planner agent to understand the codebase first
- The planner agent cannot create or modify files—it's for analysis and design only
- After planning, switch to direct editing or other agents to implement changes
