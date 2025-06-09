export default class System {
  constructor() {}

  static async systemCheck(sql) {
    const tableCheck = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'pw_users'
          ) AS table_exists;
        `;

    if (!tableCheck[0].table_exists) {
      return { success: false, error: 'Table "users" does not exist' };
    }

    return { success: true };
  }

  static async createDatabase(sql, email, first_name, last_name, display_name, password) {
    const tableCheck = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'pw_users'
          ) AS table_exists;
        `;
    if (!tableCheck[0].table_exists) {
      const created = await System.createTables(sql);
      if (created == 11) {
        const userLogin = email.split('@')[0];
        const userNicename = userLogin
          .replace(/_/g, ' ')
          .replace(/@/g, '-')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        const userUrl = '';
        const userRegistered = new Date().toISOString().split('T')[0];
        const userStatus = 0;
        const result = await sql`
            INSERT INTO pw_users (
                user_login, user_pass, user_nicename, user_email,
                user_registered, user_status, display_name,
                first_name, last_name
            ) VALUES (
                ${userLogin}, ${password}, ${userNicename}, ${email},
                ${userRegistered}, ${userStatus}, ${display_name},
                ${first_name}, ${last_name}
            ) RETURNING *;
        `;
        await sql.begin(async (sql) => {
          // Insert user roles (no system override needed)
          await sql`
            INSERT INTO pw_options (option_name, option_value) VALUES (
              'pw_user_roles',
              '[
                { "id": 1, "role": "administrator" },
                { "id": 2, "role": "editor" },
                { "id": 3, "role": "author" },
                { "id": 4, "role": "contributor" },
                { "id": 5, "role": "subscriber" }
              ]'
            );
          `;

          await sql`
            INSERT INTO pw_options ("option_id", "option_name", "option_value") 
            OVERRIDING SYSTEM VALUE VALUES 
            (2, 'media_settings', '[{"title":"Banner","slug":"banner","width":2400,"height":1600},{"title":"Thumbnail","slug":"thumbnail","width":150,"height":150},{"title":"Medium","slug":"medium","width":300,"height":200},{"title":"Large","slug":"large","width":1024,"height":683}]'),
            (4, 'site_theme', '1'),
            (5, 'themes', '[{"id":1,"name":"Theme2025","location":"/Content/Theme2025"}]'),
            (6, 'site_title', 'Test'),
            (7, 'site_tagline', NULL),
            (9, 'admin_email', 'test@example.com'),
            (8, 'site_address', 'http://localhost:8787'),
            (10, 'new_user_role', 'subscriber'),
            (11, 'default_post_category', NULL),
            (14, 'show_at_most', '10'),
            (15, 'search_engine_visibility', 'true');
            (16, 'menus', '[]');
          `;
        });
        if (result.length > 0) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
            error: 'Failed to insert the first user.',
          };
        }
      } else {
        return {
          success: false,
          error: 'Failed to create the tables.',
        };
      }
    } else {
      return {
        success: false,
        error: 'Tables already exist so cannot create system and first user.',
      };
    }
  }

  static async createTables(sql) {
    let created = 0;
    const tables = [
      'pw_commentmeta',
      'pw_comments',
      'pw_options',
      'pw_postmeta',
      'pw_posts',
      'pw_page_templates',
      'pw_term_relationships',
      'pw_term_taxonomy',
      'pw_termmeta',
      'pw_terms',
      'pw_usermeta',
      'pw_users',
    ];
    for (const table of tables) {
      const tableCheck = await sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${table}
          ) AS table_exists;
        `;

      if (!tableCheck[0].table_exists) {
        let createTableSQL;

        switch (table) {
          case 'pw_commentmeta':
            createTableSQL = await System.getSqlForTableCommentMeta(table);
            break;
          case 'pw_comments':
            createTableSQL = await System.getSqlForTableComments(table);
            break;
          case 'pw_options':
            createTableSQL = await System.getSqlForTableOptions(table);
            break;
          case 'pw_postmeta':
            createTableSQL = await System.getSqlForTablePostmeta(table);
            break;
          case 'pw_posts':
            createTableSQL = await System.getSqlForTablePosts(table);
            break;
          case 'pw_term_relationships':
            createTableSQL = await System.getSqlForTableTermRelationships(table);
            break;
          case 'pw_term_taxonomy':
            createTableSQL = await System.getSqlForTableTermTaxonomy(table);
            break;
          case 'pw_termmeta':
            createTableSQL = await System.getSqlForTableTermMeta(table);
            break;
          case 'pw_terms':
            createTableSQL = await System.getSqlForTableTerms(table);
            break;
          case 'pw_usermeta':
            createTableSQL = await System.getSqlForTableUserMeta(table);
            break;
          case 'pw_users':
            createTableSQL = await System.getSqlForTableUsers(table);
            break;
          case 'pw_page_templates':
            createTableSQL = await System.getSqlForTablePageTemplates(table);
            break;
        }

        if (createTableSQL) {
          try {
            // Execute the table creation query
            await sql.unsafe(createTableSQL);

            // Verify the table was created successfully
            const postCreationCheck = await sql`
              SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = ${table}
              ) AS table_exists;
            `;

            if (postCreationCheck[0].table_exists) {
              created++;
            } else {
            }
          } catch (error) {
            console.error(`Failed to create table "${table}":`, error.message);
            console.error(`Error details:`, error);
            if (error.code) {
              console.error(`PostgreSQL error code: ${error.code}`);
            }
          }
        }
      }
    }
    await sql`
      INSERT INTO pw_options (option_name, option_value)
      VALUES (
        'media_settings',
        '[{"title":"Banner","slug":"banner","width":2400,"height":1600},{"title":"Thumbnail","slug":"thumbnail","width":150,"height":150},{"title":"Medium","slug":"medium","width":300,"height":200},{"title":"Large","slug":"large","width":1024,"height":683}]'
      );
    `;
    return created;
  }

  static async getSqlForTableCommentMeta(table) {
    return `
    DROP TABLE IF EXISTS "public"."${table}";
    CREATE TABLE "public"."${table}" (
      "meta_id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
        INCREMENT 1
        MINVALUE 1
        MAXVALUE 2147483647
        START 1
        CACHE 1
      ),
      "comment_id" int4,
      "meta_key" varchar(255) COLLATE "pg_catalog"."default",
      "meta_value" text COLLATE "pg_catalog"."default"
    );
    ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
    ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_commentmeta_pkey" PRIMARY KEY ("meta_id");
    SELECT setval('"public"."pw_commentmeta_meta_id_seq"', 1, false);
  `;
  }

  static async getSqlForTableComments(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "comment_id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "comment_post_id" int4,
        "comment_author" varchar(255) COLLATE "pg_catalog"."default",
        "comment_author_email" varchar(255) COLLATE "pg_catalog"."default",
        "comment_author_url" varchar(255) COLLATE "pg_catalog"."default",
        "comment_author_ip" varchar(255) COLLATE "pg_catalog"."default",
        "comment_date" date,
        "comment_date_gmt" date,
        "comment_content" text COLLATE "pg_catalog"."default",
        "comment_approved" varchar(20) COLLATE "pg_catalog"."default",
        "comment_type" varchar(20) COLLATE "pg_catalog"."default",
        "comment_parent" int4,
        "user_id" int4
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_comments_pkey" PRIMARY KEY ("comment_id");
      SELECT setval('"public"."pw_comments_comment_id_seq"', 1, false);
    `;
  }

  static async getSqlForTableOptions(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "option_id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "option_name" varchar(255) COLLATE "pg_catalog"."default",
        "option_value" text COLLATE "pg_catalog"."default"
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_options_pkey" PRIMARY KEY ("option_id");
      SELECT setval('"public"."pw_options_option_id_seq"', 1, false);
    `;
  }

  static async getSqlForTablePostmeta(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "meta_id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "post_id" int4,
        "meta_key" varchar(255) COLLATE "pg_catalog"."default",
        "meta_value" text COLLATE "pg_catalog"."default"
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_postmeta_pkey" PRIMARY KEY ("meta_id");
      SELECT setval('"public"."pw_postmeta_meta_id_seq"', 1, false);
    `;
  }

  static async getSqlForTablePosts(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "post_date" date,
        "post_date_gmt" date,
        "post_content" text COLLATE "pg_catalog"."default",
        "post_title" varchar(255) COLLATE "pg_catalog"."default",
        "post_excerpt" text COLLATE "pg_catalog"."default",
        "post_status" varchar(20) COLLATE "pg_catalog"."default",
        "post_password" varchar(255) COLLATE "pg_catalog"."default",
        "post_name" varchar(200) COLLATE "pg_catalog"."default",
        "post_modified" date,
        "post_modified_gmt" date,
        "post_parent" int4,
        "guid" varchar(255) COLLATE "pg_catalog"."default",
        "menu_order" int4,
        "post_type" varchar(20) COLLATE "pg_catalog"."default",
        "post_mime_type" varchar(100) COLLATE "pg_catalog"."default",
        "post_author" int4,
        "menu_order" int4
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_posts_pkey" PRIMARY KEY ("id");
      SELECT setval('"public"."pw_posts_id_seq"', 1, false);
    `;
  }

  static async getSqlForTableTermRelationships(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "object_id" int4 NOT NULL,
        "term_taxonomy_id" int4,
        "term_order" int4
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
    `;
  }

  static async getSqlForTableTermTaxonomy(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "term_taxonomy_id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "term_id" int4,
        "taxonomy" varchar(32) COLLATE "pg_catalog"."default",
        "description" text COLLATE "pg_catalog"."default",
        "parent" int4,
        "count" int4
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_term_taxonomy_pkey" PRIMARY KEY ("term_taxonomy_id");
      SELECT setval('"public"."pw_term_taxonomy_term_taxonomy_id_seq"', 1, false);
    `;
  }

  static async getSqlForTableTermMeta(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "meta_id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "term_id" int4,
        "meta_key" varchar(255) COLLATE "pg_catalog"."default",
        "meta_value" text COLLATE "pg_catalog"."default"
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_termmeta_pkey" PRIMARY KEY ("meta_id");
      SELECT setval('"public"."pw_termmeta_meta_id_seq"', 1, false);
    `;
  }

  static async getSqlForTableTerms(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "term_id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "name" varchar(200) COLLATE "pg_catalog"."default",
        "slug" varchar(200) COLLATE "pg_catalog"."default",
        "term_group" int4
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_terms_pkey" PRIMARY KEY ("term_id");
      SELECT setval('"public"."pw_terms_term_id_seq"', 1, false);
    `;
  }

  static async getSqlForTableUserMeta(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "umeta_id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "user_id" int4,
        "meta_key" varchar(255) COLLATE "pg_catalog"."default",
        "meta_value" text COLLATE "pg_catalog"."default"
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_usermeta_pkey" PRIMARY KEY ("umeta_id");
      SELECT setval('"public"."pw_usermeta_umeta_id_seq"', 1, false);
    `;
  }

  static async getSqlForTableUsers(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";
      CREATE TABLE "public"."${table}" (
        "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "user_login" varchar(60) COLLATE "pg_catalog"."default",
        "user_pass" varchar(255) COLLATE "pg_catalog"."default",
        "user_nicename" varchar(50) COLLATE "pg_catalog"."default",
        "user_email" varchar(255) COLLATE "pg_catalog"."default",
        "user_url" varchar(255) COLLATE "pg_catalog"."default",
        "user_registered" date,
        "user_activation_key" varchar(255) COLLATE "pg_catalog"."default",
        "user_status" int4,
        "display_name" varchar(255) COLLATE "pg_catalog"."default",
        "first_name" varchar(255) COLLATE "pg_catalog"."default",
        "last_name" varchar(255) COLLATE "pg_catalog"."default"
      );
      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";
      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_users_pkey" PRIMARY KEY ("id");
      SELECT setval('"public"."pw_users_id_seq"', 1, false);
    `;
  }

  static async getSqlForTablePageTemplates(table) {
    return `
      DROP TABLE IF EXISTS "public"."${table}";

      CREATE TABLE "public"."${table}" (
        "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
          INCREMENT 1
          MINVALUE 1
          MAXVALUE 2147483647
          START 1
          CACHE 1
        ),
        "name" varchar(255) COLLATE "pg_catalog"."default",
        "file_name" varchar(255) COLLATE "pg_catalog"."default"
      );

      ALTER TABLE "public"."${table}" OWNER TO "phrase_works_user";

      ALTER TABLE "public"."${table}" ADD CONSTRAINT "pw_page_templates_pkey" PRIMARY KEY ("id");

      SELECT setval('"public"."${table}"', 1, false);
    `;
  }
}
