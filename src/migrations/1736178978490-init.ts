import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1736178978490 implements MigrationInterface {
    name = 'Init1736178978490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD "updatedById" integer`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_91581454942c66e40b309a80ec5" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_91581454942c66e40b309a80ec5"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "updatedById"`);
    }

}
