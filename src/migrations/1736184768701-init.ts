import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1736184768701 implements MigrationInterface {
    name = 'Init1736184768701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD "coverImage" text`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "updatedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "createdById" integer`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_3fff66ead8c0964a1805eb194b3" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_3fff66ead8c0964a1805eb194b3"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "coverImage"`);
    }

}
