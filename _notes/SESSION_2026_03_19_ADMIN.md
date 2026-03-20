# Admin Setup — 2026-03-19

## Change
Added Trace.hildebrand@gmail.com as super admin.

## Credentials
- Email: Trace.hildebrand@gmail.com
- Password: Trace87223! (properly hashed)
- Role: super_admin

## Method
Direct Neon DB insert via temporary seed script.
CEO@epicai.ai remains as primary admin.
Seed script deleted after use.

## Details
- Table: admin_users
- Hash: PBKDF2-SHA512 (16-byte hex salt, 100000 iterations, 64-byte output)
- Format: `${salt}:${hash}`
- Verified: row confirmed in DB with role=super_admin, is_active=true
- Record ID: 58fa4df4-8cc8-495d-96b6-50d6255595c4
