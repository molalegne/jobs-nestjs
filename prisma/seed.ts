import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Beleqet database...');

  // ── Job Categories ─────────────────────────────────────────────────────────
  const rawJobCategories = [
    "Accounting And Finance", "Advisory And Consultancy", "Aeronautics And Aerospace",
    "Agriculture", "Architecture And Urban Planning", "Beauty And Grooming",
    "Broker And Case Closer", "Business And Commerce", "Chemical And Biomedical Engineering",
    "Clothing And Textile", "Construction And Civil Engineering", "Creative Art And Design",
    "Customer Service And Care", "Data Mining And Analytics", "Documentation And Writing Services",
    "Entertainment", "Environmental And Energy Engineering", "Event Management And Organization",
    "Fashion Design", "Food And Drink Preparation Or Service", "Gardening And Landscaping",
    "Health Care", "Horticulture", "Hospitality And Tourism", "Human Resource And Talent Management",
    "Information Technology", "Installation And Maintenance Technician", "Janitorial And Other Office Services",
    "Labor Work And Masonry", "Law", "Livestock And Animal Husbandry", "Logistic And Supply Chain",
    "Manufacturing And Production", "Marketing And Advertisement", "Mechanical And Electrical Engineering",
    "Media And Communication", "Multimedia Content Production", "Pharmaceutical",
    "Project Management And Administration", "Psychiatry, Psychology And Social Work",
    "Purchasing And Procurement", "Research And Data Analytics", "Sales And Promotion",
    "Secretarial And Office Management", "Security And Safety", "Shop And Office Attendant",
    "Software Design And Development", "Teaching And Tutor", "Training And Consultancy",
    "Training And Mentorship", "Translation And Transcription", "Transportation",
    "Transportation And Delivery", "Veterinary", "Woodwork And Carpentry"
  ];

  const categories = await Promise.all(
    rawJobCategories.map(cat => {
      const slug = cat.toLowerCase().replace(/[, ]+/g, '-').replace(/-+$/g, '');
      return prisma.jobCategory.upsert({
        where: { slug },
        update: {},
        create: { slug, label: cat, icon: 'briefcase' } // generic icon as default
      });
    })
  );
  console.log('✅ Job categories created');

  // ── Freelance Categories ───────────────────────────────────────────────────
  await Promise.all([
    prisma.freelanceCategory.upsert({ where: { slug: 'graphic-design' },    update: {}, create: { slug: 'graphic-design',    label: 'Graphic Design',      icon: 'palette' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'web-development' },   update: {}, create: { slug: 'web-development',   label: 'Web Development',     icon: 'code-2' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'digital-marketing' }, update: {}, create: { slug: 'digital-marketing', label: 'Digital Marketing',   icon: 'megaphone' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'video-animation' },   update: {}, create: { slug: 'video-animation',   label: 'Video & Animation',   icon: 'clapperboard' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'writing' },           update: {}, create: { slug: 'writing',           label: 'Writing & Translation', icon: 'pen-line' } }),
  ]);
  console.log('✅ Freelance categories created');

  console.log('\n🎉 Database seeded successfully with Production Categories!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
