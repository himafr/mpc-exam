import bcrypt from 'bcryptjs';
import { pool } from '../config/db';

async function seed() {
  console.log('Seeding database...');
  try {
    const passwordHash = await bcrypt.hash('password123', 10);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Admin User', 'admin@student-dashboard.com', passwordHash, 'admin']
    );

    const { rows: courses } = await pool.query<{ id: number }>(
      `INSERT INTO courses (code, title, description, credits)
       VALUES
        ('CS101', 'Introduction to Computer Science', 'Fundamentals of programming and CS.', 3),
        ('MATH201', 'Calculus II', 'Integral calculus and series.', 4)
       ON CONFLICT (code) DO NOTHING
       RETURNING id`
    );

    const { rows: students } = await pool.query<{ id: number }>(
      `INSERT INTO students (first_name, last_name, email, year_level)
       VALUES
        ('Sara', 'Ahmed', 'sara.ahmed@example.com', 2),
        ('Omar', 'Khaled', 'omar.khaled@example.com', 1)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`
    );

    if (courses.length > 0) {
      await pool.query(
        `INSERT INTO assignments (course_id, title, description, due_date, status)
         VALUES ($1, 'Homework 1', 'Solve chapter 1 exercises.', NOW() + INTERVAL '7 days', 'pending')`,
        [courses[0].id]
      );
    }

    console.log('Seeding completed.');
    console.log('Login with: admin@student-dashboard.com / password123');
    console.log(`Inserted ${students.length} students, ${courses.length} courses.`);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();