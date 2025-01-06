import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsActiveToCourseEntity1736147805221 implements MigrationInterface {
    name = 'AddedIsActiveToCourseEntity1736147805221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "isActive"`);
    }

}
