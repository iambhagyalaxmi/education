const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const entries = [
    {
      day: 'Monday',
      time: '09:00 AM - 10:30 AM',
      subject: 'Data Structures',
      faculty: 'Dr. Smith',
      room: 'Room 101',
      course: 'B.Tech CS'
    },
    {
      day: 'Monday',
      time: '11:00 AM - 12:30 PM',
      subject: 'Database Systems',
      faculty: 'Prof. Johnson',
      room: 'Room 102',
      course: 'B.Tech CS'
    },
    {
      day: 'Tuesday',
      time: '09:00 AM - 10:30 AM',
      subject: 'Operating Systems',
      faculty: 'Dr. Alan',
      room: 'Room 103',
      course: 'B.Tech CS'
    },
    {
      day: 'Wednesday',
      time: '02:00 PM - 03:30 PM',
      subject: 'Computer Networks',
      faculty: 'Dr. Smith',
      room: 'Room 201',
      course: 'B.Tech IT'
    },
    {
      day: 'Thursday',
      time: '10:00 AM - 11:30 AM',
      subject: 'Software Engineering',
      faculty: 'Prof. Davis',
      room: 'Room 304',
      course: 'B.Tech CS'
    },
    {
      day: 'Friday',
      time: '01:00 PM - 02:30 PM',
      subject: 'Machine Learning',
      faculty: 'Dr. Turing',
      room: 'Room 101',
      course: 'M.Tech AI'
    }
  ];

  console.log('Clearing existing timetable entries...');
  await prisma.timetableEntry.deleteMany({});
  
  console.log('Inserting dummy timetable entries...');
  for (const entry of entries) {
    await prisma.timetableEntry.create({
      data: entry
    });
  }
  
  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
