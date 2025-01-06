import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCourseStudentEntity1736148470596 implements MigrationInterface {
    name = 'AddedCourseStudentEntity1736148470596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "course_teachers" ("coursesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_1a1d0deda3f03e729120b6cfcb0" PRIMARY KEY ("coursesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_66377dc7bf23d54638cfc3c0b7" ON "course_teachers" ("coursesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_af6a8ca56529032218b1b10169" ON "course_teachers" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "course_teachers" ADD CONSTRAINT "FK_66377dc7bf23d54638cfc3c0b7b" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "course_teachers" ADD CONSTRAINT "FK_af6a8ca56529032218b1b10169e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course_teachers" DROP CONSTRAINT "FK_af6a8ca56529032218b1b10169e"`);
        await queryRunner.query(`ALTER TABLE "course_teachers" DROP CONSTRAINT "FK_66377dc7bf23d54638cfc3c0b7b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af6a8ca56529032218b1b10169"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_66377dc7bf23d54638cfc3c0b7"`);
        await queryRunner.query(`DROP TABLE "course_teachers"`);
    }

}
