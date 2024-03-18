import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCustomerAndStoreTable1710533321813 implements MigrationInterface {
    name = 'UpdateCustomerAndStoreTable1710533321813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_00844978c335c890eb4aed62b64\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_eb8df86f039ec0527a50f997e5f\``);
        await queryRunner.query(`ALTER TABLE \`store\` DROP FOREIGN KEY \`FK_213b4c60a157a967912a8f69043\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`street\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`landmark\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`house_no\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`address\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`state_id\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`lga_id\``);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`lga_id\``);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`type\` enum ('CUSTOMER', 'STORE') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`last_logged_in\` \`last_logged_in\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP FOREIGN KEY \`FK_53320d54741e01faffb961bd725\``);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`street\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`street\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`landmark\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`landmark\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`house_no\` \`house_no\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`address\` \`address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`state_id\` \`state_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` ADD CONSTRAINT \`FK_53320d54741e01faffb961bd725\` FOREIGN KEY (\`state_id\`) REFERENCES \`state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`store\` DROP FOREIGN KEY \`FK_53320d54741e01faffb961bd725\``);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`state_id\` \`state_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`house_no\` \`house_no\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`landmark\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`landmark\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` DROP COLUMN \`street\``);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`street\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`store\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`store\` ADD CONSTRAINT \`FK_53320d54741e01faffb961bd725\` FOREIGN KEY (\`state_id\`) REFERENCES \`state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`deleted_at\` \`deleted_at\` datetime(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`last_logged_in\` \`last_logged_in\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`type\` enum ('CUSTOMER', 'STORE') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`store\` ADD \`lga_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`lga_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`state_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`house_no\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`landmark\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`street\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`store\` ADD CONSTRAINT \`FK_213b4c60a157a967912a8f69043\` FOREIGN KEY (\`lga_id\`) REFERENCES \`lga\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_eb8df86f039ec0527a50f997e5f\` FOREIGN KEY (\`state_id\`) REFERENCES \`state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_00844978c335c890eb4aed62b64\` FOREIGN KEY (\`lga_id\`) REFERENCES \`lga\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
