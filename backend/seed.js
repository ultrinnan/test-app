import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'apppassword',
  database: process.env.DB_NAME || 'user_management',
}

// Sample first and last names for generating users
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Anna', 'Stephen', 'Brenda',
  'Larry', 'Pamela', 'Justin', 'Emma', 'Scott', 'Nicole', 'Brandon', 'Helen',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Frank', 'Christine', 'Gregory', 'Debra',
  'Raymond', 'Rachel', 'Alexander', 'Carolyn', 'Patrick', 'Janet', 'Jack', 'Catherine',
  'Dennis', 'Maria', 'Jerry', 'Frances', 'Tyler', 'Ann', 'Aaron', 'Marie',
  'Jose', 'Heather', 'Henry', 'Diane', 'Adam', 'Julie', 'Douglas', 'Joyce',
  'Nathan', 'Victoria', 'Zachary', 'Kelly', 'Kyle', 'Christina', 'Noah', 'Joan',
  'Ethan', 'Evelyn', 'Jeremy', 'Judith', 'Walter', 'Megan', 'Christian', 'Cheryl',
  'Keith', 'Andrea', 'Roger', 'Hannah', 'Terry', 'Jacqueline', 'Gerald', 'Martha',
  'Harold', 'Gloria', 'Sean', 'Teresa', 'Austin', 'Sara', 'Carl', 'Janice',
  'Arthur', 'Marie', 'Lawrence', 'Julia', 'Dylan', 'Grace', 'Jesse', 'Judy',
  'Jordan', 'Theresa', 'Bryan', 'Madison', 'Billy', 'Beverly', 'Joe', 'Denise',
  'Bruce', 'Marilyn', 'Gabriel', 'Amber', 'Logan', 'Danielle', 'Alan', 'Rose',
  'Juan', 'Brittany', 'Wayne', 'Diana', 'Roy', 'Abigail', 'Ralph', 'Jane',
  'Randy', 'Lori', 'Eugene', 'Alexis', 'Vincent', 'Marie', 'Louis', 'Olivia',
  'Philip', 'Catherine', 'Johnny', 'Emma', 'Bobby', 'Cynthia', 'Noah', 'Marie',
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Sanchez',
  'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
  'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards',
  'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers',
  'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly',
  'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks',
  'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross',
  'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Patterson', 'Alexander', 'Henderson',
  'Coleman', 'Roberts', 'West', 'Tran', 'Fisher', 'Harrison', 'Gibson', 'Mcdonald',
  'Cruz', 'Marshall', 'Ortiz', 'Gomez', 'Murray', 'Freeman', 'Wells', 'Webb',
  'Simpson', 'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry',
  'Boyd', 'Mason', 'Morales', 'Kennedy', 'Warren', 'Dixon', 'Ramos', 'Reyes',
]

// Generate random email
function generateEmail(firstName, lastName) {
  const domains = ['example.com', 'test.com', 'demo.com', 'sample.org', 'mail.com']
  const domain = domains[Math.floor(Math.random() * domains.length)]
  const randomNum = Math.floor(Math.random() * 1000)
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`
}


async function seedUsers() {
  let db
  try {
    db = await mysql.createConnection(dbConfig)
    console.log('Connected to MySQL database')

    // Check if users already exist
    const [existing] = await db.execute('SELECT COUNT(*) as count FROM users')
    if (existing[0].count > 0) {
      console.log(`Database already has ${existing[0].count} users.`)
      console.log('Clearing existing users and seeding 50 new ones...')
      // Clear existing users
      await db.execute('DELETE FROM users')
      console.log('Cleared existing users.')
    }

    // Generate 50 users
    const users = []
    const usedEmails = new Set()

    for (let i = 0; i < 50; i++) {
      let firstName, lastName, email

      // Ensure unique emails
      do {
        firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        email = generateEmail(firstName, lastName)
      } while (usedEmails.has(email))

      usedEmails.add(email)

      users.push({
        email,
        password: 'password123', // Default password for all seeded users
        first_name: firstName,
        last_name: lastName,
        avatar: '', // Empty - will use Material UI Avatar with initials
      })
    }

    // Insert users in batches
    console.log('Inserting 50 users...')
    for (const user of users) {
      await db.execute(
        'INSERT INTO users (email, password, first_name, last_name, avatar) VALUES (?, ?, ?, ?, ?)',
        [user.email, user.password, user.first_name, user.last_name, user.avatar]
      )
    }

    console.log(`✅ Successfully seeded ${users.length} users!`)
    console.log('All users have password: password123')
    console.log('You can now login with any of these emails and password "password123"')

    await db.end()
    process.exit(0)
  } catch (error) {
    console.error('Seeding error:', error)
    if (db) {
      await db.end()
    }
    process.exit(1)
  }
}

seedUsers()
