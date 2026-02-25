import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Happy Path (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let schoolId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    // Get the seeded school
    const school = await prisma.school.findFirst();
    schoolId = school.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - should login admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@school.com',
        password: 'password123',
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    accessToken = response.body.access_token;
  });

  it('/students (POST) - should create a new student', async () => {
    const response = await request(app.getHttpServer())
      .post('/students')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'newstudent@test.com',
        first_name: 'Test',
        last_name: 'Student',
        admission_no: 'STU001',
        gender: 'MALE',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.admission_no).toBe('STU001');
    expect(response.body.school_id).toBe(schoolId);
  });

  it('/students (GET) - should list students', async () => {
    const response = await request(app.getHttpServer())
      .get('/students')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeGreaterThan(0);
  });
});
