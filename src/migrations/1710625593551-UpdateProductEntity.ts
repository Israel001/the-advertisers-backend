import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductEntity1710625593551 implements MigrationInterface {
    name = 'UpdateProductEntity1710625593551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_68863607048a1abd43772b314ef\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_6dc43b3c8cbde659f3cf9765198\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_79184e610dfe4c9a65f842ca0cf\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_c4c3b08a0a1e609972a2c6d676d\``);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`price\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`discount_price\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`discount_price\` decimal NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`attributes\` \`attributes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`store_id\` \`store_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`created_by_id\` \`created_by_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`last_updated_by_id\` \`last_updated_by_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`category_id\` \`category_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`main_category_id\` \`main_category_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_68863607048a1abd43772b314ef\` FOREIGN KEY (\`store_id\`) REFERENCES \`store\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_6dc43b3c8cbde659f3cf9765198\` FOREIGN KEY (\`created_by_id\`) REFERENCES \`store_users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_79184e610dfe4c9a65f842ca0cf\` FOREIGN KEY (\`last_updated_by_id\`) REFERENCES \`store_users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`sub_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_c4c3b08a0a1e609972a2c6d676d\` FOREIGN KEY (\`main_category_id\`) REFERENCES \`main_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_c4c3b08a0a1e609972a2c6d676d\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_79184e610dfe4c9a65f842ca0cf\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_6dc43b3c8cbde659f3cf9765198\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_68863607048a1abd43772b314ef\``);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`main_category_id\` \`main_category_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`category_id\` \`category_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`last_updated_by_id\` \`last_updated_by_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`created_by_id\` \`created_by_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`store_id\` \`store_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`attributes\` \`attributes\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`discount_price\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`discount_price\` float(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`price\` float(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_c4c3b08a0a1e609972a2c6d676d\` FOREIGN KEY (\`main_category_id\`) REFERENCES \`main_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`sub_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_79184e610dfe4c9a65f842ca0cf\` FOREIGN KEY (\`last_updated_by_id\`) REFERENCES \`store_users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_6dc43b3c8cbde659f3cf9765198\` FOREIGN KEY (\`created_by_id\`) REFERENCES \`store_users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_68863607048a1abd43772b314ef\` FOREIGN KEY (\`store_id\`) REFERENCES \`store\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
