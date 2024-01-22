import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductsTable1705191196876 implements MigrationInterface {
    name = 'AddProductsTable1705191196876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`featured_image\` varchar(255) NOT NULL, \`images\` varchar(255) NOT NULL, \`quantity\` int NOT NULL DEFAULT '0', \`out_of_stock\` tinyint NOT NULL, \`price\` float NOT NULL, \`discount_price\` float NOT NULL, \`description\` text NOT NULL, \`avg_rating\` int NOT NULL DEFAULT '0', \`attributes\` text NULL, \`store_id\` int NULL, \`created_by_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_68863607048a1abd43772b314ef\` FOREIGN KEY (\`store_id\`) REFERENCES \`store\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_6dc43b3c8cbde659f3cf9765198\` FOREIGN KEY (\`created_by_id\`) REFERENCES \`store_users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_6dc43b3c8cbde659f3cf9765198\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_68863607048a1abd43772b314ef\``);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
