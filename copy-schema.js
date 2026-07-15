const fs = require('fs');
fs.mkdirSync('prisma', { recursive: true });
fs.copyFileSync('../prisma/schema.prisma', 'prisma/schema.prisma');
fs.writeFileSync('.env', 'DATABASE_URL="postgresql://neondb_owner:npg_4Hk8TLQqdivV@ep-super-dew-za19firz.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require"');
