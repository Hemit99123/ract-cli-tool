<!-- markdownlint-disable first-line-h1 -->
<!-- markdownlint-disable html -->
<!-- markdownlint-disable no-duplicate-header -->

<div align="center">
  <img src="https://i.ibb.co/Y4HvSpQn/Screenshot-20250330-011418.png" width="20%" alt="RACT" />
</div>
<hr>
<div align="center" style="line-height: 1;">
  <a href="https://ract-cli-tool.org"><img alt="Visit us"
    src="https://img.shields.io/badge/🚀%RACT Demo-2F80ED?color=2F80ED&logoColor=white"/></a>
  <a href="https://x.com/ract-cli-tool"><img alt="Twitter"
    src="https://img.shields.io/badge/X@ract-cli-tool-1DA1F2?logo=x&logoColor=white"/></a>
  <br>
  <a href="LICENSE-CODE"><img alt="Code License"
    src="https://img.shields.io/badge/Code%20License-MIT%202.0-00BFFF?color=00BFFF"/></a>
  <br>
</div

## Overview

RACT is a command-line tool for managing **Role-Based Access Control (RBAC)** in systems that use **Redis** and **PostgreSQL** as backend services. It allows administrators to manage user roles (e.g., Admin, User) in a PostgreSQL database and handle user sessions in Redis. This tool can be used to:

- **Update user roles** between "User" and "Admin" in PostgreSQL.
- **Delete session data** from Redis associated with users.
- **Add or update Redis and PostgreSQL credentials** for the tool's operation.

RACT ensures that the roles of users in a system are efficiently managed across both Redis (for session management) and PostgreSQL (for user roles).

## Features

- **Manage PostgreSQL user roles**: Easily update and manage user roles (Admin, User) stored in PostgreSQL.
- **Clear Redis sessions**: Remove Redis session data associated with user emails, helping in session management and access control.
- **Credential management**: Store Redis and PostgreSQL credentials securely in a `creditionals.json` file for easier access.

## Requirements

- **Redis**: The tool interacts with Redis to manage user sessions.
- **PostgreSQL**: The tool interacts with PostgreSQL to manage user roles.
- **Node.js**: Ensure Node.js is installed on your system for running the tool.

## Configuration

Before using the tool, ensure that you have a `creditionals.json` file in the root directory of the project. This file should contain your Redis and PostgreSQL connection URLs.

### `creditionals.json` Example

```json
{
  "redisUrl": "redis://localhost:6379",
  "sqlDbUrl": "postgres://username:password@localhost:5432/dbname"
}
```

- `redisUrl`: The URL of the Redis instance used for session management.
- `sqlDbUrl`: The URL of the PostgreSQL instance used for user management.

**If the `creditionals.json` file is missing or incomplete, the tool will prompt you to enter the credentials when you run it.**

## Usage

### Running the Tool

To run the tool, use `npx` from the command line:

```bash
npx ract-cli-tool
```

Upon running the tool, you'll be presented with a menu of options.

### Main Commands

1. **add/update configs**: Prompts you to enter and save Redis and PostgreSQL credentials into the `creditionals.json` file.
2. **update role**: Allows you to update the role of a user (Admin/User) in PostgreSQL based on the email.
3. **exit**: Exits the tool.

### Example Flow

1. **add/update configs**: You will be prompted for Redis and PostgreSQL URLs. The tool will then save them to the `creditionals.json` file.
   
2. **update role**: You will:
   - Be asked for a user’s email.
   - Redis sessions related to the email will be deleted if found.
   - The tool will check if the email exists in PostgreSQL.
   - You will be prompted to select the role (User or Admin) for the email.
   - The role in PostgreSQL will be updated accordingly.
