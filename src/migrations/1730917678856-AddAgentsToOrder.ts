import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAgentsToOrder1730917678856 implements MigrationInterface {
  name = 'AddAgentsToOrder1730917678856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`agents\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`agents\``);
  }
}
