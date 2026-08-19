import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const CollegeType = { PUBLIC: "PUBLIC", PRIVATE: "PRIVATE", DEEMED: "DEEMED" } as const;
const CourseType = { UG: "UG", PG: "PG", DIPLOMA: "DIPLOMA", PHD: "PHD" } as const;

const prisma = new PrismaClient();

const INDIAN_STATES = [
  "Maharashtra", "Delhi", "Tamil Nadu", "Karnataka", "Telangana",
  "West Bengal", "Uttar Pradesh", "Punjab", "Rajasthan", "Kerala"
];

async function main() {
  console.log("🌱 Starting seed script for 50+ Indian Colleges...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing database records.");

  // Create Seed Users
  const passwordHash = await bcrypt.hash("password123", 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        passwordHash,
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Patel",
        email: "priya@example.com",
        passwordHash,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ankit Verma",
        email: "ankit@example.com",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sneha Reddy",
        email: "sneha@example.com",
        passwordHash,
      },
    }),
  ]);

  console.log(`👤 Created ${users.length} seed users.`);

  // 50 College Dataset Definition
  const collegeData = [
    {
      name: "IIT Bombay - Indian Institute of Technology",
      slug: "iit-bombay",
      location: "Mumbai",
      state: "Maharashtra",
      type: CollegeType.PUBLIC,
      establishedYear: 1958,
      ranking: 1,
      rating: 4.9,
      minFees: 220000,
      maxFees: 900000,
      website: "https://www.iitb.ac.in",
      approvals: ["AICTE", "UGC", "INIB"],
      description: "IIT Bombay is a premier public technical and research university located in Powai, Mumbai. Renowned worldwide for academic excellence, cutting-edge research infrastructure, and top global alumni networks.",
      courses: [
        { name: "B.Tech Computer Science and Engineering", type: CourseType.UG, duration: "4 Years", fees: 220000 },
        { name: "B.Tech Electrical Engineering", type: CourseType.UG, duration: "4 Years", fees: 220000 },
        { name: "M.Tech Data Science & AI", type: CourseType.PG, duration: "2 Years", fees: 120000 },
        { name: "MBA (SJMSOM)", type: CourseType.PG, duration: "2 Years", fees: 450000 },
      ],
      placements: [
        { year: 2024, averagePackage: 23.5, highestPackage: 168.0, medianPackage: 20.0, placementRate: 94.5, topRecruiters: ["Google", "Microsoft", "Qualcomm", "Goldman Sachs", "Apple"] },
        { year: 2023, averagePackage: 21.8, highestPackage: 150.0, medianPackage: 19.2, placementRate: 96.0, topRecruiters: ["Meta", "Amazon", "Uber", "Tower Research"] },
      ],
    },
    {
      name: "IIT Delhi - Indian Institute of Technology",
      slug: "iit-delhi",
      location: "New Delhi",
      state: "Delhi",
      type: CollegeType.PUBLIC,
      establishedYear: 1961,
      ranking: 2,
      rating: 4.9,
      minFees: 225000,
      maxFees: 880000,
      website: "https://home.iitd.ac.in",
      approvals: ["AICTE", "UGC"],
      description: "IIT Delhi is located in Hauz Khas, New Delhi. It is recognized as an Institute of National Importance and has consistently ranked among India's top engineering universities.",
      courses: [
        { name: "B.Tech Computer Science", type: CourseType.UG, duration: "4 Years", fees: 225000 },
        { name: "B.Tech Mathematics and Computing", type: CourseType.UG, duration: "4 Years", fees: 225000 },
        { name: "M.Tech Cybersecurity", type: CourseType.PG, duration: "2 Years", fees: 110000 },
      ],
      placements: [
        { year: 2024, averagePackage: 22.8, highestPackage: 155.0, medianPackage: 19.5, placementRate: 93.0, topRecruiters: ["Microsoft", "Google", "Texas Instruments", "NVidia"] },
      ],
    },
    {
      name: "IIT Madras - Indian Institute of Technology",
      slug: "iit-madras",
      location: "Chennai",
      state: "Tamil Nadu",
      type: CollegeType.PUBLIC,
      establishedYear: 1959,
      ranking: 3,
      rating: 4.85,
      minFees: 215000,
      maxFees: 850000,
      website: "https://www.iitm.ac.in",
      approvals: ["AICTE", "UGC"],
      description: "IIT Madras has held NIRF Overall #1 rank for multiple consecutive years. It is famous for its vibrant research park, innovation ecosystems, and green campus in Chennai.",
      courses: [
        { name: "B.Tech Computer Science", type: CourseType.UG, duration: "4 Years", fees: 215000 },
        { name: "B.Tech Aerospace Engineering", type: CourseType.UG, duration: "4 Years", fees: 215000 },
        { name: "M.Sc Data Science", type: CourseType.PG, duration: "2 Years", fees: 100000 },
      ],
      placements: [
        { year: 2024, averagePackage: 21.4, highestPackage: 140.0, medianPackage: 18.5, placementRate: 92.0, topRecruiters: ["Intel", "Qualcomm", "Amazon", "Samsung R&D"] },
      ],
    },
    {
      name: "BITS Pilani - Birla Institute of Technology and Science",
      slug: "bits-pilani",
      location: "Pilani",
      state: "Rajasthan",
      type: CollegeType.PRIVATE,
      establishedYear: 1964,
      ranking: 5,
      rating: 4.8,
      minFees: 495000,
      maxFees: 1980000,
      website: "https://www.bits-pilani.ac.in",
      approvals: ["UGC", "NAAC A++"],
      description: "BITS Pilani is India's top private deemed research university. Famous for its Zero-Attendance policy, Practice School internships, and world-class merit-based curriculum.",
      courses: [
        { name: "B.E. Computer Science", type: CourseType.UG, duration: "4 Years", fees: 495000 },
        { name: "B.E. Electronics & Communication", type: CourseType.UG, duration: "4 Years", fees: 495000 },
        { name: "M.E. Software Systems", type: CourseType.PG, duration: "2 Years", fees: 380000 },
      ],
      placements: [
        { year: 2024, averagePackage: 20.2, highestPackage: 120.0, medianPackage: 18.0, placementRate: 95.0, topRecruiters: ["Atlassian", "Uber", "Google", "Oracle", "DE Shaw"] },
      ],
    },
    {
      name: "IIIT Hyderabad - International Institute of Information Technology",
      slug: "iiit-hyderabad",
      location: "Hyderabad",
      state: "Telangana",
      type: CollegeType.PRIVATE,
      establishedYear: 1998,
      ranking: 6,
      rating: 4.8,
      minFees: 360000,
      maxFees: 1440000,
      website: "https://www.iiit.ac.in",
      approvals: ["UGC", "AICTE"],
      description: "IIIT Hyderabad is an autonomous research university renowned for coding culture, competitive programming, NLP, Computer Vision research, and exceptionally high CS placements.",
      courses: [
        { name: "B.Tech Computer Science & Engineering", type: CourseType.UG, duration: "4 Years", fees: 360000 },
        { name: "B.Tech Electronics & Communication", type: CourseType.UG, duration: "4 Years", fees: 360000 },
      ],
      placements: [
        { year: 2024, averagePackage: 30.1, highestPackage: 102.0, medianPackage: 26.5, placementRate: 98.0, topRecruiters: ["Bloomberg", "CodeNation", "Apple", "Meta", "Google"] },
      ],
    },
    {
      name: "NIT Trichy - National Institute of Technology",
      slug: "nit-trichy",
      location: "Tiruchirappalli",
      state: "Tamil Nadu",
      type: CollegeType.PUBLIC,
      establishedYear: 1964,
      ranking: 9,
      rating: 4.7,
      minFees: 145000,
      maxFees: 580000,
      website: "https://www.nitt.edu",
      approvals: ["AICTE", "UGC"],
      description: "NIT Trichy is ranked #1 among all National Institutes of Technology in India. It boasts exceptional engineering departments and strong industry linkages.",
      courses: [
        { name: "B.Tech Computer Science", type: CourseType.UG, duration: "4 Years", fees: 145000 },
        { name: "B.Tech Mechanical Engineering", type: CourseType.UG, duration: "4 Years", fees: 145000 },
      ],
      placements: [
        { year: 2024, averagePackage: 15.8, highestPackage: 52.0, medianPackage: 14.0, placementRate: 91.0, topRecruiters: ["TATA Steel", "L&T", "Amazon", "Cisco", "Bosch"] },
      ],
    },
    {
      name: "VIT Vellore - Vellore Institute of Technology",
      slug: "vit-vellore",
      location: "Vellore",
      state: "Tamil Nadu",
      type: CollegeType.PRIVATE,
      establishedYear: 1984,
      ranking: 11,
      rating: 4.4,
      minFees: 198000,
      maxFees: 792000,
      website: "https://vit.ac.in",
      approvals: ["UGC", "NAAC A++"],
      description: "VIT Vellore is one of India's largest private institutions with NAAC A++ accreditation, flexible credit choice systems, and robust placement placement records.",
      courses: [
        { name: "B.Tech CSE with specialization in AI", type: CourseType.UG, duration: "4 Years", fees: 198000 },
        { name: "B.Tech Information Technology", type: CourseType.UG, duration: "4 Years", fees: 198000 },
        { name: "MCA", type: CourseType.PG, duration: "2 Years", fees: 140000 },
      ],
      placements: [
        { year: 2024, averagePackage: 9.2, highestPackage: 88.0, medianPackage: 8.0, placementRate: 86.0, topRecruiters: ["Cognizant", "TCS", "Wipro", "PayPal", "Deloitte"] },
      ],
    },
    {
      name: "DTU Delhi - Delhi Technological University",
      slug: "dtu-delhi",
      location: "New Delhi",
      state: "Delhi",
      type: CollegeType.PUBLIC,
      establishedYear: 1941,
      ranking: 14,
      rating: 4.6,
      minFees: 219000,
      maxFees: 876000,
      website: "http://dtu.ac.in",
      approvals: ["AICTE", "UGC"],
      description: "Formerly Delhi College of Engineering (DCE), DTU is one of India's oldest and most prestigious engineering institutions known for campus life and corporate placements.",
      courses: [
        { name: "B.Tech Software Engineering", type: CourseType.UG, duration: "4 Years", fees: 219000 },
        { name: "B.Tech Information Technology", type: CourseType.UG, duration: "4 Years", fees: 219000 },
      ],
      placements: [
        { year: 2024, averagePackage: 15.4, highestPackage: 82.0, medianPackage: 13.5, placementRate: 89.0, topRecruiters: ["Sprinklr", "Paytm", "Salesforce", "JPMorgan"] },
      ],
    },
    {
      name: "SRM Institute of Science and Technology",
      slug: "srm-chennai",
      location: "Chennai",
      state: "Tamil Nadu",
      type: CollegeType.PRIVATE,
      establishedYear: 1985,
      ranking: 18,
      rating: 4.3,
      minFees: 260000,
      maxFees: 1040000,
      website: "https://www.srmist.edu.in",
      approvals: ["UGC", "NAAC A++"],
      description: "SRM Kattankulathur is a sprawling university offering high-tech infrastructure, foreign exchange programs, and extensive placement drives.",
      courses: [
        { name: "B.Tech Computer Science and Engineering", type: CourseType.UG, duration: "4 Years", fees: 260000 },
        { name: "B.Tech Cloud Computing", type: CourseType.UG, duration: "4 Years", fees: 260000 },
      ],
      placements: [
        { year: 2024, averagePackage: 7.8, highestPackage: 45.0, medianPackage: 6.8, placementRate: 84.0, topRecruiters: ["TCS", "Infosys", "Capgemini", "Accenture"] },
      ],
    },
    {
      name: "COEP Technological University",
      slug: "coep-pune",
      location: "Pune",
      state: "Maharashtra",
      type: CollegeType.PUBLIC,
      establishedYear: 1854,
      ranking: 22,
      rating: 4.6,
      minFees: 135000,
      maxFees: 540000,
      website: "https://www.coep.org.in",
      approvals: ["AICTE", "UGC"],
      description: "COEP is the third oldest engineering college in Asia. Located in Pune, it is celebrated for engineering traditions, student clubs, and tech leadership.",
      courses: [
        { name: "B.Tech Computer Engineering", type: CourseType.UG, duration: "4 Years", fees: 135000 },
        { name: "B.Tech Electronics & Telecommunication", type: CourseType.UG, duration: "4 Years", fees: 135000 },
      ],
      placements: [
        { year: 2024, averagePackage: 11.5, highestPackage: 50.0, medianPackage: 10.0, placementRate: 88.0, topRecruiters: ["Barclays", "Mastercard", "Nvidia", "TATA Motors"] },
      ],
    },
  ];

  // Helper to generate additional 40 realistic colleges to hit 50+ total
  const additionalNames = [
    { name: "IIT Roorkee", loc: "Roorkee", state: "Uttarakhand", type: CollegeType.PUBLIC, rank: 4, fee: 230000 },
    { name: "IIT Kharagpur", loc: "Kharagpur", state: "West Bengal", type: CollegeType.PUBLIC, rank: 5, fee: 220000 },
    { name: "IIT Guwahati", loc: "Guwahati", state: "Assam", type: CollegeType.PUBLIC, rank: 7, fee: 220000 },
    { name: "IIT Hyderabad", loc: "Hyderabad", state: "Telangana", type: CollegeType.PUBLIC, rank: 8, fee: 230000 },
    { name: "NIT Warangal", loc: "Warangal", state: "Telangana", type: CollegeType.PUBLIC, rank: 10, fee: 140000 },
    { name: "NIT Surathkal", loc: "Surathkal", state: "Karnataka", type: CollegeType.PUBLIC, rank: 12, fee: 145000 },
    { name: "NIT Calicut", loc: "Calicut", state: "Kerala", type: CollegeType.PUBLIC, rank: 15, fee: 138000 },
    { name: "NIT Rourkela", loc: "Rourkela", state: "Odisha", type: CollegeType.PUBLIC, rank: 16, fee: 140000 },
    { name: "IIIT Delhi", loc: "New Delhi", state: "Delhi", type: CollegeType.PUBLIC, rank: 13, fee: 380000 },
    { name: "IIIT Bangalore", loc: "Bangalore", state: "Karnataka", type: CollegeType.PRIVATE, rank: 17, fee: 420000 },
    { name: "Manipal Institute of Technology", loc: "Manipal", state: "Karnataka", type: CollegeType.PRIVATE, rank: 20, fee: 385000 },
    { name: "Thapar Institute of Engineering & Tech", loc: "Patiala", state: "Punjab", type: CollegeType.DEEMED, rank: 21, fee: 390000 },
    { name: "RV College of Engineering", loc: "Bangalore", state: "Karnataka", type: CollegeType.PRIVATE, rank: 23, fee: 250000 },
    { name: "PSG College of Technology", loc: "Coimbatore", state: "Tamil Nadu", type: CollegeType.PUBLIC, rank: 24, fee: 120000 },
    { name: "VJTI Mumbai", loc: "Mumbai", state: "Maharashtra", type: CollegeType.PUBLIC, rank: 25, fee: 110000 },
    { name: "NSUT Delhi - Netaji Subhas Univ", loc: "New Delhi", state: "Delhi", type: CollegeType.PUBLIC, rank: 19, fee: 215000 },
    { name: "Amity University Noida", loc: "Noida", state: "Uttar Pradesh", type: CollegeType.PRIVATE, rank: 35, fee: 320000 },
    { name: "LPU - Lovely Professional University", loc: "Jalandhar", state: "Punjab", type: CollegeType.PRIVATE, rank: 40, fee: 240000 },
    { name: "Chandigarh University", loc: "Mohali", state: "Punjab", type: CollegeType.PRIVATE, rank: 38, fee: 210000 },
    { name: "Christ University", loc: "Bangalore", state: "Karnataka", type: CollegeType.DEEMED, rank: 30, fee: 220000 },
    { name: "Symbiosis Institute of Tech", loc: "Pune", state: "Maharashtra", type: CollegeType.PRIVATE, rank: 32, fee: 310000 },
    { name: "KIIT University", loc: "Bhubaneswar", state: "Odisha", type: CollegeType.DEEMED, rank: 34, fee: 350000 },
    { name: "Shiv Nadar University", loc: "Greater Noida", state: "Uttar Pradesh", type: CollegeType.PRIVATE, rank: 28, fee: 400000 },
    { name: "Ashoka University", loc: "Sonipat", state: "Haryana", type: CollegeType.PRIVATE, rank: 29, fee: 850000 },
    { name: "IISc Bangalore", loc: "Bangalore", state: "Karnataka", type: CollegeType.PUBLIC, rank: 1, fee: 45000 },
    { name: "Jadavpur University", loc: "Kolkata", state: "West Bengal", type: CollegeType.PUBLIC, rank: 10, fee: 15000 },
    { name: "Anna University", loc: "Chennai", state: "Tamil Nadu", type: CollegeType.PUBLIC, rank: 14, fee: 55000 },
    { name: "BHU - Banaras Hindu University", loc: "Varanasi", state: "Uttar Pradesh", type: CollegeType.PUBLIC, rank: 15, fee: 35000 },
    { name: "Delhi University - DU", loc: "New Delhi", state: "Delhi", type: CollegeType.PUBLIC, rank: 12, fee: 25000 },
    { name: "Mumbai University", loc: "Mumbai", state: "Maharashtra", type: CollegeType.PUBLIC, rank: 26, fee: 40000 },
    { name: "Jamia Millia Islamia", loc: "New Delhi", state: "Delhi", type: CollegeType.PUBLIC, rank: 27, fee: 35000 },
    { name: "Aligarh Muslim University", loc: "Aligarh", state: "Uttar Pradesh", type: CollegeType.PUBLIC, rank: 31, fee: 38000 },
    { name: "PES University", loc: "Bangalore", state: "Karnataka", type: CollegeType.PRIVATE, rank: 33, fee: 360000 },
    { name: "BMS College of Engineering", loc: "Bangalore", state: "Karnataka", type: CollegeType.PRIVATE, rank: 36, fee: 260000 },
    { name: "MS Ramaiah Institute of Tech", loc: "Bangalore", state: "Karnataka", type: CollegeType.PRIVATE, rank: 37, fee: 270000 },
    { name: "K J Somaiya College of Engg", loc: "Mumbai", state: "Maharashtra", type: CollegeType.PRIVATE, rank: 39, fee: 320000 },
    { name: "MIT World Peace University", loc: "Pune", state: "Maharashtra", type: CollegeType.PRIVATE, rank: 41, fee: 340000 },
    { name: "UPES Dehradun", loc: "Dehradun", state: "Uttarakhand", type: CollegeType.PRIVATE, rank: 42, fee: 380000 },
    { name: "Nirma University", loc: "Ahmedabad", state: "Gujarat", type: CollegeType.PRIVATE, rank: 43, fee: 230000 },
    { name: "SSN College of Engineering", loc: "Chennai", state: "Tamil Nadu", type: CollegeType.PRIVATE, rank: 44, fee: 180000 },
  ];

  const fullList = [
    ...collegeData,
    ...additionalNames.map((item) => ({
      name: item.name,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      location: item.loc,
      state: item.state,
      type: item.type,
      establishedYear: 1950 + Math.floor(Math.random() * 60),
      ranking: item.rank,
      rating: Number((4.0 + Math.random() * 0.9).toFixed(1)),
      minFees: item.fee,
      maxFees: item.fee * 4,
      website: `https://${item.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.edu.in`,
      approvals: ["AICTE", "UGC"],
      description: `${item.name} is a premier educational institution situated in ${item.loc}, ${item.state}. Known for academic excellence, state-of-the-art facilities, and stellar placement opportunities.`,
      courses: [
        { name: "B.Tech Computer Science", type: CourseType.UG, duration: "4 Years", fees: item.fee },
        { name: "B.Tech Electronics & Comm", type: CourseType.UG, duration: "4 Years", fees: item.fee },
        { name: "M.Tech Software Engineering", type: CourseType.PG, duration: "2 Years", fees: Math.round(item.fee * 0.7) },
      ],
      placements: [
        {
          year: 2024,
          averagePackage: Number((8.0 + Math.random() * 12).toFixed(1)),
          highestPackage: Number((25.0 + Math.random() * 60).toFixed(1)),
          medianPackage: Number((7.0 + Math.random() * 10).toFixed(1)),
          placementRate: Number((82.0 + Math.random() * 15).toFixed(1)),
          topRecruiters: ["Infosys", "TCS", "Wipro", "Amazon", "Microsoft"],
        },
      ],
    })),
  ];

  console.log(`📦 Inserting ${fullList.length} total colleges with full course & placement schemas...`);

  for (const c of fullList) {
    const createdCollege = await prisma.college.create({
      data: {
        name: c.name,
        slug: c.slug,
        location: c.location,
        state: c.state,
        type: c.type,
        establishedYear: c.establishedYear,
        ranking: c.ranking,
        rating: c.rating,
        minFees: c.minFees,
        maxFees: c.maxFees,
        website: c.website,
        approvals: JSON.stringify(c.approvals || []),
        description: c.description,
        courses: {
          create: c.courses,
        },
        placements: {
          create: c.placements.map((p) => ({
            ...p,
            topRecruiters: JSON.stringify(p.topRecruiters || []),
          })),
        },
      },
    });

    // Seed 2 reviews per college from our seed users
    await prisma.review.createMany({
      data: [
        {
          collegeId: createdCollege.id,
          userId: users[0].id,
          rating: Math.max(3, Math.min(5, Math.round(c.rating))),
          title: "Excellent faculty and academic environment",
          content: `Studying at ${c.name} has been a transformative experience. The labs are well-equipped, coding clubs are active, and campus placements are solid.`,
        },
        {
          collegeId: createdCollege.id,
          userId: users[1].id,
          rating: 4,
          title: "Great placement opportunities and campus life",
          content: "The culture here encourages innovation and peer learning. Great mess food options and student activities all year round.",
        },
      ],
    });
  }

  console.log("✅ Seed dataset generated successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
