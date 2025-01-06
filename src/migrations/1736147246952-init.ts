import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1736147246952 implements MigrationInterface {
    name = 'Init1736147246952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "courses" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "location" character varying NOT NULL, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses_teachers_users" ("coursesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_b61bc4666a0a1150a304c9afc26" PRIMARY KEY ("coursesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_73ed871eae0125f94cf47648cd" ON "courses_teachers_users" ("coursesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5d4a6f0a5effdb183b566bd583" ON "courses_teachers_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "courses_students_users" ("coursesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_ed6755f24befab0c66db7ea2db3" PRIMARY KEY ("coursesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cfd36369a9b027ccbc64ec2bbf" ON "courses_students_users" ("coursesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_da070fe9a0fe297e5cf5780929" ON "courses_students_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "courses_teachers_users" ADD CONSTRAINT "FK_73ed871eae0125f94cf47648cd8" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "courses_teachers_users" ADD CONSTRAINT "FK_5d4a6f0a5effdb183b566bd5833" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses_students_users" ADD CONSTRAINT "FK_cfd36369a9b027ccbc64ec2bbf7" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "courses_students_users" ADD CONSTRAINT "FK_da070fe9a0fe297e5cf57809291" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses_students_users" DROP CONSTRAINT "FK_da070fe9a0fe297e5cf57809291"`);
        await queryRunner.query(`ALTER TABLE "courses_students_users" DROP CONSTRAINT "FK_cfd36369a9b027ccbc64ec2bbf7"`);
        await queryRunner.query(`ALTER TABLE "courses_teachers_users" DROP CONSTRAINT "FK_5d4a6f0a5effdb183b566bd5833"`);
        await queryRunner.query(`ALTER TABLE "courses_teachers_users" DROP CONSTRAINT "FK_73ed871eae0125f94cf47648cd8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da070fe9a0fe297e5cf5780929"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfd36369a9b027ccbc64ec2bbf"`);
        await queryRunner.query(`DROP TABLE "courses_students_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d4a6f0a5effdb183b566bd583"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73ed871eae0125f94cf47648cd"`);
        await queryRunner.query(`DROP TABLE "courses_teachers_users"`);
        await queryRunner.query(`DROP TABLE "courses"`);
    }

}
