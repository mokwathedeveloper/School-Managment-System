import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Helper to get a scoped client
  // Usage: this.prisma.withSchool(schoolId).student.findMany()
  withSchool(schoolId: string) {
    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            // Add school_id filter to all operations that support it
            if (
              [
                'findFirst',
                'findMany',
                'count',
                'update',
                'updateMany',
                'delete',
                'deleteMany',
                'upsert',
              ].includes(operation)
            ) {
              args.where = { ...args.where, school_id: schoolId };
            }

            // For create, automatically inject school_id
            if (operation === 'create') {
              args.data = { ...args.data, school_id: schoolId };
            }

            if (operation === 'createMany') {
              if (Array.isArray(args.data)) {
                args.data = args.data.map((item) => ({
                  ...item,
                  school_id: schoolId,
                }));
              } else {
                args.data = { ...args.data, school_id: schoolId };
              }
            }

            return query(args);
          },
        },
      },
    });
  }
}
