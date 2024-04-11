import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminRoles1712871461944 implements MigrationInterface {
    name = 'AddAdminRoles1712871461944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`admin_roles\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`admin_users\` ADD \`role_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`admin_users\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`admin_users\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`admin_users\` ADD CONSTRAINT \`FK_4fd00bf1bafe85885a51d3da925\` FOREIGN KEY (\`role_id\`) REFERENCES \`admin_roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`admin_users\` DROP FOREIGN KEY \`FK_4fd00bf1bafe85885a51d3da925\``);
        await queryRunner.query(`ALTER TABLE \`admin_users\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`admin_users\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`admin_users\` DROP COLUMN \`role_id\``);
        await queryRunner.query(`DROP TABLE \`admin_roles\``);
    }

}
