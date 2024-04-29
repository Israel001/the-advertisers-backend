import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNameToAddress1714175340673 implements MigrationInterface {
    name = 'AddNameToAddress1714175340673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP FOREIGN KEY \`FK_7482082bf53fd0ba88a32e3de88\``);
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP FOREIGN KEY \`FK_7a09eedbe103fab90c2890e525e\``);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`landmark\` \`landmark\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`house_no\` \`house_no\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`customer_id\` \`customer_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`state_id\` \`state_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD CONSTRAINT \`FK_7482082bf53fd0ba88a32e3de88\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD CONSTRAINT \`FK_7a09eedbe103fab90c2890e525e\` FOREIGN KEY (\`state_id\`) REFERENCES \`state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP FOREIGN KEY \`FK_7a09eedbe103fab90c2890e525e\``);
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP FOREIGN KEY \`FK_7482082bf53fd0ba88a32e3de88\``);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`state_id\` \`state_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`customer_id\` \`customer_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`house_no\` \`house_no\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`landmark\` \`landmark\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD CONSTRAINT \`FK_7a09eedbe103fab90c2890e525e\` FOREIGN KEY (\`state_id\`) REFERENCES \`state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`addresses\` ADD CONSTRAINT \`FK_7482082bf53fd0ba88a32e3de88\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`addresses\` DROP COLUMN \`name\``);
    }

}
