import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1704541693853 implements MigrationInterface {
  name = 'InitialMigration1704541693853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notification_templates\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`body\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`state\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`stripped_name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`lga\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`stripped_name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`state_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`customers\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(150) NOT NULL, \`phone\` varchar(15) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`street\` varchar(255) NOT NULL, \`landmark\` varchar(255) NULL, \`house_no\` varchar(255) NULL, \`address\` varchar(255) NULL, \`type\` enum ('CUSTOMER', 'STORE') NOT NULL, \`verified\` tinyint NOT NULL, \`last_logged_in\` datetime NULL, \`deleted_at\` datetime(6) NULL, \`state_id\` int NULL, \`lga_id\` int NULL, UNIQUE INDEX \`IDX_88acd889fbe17d0e16cc4bc917\` (\`phone\`), UNIQUE INDEX \`IDX_8536b8b85c06969f84f0c098b0\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`otp\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`otp\` varchar(6) NOT NULL, \`pin_id\` varchar(255) NOT NULL, \`expired_at\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`store\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`store_name\` varchar(100) NOT NULL, \`street\` varchar(50) NOT NULL, \`landmark\` varchar(50) NOT NULL, \`house_no\` varchar(255) NULL, \`address\` varchar(255) NULL, \`contact_name\` varchar(150) NOT NULL, \`contact_phone\` varchar(15) NOT NULL, \`contact_email\` varchar(50) NOT NULL, \`deleted_at\` datetime(6) NULL, \`state_id\` int NULL, \`lga_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`store_users\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`email\` varchar(50) NOT NULL, \`phone\` varchar(15) NOT NULL, \`password\` varchar(255) NOT NULL, \`type\` enum ('CUSTOMER', 'STORE') NOT NULL, \`verified\` tinyint NOT NULL, \`invited\` tinyint NOT NULL, \`last_logged_in\` datetime NULL, \`deleted_at\` datetime(6) NULL, \`store_id\` int NULL, \`role_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lga\` ADD CONSTRAINT \`FK_b91c4c5215f0e4e21c641d7c2d4\` FOREIGN KEY (\`state_id\`) REFERENCES \`state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_eb8df86f039ec0527a50f997e5f\` FOREIGN KEY (\`state_id\`) REFERENCES \`state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_00844978c335c890eb4aed62b64\` FOREIGN KEY (\`lga_id\`) REFERENCES \`lga\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`store\` ADD CONSTRAINT \`FK_53320d54741e01faffb961bd725\` FOREIGN KEY (\`state_id\`) REFERENCES \`state\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`store\` ADD CONSTRAINT \`FK_213b4c60a157a967912a8f69043\` FOREIGN KEY (\`lga_id\`) REFERENCES \`lga\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`store_users\` ADD CONSTRAINT \`FK_3077a42ec6ad94cfb93f919359d\` FOREIGN KEY (\`store_id\`) REFERENCES \`store\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`store_users\` ADD CONSTRAINT \`FK_ba2b5410f84b94c4476525114b0\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`store_users\` DROP FOREIGN KEY \`FK_ba2b5410f84b94c4476525114b0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`store_users\` DROP FOREIGN KEY \`FK_3077a42ec6ad94cfb93f919359d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`store\` DROP FOREIGN KEY \`FK_213b4c60a157a967912a8f69043\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`store\` DROP FOREIGN KEY \`FK_53320d54741e01faffb961bd725\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_00844978c335c890eb4aed62b64\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_eb8df86f039ec0527a50f997e5f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lga\` DROP FOREIGN KEY \`FK_b91c4c5215f0e4e21c641d7c2d4\``,
    );
    await queryRunner.query(`DROP TABLE \`store_users\``);
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(`DROP TABLE \`store\``);
    await queryRunner.query(`DROP TABLE \`otp\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8536b8b85c06969f84f0c098b0\` ON \`customers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_88acd889fbe17d0e16cc4bc917\` ON \`customers\``,
    );
    await queryRunner.query(`DROP TABLE \`customers\``);
    await queryRunner.query(`DROP TABLE \`lga\``);
    await queryRunner.query(`DROP TABLE \`state\``);
    await queryRunner.query(`DROP TABLE \`notification_templates\``);
  }
}
