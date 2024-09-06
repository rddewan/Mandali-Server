import { GuildType, PrismaClient, RoleType } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

// Load environment variables based on NODE_ENV
const envPath = path.resolve(
  __dirname,
  `../.env.${process.env.NODE_ENV || 'development'}`,
);
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

// Read the password from the environment variable
const adminUser = process.env.ADMIN_USER;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminUser) {
  console.error('Error: ADMIN_USER environment variable is not set.');
  process.exit(1);
} else if (!adminEmail) {
  console.error('Error: ADMIN_EMAIL environment variable is not set.');
  process.exit(1);
} else if (!adminPassword) {
  console.error('Error: ADMIN_PASSWORD environment variable is not set.');
  process.exit(1);
}

async function main() {
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // create a church
  const church = await prisma.church.upsert({
    where: { name: 'Mirik Church' },
    update: {
      address: 'Mirik Deosadara, Mirik 734214, Darjeeling, WB, India',
    },
    create: {
      name: 'Mirik Church',
      address: 'Mirik Deosadara, Mirik 734214, Darjeeling, WB, India',
      churchSetting: {
        create: {
          timeZone: 'Asia/Kolkata',
        },
      },
    },
  });

  console.log('Default church created:', church);

  // Create default roles
  const roles = Object.values(RoleType);
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {
        name: roleName,
      },
      create: { name: roleName },
    });
  }

  console.log('Roles created');

  // Create default roles
  const guilds = Object.values(GuildType);
  for (const guild of guilds) {
    await prisma.guild.upsert({
      where: { name: guild },
      update: {
        name: guild,
      },
      create: { name: guild },
    });
  }

  console.log('Guilds created');

  // Create a default user with admin and user roles
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminUser,
      email: adminEmail,
      passwordHash: passwordHash,
      emailVerified: true,
      churchId: church.id,
      roles: {
        create: [
          { role: { connect: { name: RoleType.superAdmin } } },
          { role: { connect: { name: RoleType.admin } } },
          { role: { connect: { name: RoleType.user } } },
        ],
      },
    },
  });

  console.log('Default user created:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
