import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCourseStudentEntity1736148289594 implements MigrationInterface {
    name = 'AddedCourseStudentEntity1736148289594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course_student" ("id" SERIAL NOT NULL, "pretestScore" double precision, "posttestScore" double precision, "courseId" integer, "studentId" integer, CONSTRAINT "PK_32e95e81ab1f186b99b2decb235" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "course_student" ADD CONSTRAINT "FK_3b6eec685b4adef9b3d5b65d935" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course_student" ADD CONSTRAINT "FK_5821f0e4a25bf514ea4ca87358a" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_student" DROP CONSTRAINT "FK_5821f0e4a25bf514ea4ca87358a"`);
        await queryRunner.query(`ALTER TABLE "course_student" DROP CONSTRAINT "FK_3b6eec685b4adef9b3d5b65d935"`);
        await queryRunner.query(`DROP TABLE "course_student"`);
    }

}
