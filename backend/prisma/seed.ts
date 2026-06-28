import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── 0. Users (Admin, Counselor, Faculty, Staff, Student) ───────────────────
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@institute.edu' },
      update: { phone: '+91-9876000001', department: 'Administration', isActive: true },
      create: {
        name: 'Dr. Meera Iyer',
        email: 'admin@institute.edu',
        phone: '+91-9876000001',
        role: 'admin',
        department: 'Administration',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'counselor1@institute.edu' },
      update: { phone: '+91-9876000002', department: 'Admissions', isActive: true },
      create: {
        name: 'Rahul Desai',
        email: 'counselor1@institute.edu',
        phone: '+91-9876000002',
        role: 'counselor',
        department: 'Admissions',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'counselor2@institute.edu' },
      update: { phone: '+91-9876000003', department: 'Student Affairs', isActive: true },
      create: {
        name: 'Sneha Kulkarni',
        email: 'counselor2@institute.edu',
        phone: '+91-9876000003',
        role: 'counselor',
        department: 'Student Affairs',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'faculty.cs@institute.edu' },
      update: { phone: '+91-9876000004', department: 'Computer Science', isActive: true },
      create: {
        name: 'Prof. Arvind Nair',
        email: 'faculty.cs@institute.edu',
        phone: '+91-9876000004',
        role: 'faculty',
        department: 'Computer Science',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'faculty.mca@institute.edu' },
      update: { phone: '+91-9876000005', department: 'MCA Department', isActive: true },
      create: {
        name: 'Prof. Sunita Rao',
        email: 'faculty.mca@institute.edu',
        phone: '+91-9876000005',
        role: 'faculty',
        department: 'MCA Department',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'staff.accounts@institute.edu' },
      update: { phone: '+91-9876000006', department: 'Accounts & Finance', isActive: true },
      create: {
        name: 'Anil Patkar',
        email: 'staff.accounts@institute.edu',
        phone: '+91-9876000006',
        role: 'staff',
        department: 'Accounts & Finance',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'staff.admissions@institute.edu' },
      update: { phone: '+91-9876000007', department: 'Admissions Office', isActive: true },
      create: {
        name: 'Kavita Bhatia',
        email: 'staff.admissions@institute.edu',
        phone: '+91-9876000007',
        role: 'staff',
        department: 'Admissions Office',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'student.bca@institute.edu' },
      update: { phone: '+91-9876000008', department: 'BCA Program', isActive: true },
      create: {
        name: 'Aarav Sharma',
        email: 'student.bca@institute.edu',
        phone: '+91-9876000008',
        role: 'student',
        department: 'BCA Program',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'student.mca@institute.edu' },
      update: { phone: '+91-9876000009', department: 'MCA Program', isActive: true },
      create: {
        name: 'Priya Mehta',
        email: 'student.mca@institute.edu',
        phone: '+91-9876000009',
        role: 'student',
        department: 'MCA Program',
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ ${users.length} users created`);


  // ─── 1. Courses ─────────────────────────────────────────────────────────────
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { code: 'BCA' },
      update: {},
      create: {
        code: 'BCA',
        name: 'Bachelor of Computer Applications',
        durationYears: 3,
        description: 'A 3-year undergraduate program focusing on computer applications, programming, and software development.',
      },
    }),
    prisma.course.upsert({
      where: { code: 'BSc' },
      update: {},
      create: {
        code: 'BSc',
        name: 'Bachelor of Science (Computer Science)',
        durationYears: 3,
        description: 'A 3-year undergraduate science program with strong emphasis on mathematics and computer science fundamentals.',
      },
    }),
    prisma.course.upsert({
      where: { code: 'MCA' },
      update: {},
      create: {
        code: 'MCA',
        name: 'Master of Computer Applications',
        durationYears: 2,
        description: 'A 2-year postgraduate program for advanced study in computer applications and software engineering.',
      },
    }),
    prisma.course.upsert({
      where: { code: 'BTech' },
      update: {},
      create: {
        code: 'BTech',
        name: 'Bachelor of Technology (Computer Science & Engineering)',
        durationYears: 4,
        description: 'A 4-year flagship engineering program covering software, hardware, and systems engineering.',
      },
    }),
  ]);

  const [bca, bsc, mca, btech] = courses;
  console.log('✅ Courses created');

  // ─── 1.5 AI Recommendation Data (Eligibility, Scholarships, Placements, Careers) ───
  await prisma.eligibilityCriteria.deleteMany({});
  await prisma.scholarship.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.careerPath.deleteMany({});

  const aiData = [
    {
      courseId: btech.id,
      eligibility: { requiredQuals: ['12th'], allowedStreams: ['Science'], minPercentage: 60, description: 'Must have Physics and Mathematics as core subjects.' },
      placement: { placementRate: 92.5, averageSalary: '₹6,50,000', topRecruiters: ['TCS', 'Infosys', 'Google', 'Microsoft'] },
      scholarships: [
        { name: 'Merit Scholarship', eligibility: 'Above 90% in 12th', amount: '₹50,000/year' },
        { name: 'Women in Tech', eligibility: 'Female candidates with >80%', amount: '₹25,000/year' }
      ],
      careers: ['Software Engineer', 'Data Scientist', 'System Architect']
    },
    {
      courseId: bca.id,
      eligibility: { requiredQuals: ['12th'], allowedStreams: ['Science', 'Commerce', 'Arts'], minPercentage: 50, description: 'Mathematics preferred but not mandatory.' },
      placement: { placementRate: 85.0, averageSalary: '₹4,00,000', topRecruiters: ['Wipro', 'Cognizant', 'Accenture'] },
      scholarships: [
        { name: 'Excellence Award', eligibility: 'Above 85% in 12th', amount: '₹20,000/year' }
      ],
      careers: ['Web Developer', 'UI/UX Designer', 'System Analyst']
    },
    {
      courseId: bsc.id,
      eligibility: { requiredQuals: ['12th'], allowedStreams: ['Science'], minPercentage: 55, description: 'Must have Mathematics.' },
      placement: { placementRate: 78.0, averageSalary: '₹3,50,000', topRecruiters: ['IBM', 'Capgemini', 'Local Tech Firms'] },
      scholarships: [
        { name: 'Science Pioneer', eligibility: 'Above 80% in 12th', amount: '₹15,000/year' }
      ],
      careers: ['Data Analyst', 'Research Assistant', 'IT Support']
    },
    {
      courseId: mca.id,
      eligibility: { requiredQuals: ['Graduation'], allowedStreams: ['Science', 'Commerce', 'Any'], minPercentage: 50, description: 'BCA or B.Sc (Computer Science/IT) preferred. Mathematics in 12th mandatory.' },
      placement: { placementRate: 95.0, averageSalary: '₹7,00,000', topRecruiters: ['Amazon', 'Microsoft', 'Oracle', 'TCS'] },
      scholarships: [
        { name: 'PG Merit', eligibility: 'Above 8.0 CGPA in Graduation', amount: '₹30,000/year' }
      ],
      careers: ['Senior Software Engineer', 'IT Project Manager', 'Cloud Architect']
    }
  ];

  for (const data of aiData) {
    await prisma.eligibilityCriteria.create({
      data: { courseId: data.courseId, ...data.eligibility }
    });
    await prisma.placement.create({
      data: { courseId: data.courseId, ...data.placement }
    });
    for (const schol of data.scholarships) {
      await prisma.scholarship.create({
        data: { courseId: data.courseId, ...schol }
      });
    }
    for (const career of data.careers) {
      await prisma.careerPath.create({
        data: { courseId: data.courseId, roleName: career }
      });
    }
  }
  
  // Update Course URLs
  await prisma.course.update({ where: { id: btech.id }, data: { brochureUrl: '/docs/btech-brochure.pdf', applyUrl: '/apply/btech' }});
  await prisma.course.update({ where: { id: bca.id }, data: { brochureUrl: '/docs/bca-brochure.pdf', applyUrl: '/apply/bca' }});
  await prisma.course.update({ where: { id: bsc.id }, data: { brochureUrl: '/docs/bsc-brochure.pdf', applyUrl: '/apply/bsc' }});
  await prisma.course.update({ where: { id: mca.id }, data: { brochureUrl: '/docs/mca-brochure.pdf', applyUrl: '/apply/mca' }});

  console.log('✅ AI Recommendation Data seeded');

  // ─── 2. Fee Structures ──────────────────────────────────────────────────────
  const feeData = [
    // BCA Fees
    { courseId: bca.id, academicYear: '2022-2023', admissionFee: 8000, tuitionFee: 45000, registrationFee: 1500, totalFee: 54500 },
    { courseId: bca.id, academicYear: '2023-2024', admissionFee: 9000, tuitionFee: 48000, registrationFee: 1800, totalFee: 58800 },
    { courseId: bca.id, academicYear: '2024-2025', admissionFee: 10000, tuitionFee: 52000, registrationFee: 2000, totalFee: 64000 },
    // BSc Fees
    { courseId: bsc.id, academicYear: '2022-2023', admissionFee: 7000, tuitionFee: 38000, registrationFee: 1500, totalFee: 46500 },
    { courseId: bsc.id, academicYear: '2023-2024', admissionFee: 7500, tuitionFee: 40000, registrationFee: 1500, totalFee: 49000 },
    { courseId: bsc.id, academicYear: '2024-2025', admissionFee: 8500, tuitionFee: 44000, registrationFee: 2000, totalFee: 54500 },
    // MCA Fees
    { courseId: mca.id, academicYear: '2022-2023', admissionFee: 15000, tuitionFee: 75000, registrationFee: 3000, totalFee: 93000 },
    { courseId: mca.id, academicYear: '2023-2024', admissionFee: 16000, tuitionFee: 80000, registrationFee: 3500, totalFee: 99500 },
    { courseId: mca.id, academicYear: '2024-2025', admissionFee: 18000, tuitionFee: 88000, registrationFee: 4000, totalFee: 110000 },
    // BTech Fees
    { courseId: btech.id, academicYear: '2022-2023', admissionFee: 18000, tuitionFee: 90000, registrationFee: 4000, totalFee: 112000 },
    { courseId: btech.id, academicYear: '2023-2024', admissionFee: 20000, tuitionFee: 95000, registrationFee: 4500, totalFee: 119500 },
    { courseId: btech.id, academicYear: '2024-2025', admissionFee: 22000, tuitionFee: 105000, registrationFee: 5000, totalFee: 132000 },
  ];

  for (const fee of feeData) {
    await prisma.feeStructure.upsert({
      where: { courseId_academicYear: { courseId: fee.courseId, academicYear: fee.academicYear } },
      update: {},
      create: fee,
    });
  }
  console.log('✅ Fee structures created');

  // ─── 3. Batches ─────────────────────────────────────────────────────────────
  const batches = [
    // BCA Batches
    { courseId: bca.id, academicYear: '2022-2025', startYear: 2022, endYear: 2025 },
    { courseId: bca.id, academicYear: '2023-2026', startYear: 2023, endYear: 2026 },
    { courseId: bca.id, academicYear: '2024-2027', startYear: 2024, endYear: 2027 },
    // BSc Batches
    { courseId: bsc.id, academicYear: '2022-2025', startYear: 2022, endYear: 2025 },
    { courseId: bsc.id, academicYear: '2023-2026', startYear: 2023, endYear: 2026 },
    { courseId: bsc.id, academicYear: '2024-2027', startYear: 2024, endYear: 2027 },
    // MCA Batches
    { courseId: mca.id, academicYear: '2022-2024', startYear: 2022, endYear: 2024 },
    { courseId: mca.id, academicYear: '2023-2025', startYear: 2023, endYear: 2025 },
    { courseId: mca.id, academicYear: '2024-2026', startYear: 2024, endYear: 2026 },
    // BTech Batches
    { courseId: btech.id, academicYear: '2021-2025', startYear: 2021, endYear: 2025 },
    { courseId: btech.id, academicYear: '2022-2026', startYear: 2022, endYear: 2026 },
    { courseId: btech.id, academicYear: '2024-2028', startYear: 2024, endYear: 2028 },
  ];

  const createdBatches: Record<string, string> = {};
  for (const b of batches) {
    const batch = await prisma.batch.upsert({
      where: { courseId_academicYear: { courseId: b.courseId, academicYear: b.academicYear } },
      update: {},
      create: b,
    });
    createdBatches[`${b.courseId}-${b.academicYear}`] = batch.id;
  }
  console.log('✅ Batches created');

  // ─── 4. Student Statistics ───────────────────────────────────────────────────
  const statsData = [
    // BCA
    { key: `${bca.id}-2022-2025`, totalEnrolled: 118, studentsLeft: 8, studentsGraduated: 104 },
    { key: `${bca.id}-2023-2026`, totalEnrolled: 125, studentsLeft: 6, studentsGraduated: 0 },
    { key: `${bca.id}-2024-2027`, totalEnrolled: 132, studentsLeft: 2, studentsGraduated: 0 },
    // BSc
    { key: `${bsc.id}-2022-2025`, totalEnrolled: 95, studentsLeft: 5, studentsGraduated: 85 },
    { key: `${bsc.id}-2023-2026`, totalEnrolled: 102, studentsLeft: 4, studentsGraduated: 0 },
    { key: `${bsc.id}-2024-2027`, totalEnrolled: 110, studentsLeft: 1, studentsGraduated: 0 },
    // MCA
    { key: `${mca.id}-2022-2024`, totalEnrolled: 72, studentsLeft: 3, studentsGraduated: 68 },
    { key: `${mca.id}-2023-2025`, totalEnrolled: 78, studentsLeft: 2, studentsGraduated: 0 },
    { key: `${mca.id}-2024-2026`, totalEnrolled: 85, studentsLeft: 1, studentsGraduated: 0 },
    // BTech
    { key: `${btech.id}-2021-2025`, totalEnrolled: 180, studentsLeft: 12, studentsGraduated: 162 },
    { key: `${btech.id}-2022-2026`, totalEnrolled: 195, studentsLeft: 8, studentsGraduated: 0 },
    { key: `${btech.id}-2024-2028`, totalEnrolled: 210, studentsLeft: 3, studentsGraduated: 0 },
  ];

  for (const s of statsData) {
    const batchId = createdBatches[s.key];
    if (!batchId) continue;
    await prisma.studentStatistic.upsert({
      where: { batchId },
      update: {},
      create: { batchId, totalEnrolled: s.totalEnrolled, studentsLeft: s.studentsLeft, studentsGraduated: s.studentsGraduated },
    });
  }
  console.log('✅ Student statistics created');

  // ─── 5. Sample Students (BCA 2024-2027 batch) ────────────────────────────────
  const bcaBatchId = createdBatches[`${bca.id}-2024-2027`];
  const sampleStudents = [
    { firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@student.edu', status: 'active' },
    { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@student.edu', status: 'active' },
    { firstName: 'Rohan', lastName: 'Gupta', email: 'rohan.gupta@student.edu', status: 'active' },
    { firstName: 'Sneha', lastName: 'Mehta', email: 'sneha.mehta@student.edu', status: 'active' },
    { firstName: 'Kiran', lastName: 'Rao', email: 'kiran.rao@student.edu', status: 'dropped' },
  ];
  for (const s of sampleStudents) {
    await prisma.student.upsert({
      where: { email: s.email },
      update: {},
      create: { ...s, courseId: bca.id, batchId: bcaBatchId },
    });
  }
  console.log('✅ Sample students created');

  // ─── 6. Sample Applications ──────────────────────────────────────────────────
  await prisma.application.createMany({
    data: [
      { courseId: btech.id, firstName: 'Rahul', lastName: 'Singh', email: 'rahul.s@apply.com', phone: '9876543210', academicYear: '2025-2029', status: 'pending' },
      { courseId: mca.id, firstName: 'Anjali', lastName: 'Verma', email: 'anjali.v@apply.com', phone: '9812345678', academicYear: '2025-2027', status: 'approved' },
      { courseId: bca.id, firstName: 'Dev', lastName: 'Kumar', email: 'dev.k@apply.com', academicYear: '2025-2028', status: 'pending' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Sample applications created');

  // ─── 6. Sample Audit Logs ────────────────────────────────────────────────────
  const sampleAuditLogs = [
    {
      actionType: 'INSERT', tableName: 'Student', recordId: 'sample-001',
      newValue: { firstName: 'Aarav', lastName: 'Sharma', email: 'aarav@example.com', status: 'active' },
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 Windows NT 10.0',
      changeReason: 'New student admission - BCA 2024 batch',
    },
    {
      actionType: 'UPDATE', tableName: 'FeeStructure', recordId: 'sample-002',
      oldValue: { tuitionFee: '45000.00', totalFee: '52000.00', academicYear: '2024-2025' },
      newValue: { tuitionFee: '48000.00', totalFee: '55000.00', academicYear: '2024-2025' },
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 Windows NT 10.0',
      changeReason: 'Annual fee revision approved by management',
    },
    {
      actionType: 'UPDATE', tableName: 'Application', recordId: 'sample-003',
      oldValue: { status: 'pending', email: 'priya.mehta@example.com' },
      newValue: { status: 'approved', email: 'priya.mehta@example.com' },
      userRole: 'Counselor', ipAddress: '192.168.1.20',
      deviceInfo: 'Mozilla/5.0 Firefox/119 Windows NT 10.0',
      changeReason: 'Application documents verified and approved',
    },
    {
      actionType: 'DELETE', tableName: 'Student', recordId: 'sample-004',
      oldValue: { firstName: 'Ravi', lastName: 'Patil', status: 'dropped', course: 'B.Sc' },
      newValue: null,
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 MacOS',
      changeReason: 'Student officially withdrew from institute',
    },
    {
      actionType: 'INSERT', tableName: 'Course', recordId: 'sample-005',
      newValue: { code: 'BTech', name: 'Bachelor of Technology', durationYears: 4 },
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 Windows NT 10.0',
      changeReason: 'New course added for academic year 2025',
    },
    {
      actionType: 'UPDATE', tableName: 'Ticket', recordId: 'sample-006',
      oldValue: { status: 'open', priority: 'high' },
      newValue: { status: 'resolved', priority: 'high' },
      userRole: 'Faculty', ipAddress: '10.0.0.15',
      deviceInfo: 'Mozilla/5.0 Safari/17 iPhone iOS 17',
      changeReason: 'Issue resolved by technical team',
    },
    {
      actionType: 'LOGIN', tableName: 'User', recordId: 'sample-007',
      newValue: { email: 'admin@institute.edu', loginTime: new Date().toISOString() },
      userRole: 'Admin', ipAddress: '103.24.1.55',
      deviceInfo: 'Mozilla/5.0 Chrome/120 Windows NT 10.0',
      changeReason: null,
    },
  ];

  for (const log of sampleAuditLogs) {
    await prisma.auditLog.create({ data: log });
  }
  console.log('✅ Sample audit logs created');

  console.log('\n🎉 Database seeded successfully!');

  // ─── 6. Document Categories & Documents ──────────────────────────────────────────
  console.log('Seeding Documents...');

  const catBrochure = await prisma.documentCategory.upsert({
    where: { name: 'Brochures' },
    update: {},
    create: { name: 'Brochures', description: 'Official course and admission brochures' },
  });

  const catForms = await prisma.documentCategory.upsert({
    where: { name: 'Forms' },
    update: {},
    create: { name: 'Forms', description: 'Application and request forms' },
  });

  const catPolicies = await prisma.documentCategory.upsert({
    where: { name: 'Policies' },
    update: {},
    create: { name: 'Policies', description: 'Institute rules, regulations, and policies' },
  });

  const documentsData = [
    {
      title: 'Admission Brochure 2026-27',
      categoryId: catBrochure.id,
      description: 'Complete information about courses, eligibility, admission process, fee structure, scholarships, hostel facilities, and placement.',
      keywords: ['admission', 'brochure', 'courses', 'eligibility', 'prospectus'],
      academicYear: '2026-27',
      department: 'Admissions',
      version: '1.0',
      fileUrl: '/docs/admission-brochure-2026.pdf',
      fileType: 'PDF',
      fileSize: 2500000,
    },
    {
      title: 'Hostel Application Form',
      categoryId: catForms.id,
      description: 'Official form to apply for on-campus hostel accommodation for the upcoming academic year.',
      keywords: ['hostel', 'accommodation', 'form', 'housing', 'application'],
      academicYear: '2026-27',
      department: 'Hostel Management',
      version: '1.1',
      fileUrl: '/docs/hostel-application.pdf',
      fileType: 'PDF',
      fileSize: 450000,
    },
    {
      title: 'Code of Conduct',
      categoryId: catPolicies.id,
      description: 'The official student handbook outlining rules, regulations, and disciplinary policies.',
      keywords: ['rules', 'regulations', 'conduct', 'handbook', 'discipline', 'policy'],
      academicYear: '2026-27',
      department: 'Student Affairs',
      version: '2.0',
      fileUrl: '/docs/code-of-conduct.pdf',
      fileType: 'PDF',
      fileSize: 1200000,
    },
    {
      title: 'BCA Fee Structure',
      categoryId: catBrochure.id,
      description: 'Detailed breakdown of tuition, admission, and semester fees for the BCA program.',
      keywords: ['fee', 'bca', 'tuition', 'cost', 'payment'],
      academicYear: '2026-27',
      department: 'Finance',
      version: '1.0',
      fileUrl: '/docs/bca-fees-2026.pdf',
      fileType: 'PDF',
      fileSize: 300000,
    },
    {
      title: 'Scholarship Application Form',
      categoryId: catForms.id,
      description: 'Application form for merit-based and need-based financial scholarships.',
      keywords: ['scholarship', 'financial aid', 'form', 'application'],
      academicYear: '2026-27',
      department: 'Financial Aid',
      version: '1.0',
      fileUrl: '/docs/scholarship-form.pdf',
      fileType: 'PDF',
      fileSize: 250000,
    },
  ];

  await prisma.document.deleteMany({});
  
  await prisma.document.createMany({
    data: documentsData,
  });

  console.log('✅ Documents seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
