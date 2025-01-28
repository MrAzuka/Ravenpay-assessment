/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("bank_accounts", (table) => {
        table.increments("id").primary();
        table.integer("user_id").unsigned().notNullable();
        table.string("account_number", 20).notNullable().unique();
        table.decimal("balance", 15, 2).notNullable().defaultTo(0.0);
        table.string("account_name").notNullable();
        table.string("bank").notNullable();
        table.decimal("amount", 15, 2).defaultTo(0.0);
        table.boolean("is_permanent").notNullable().defaultTo(false);
        table.timestamps(true, true);

        table
            .foreign("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("bank_accounts");
};
