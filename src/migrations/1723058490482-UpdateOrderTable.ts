import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderTable1723058490482 implements MigrationInterface {
  name = 'UpdateOrderTable1723058490482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`admin_user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_772d0ce0473ac2ccfa26060dbe9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_5b3e94bd2aedc184f9ad8c10439\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('PENDING', 'PACKED_AND_READY_TO_SEND', 'PACKED_AND_READY_TO_PICKUP', 'PICKED_UP', 'SENT_FOR_DELIVERY', 'IN_PROGRESS', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_772d0ce0473ac2ccfa26060dbe9\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_5b3e94bd2aedc184f9ad8c10439\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_cd221c13081804f1c6e3df75d08\` FOREIGN KEY (\`admin_user_id\`) REFERENCES \`admin_users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_cd221c13081804f1c6e3df75d08\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_5b3e94bd2aedc184f9ad8c10439\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_772d0ce0473ac2ccfa26060dbe9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`status\` \`status\` enum ('PENDING', 'PACKED_AND_READY_TO_SEND', 'SENT_FOR_DELIVERY', 'IN_PROGRESS', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT ''PENDING''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_5b3e94bd2aedc184f9ad8c10439\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_772d0ce0473ac2ccfa26060dbe9\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP COLUMN \`admin_user_id\``,
    );
  }
}
