import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { FinanceModule } from './finance/finance.module';
import { AttendanceModule } from './attendance/attendance.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { GradeLevelsModule } from './grade-levels/grade-levels.module';
import { ExamsModule } from './exams/exams.module';
import { AcademicModule } from './academic/academic.module';
import { ParentsModule } from './parents/parents.module';
import { TimetableModule } from './timetable/timetable.module';
import { MessagingModule } from './messaging/messaging.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { AdmissionsModule } from './admissions/admissions.module';
import { HRModule } from './hr/hr.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { InventoryModule } from './inventory/inventory.module';
import { LibraryModule } from './library/library.module';
import { TransportModule } from './transport/transport.module';
import { HostelModule } from './hostel/hostel.module';
import { DisciplineModule } from './discipline/discipline.module';
import { CalendarModule } from './calendar/calendar.module';
import { GateModule } from './gate/gate.module';
import { HealthModule } from './health/health.module';
import { LMSModule } from './lms/lms.module';
import { AlumniModule } from './alumni/alumni.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SchoolsModule,
    FinanceModule,
    AttendanceModule,
    StudentsModule,
    ClassesModule,
    GradeLevelsModule,
    ExamsModule,
    AcademicModule,
    ParentsModule,
    TimetableModule,
    MessagingModule,
    SuperAdminModule,
    AdmissionsModule,
    HRModule,
    AnalyticsModule,
    InventoryModule,
    LibraryModule,
    TransportModule,
    HostelModule,
    DisciplineModule,
    CalendarModule,
    GateModule,
    HealthModule,
    LMSModule,
    AlumniModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
