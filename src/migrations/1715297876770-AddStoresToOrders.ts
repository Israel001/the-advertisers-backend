import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoresToOrders1715297876770 implements MigrationInterface {
    name = 'AddStoresToOrders1715297876770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`stores\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_772d0ce0473ac2ccfa26060dbe9\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_5b3e94bd2aedc184f9ad8c10439\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`customer_id\` \`customer_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`payment_id\` \`payment_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_772d0ce0473ac2ccfa26060dbe9\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_5b3e94bd2aedc184f9ad8c10439\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_5b3e94bd2aedc184f9ad8c10439\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_772d0ce0473ac2ccfa26060dbe9\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`payment_id\` \`payment_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`customer_id\` \`customer_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_5b3e94bd2aedc184f9ad8c10439\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_772d0ce0473ac2ccfa26060dbe9\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`stores\``);
    }

}
