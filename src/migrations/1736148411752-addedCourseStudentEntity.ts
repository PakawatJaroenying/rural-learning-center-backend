import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCourseStudentEntity1736148411752 implements MigrationInterface {
    name = 'AddedCourseStudentEntity1736148411752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course_students" ("id" SERIAL NOT NULL, "pretestScore" double precision, "posttestScore" double precision, "courseId" integer, "studentId" integer, CONSTRAINT "PK_acdd3f71f8a8246c6c5c0b2934f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses_teachers" ("coursesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_998d01a64ba5fdbe71c22147465" PRIMARY KEY ("coursesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_18c213708d021549333a66ba47" ON "courses_teachers" ("coursesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bff2769de811d2972435b384d2" ON "courses_teachers" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "course_students" ADD CONSTRAINT "FK_1603dce286f2440050367a7b76f" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_students" ADD CONSTRAINT "FK_0bf5fb0e9843950e6862ab55d16" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses_teachers" ADD CONSTRAINT "FK_18c213708d021549333a66ba47e" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "courses_teachers" ADD CONSTRAINT "FK_bff2769de811d2972435b384d2d" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses_teachers" DROP CONSTRAINT "FK_bff2769de811d2972435b384d2d"`);
        await queryRunner.query(`ALTER TABLE "courses_teachers" DROP CONSTRAINT "FK_18c213708d021549333a66ba47e"`);
        await queryRunner.query(`ALTER TABLE "course_students" DROP CONSTRAINT "FK_0bf5fb0e9843950e6862ab55d16"`);
        await queryRunner.query(`ALTER TABLE "course_students" DROP CONSTRAINT "FK_1603dce286f2440050367a7b76f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bff2769de811d2972435b384d2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18c213708d021549333a66ba47"`);
        await queryRunner.query(`DROP TABLE "courses_teachers"`);
        await queryRunner.query(`DROP TABLE "course_students"`);
    }

}
