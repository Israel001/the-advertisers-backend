import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneToAdminUsers1730828411243 implements MigrationInterface {
    name = 'AddPhoneToAdminUsers1730828411243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admin_users\` ADD \`phone\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admin_users\` DROP COLUMN \`phone\``);
    }

}
