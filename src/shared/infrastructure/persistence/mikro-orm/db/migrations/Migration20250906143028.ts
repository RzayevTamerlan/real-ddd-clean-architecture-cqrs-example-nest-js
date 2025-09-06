import { Migration } from '@mikro-orm/migrations';

export class Migration20250906143028 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "name" varchar(100) not null, "normalized_name" varchar(100) not null, "surname" varchar(100) not null, "normalized_surname" varchar(100) not null, "email" varchar(255) not null, "normalized_email" varchar(255) not null, "phone" varchar(20) not null, "password" text not null, "status" text check ("status" in ('active', 'banned')) not null default 'active', constraint "users_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );
    this.addSql(
      `alter table "users" add constraint "users_normalized_email_unique" unique ("normalized_email");`,
    );
    this.addSql(`create index "users_email_index" on "users" ("email");`);
    this.addSql(
      `create index "users_normalized_email_index" on "users" ("normalized_email");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }
}
