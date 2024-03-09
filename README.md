# Secure Share

## Initialise secrets

### Database password

Option 1: Use an online password generator

Use a free online password generator to generate a secure random password.

Examples:

- [1Password](https://1password.com/password-generator/)
- [Dashlane](https://www.dashlane.com/features/password-generator)
- [Bitwarden](https://bitwarden.com/password-generator/)

Option 2: Use OpenSSL

1. Create new `db_password.txt` inside `secrets` directory
2. Install OpenSSL if not already available, verify with `openssl --help`
3. Generate a random password with the following command: `openssl rand -base64 -out ./secrets/db_password.txt 32`
