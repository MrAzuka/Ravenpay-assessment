/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("transaction_notifications", (table) => {
        table.increments("id").primary();
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.enu("event", ["transfer", "transfer_failed"]).notNullable();
        table.decimal("amount", 15, 2).notNullable();
        table.string("recipient_bank", 255).notNullable();
        table.string("recipient_account", 255).notNullable();
        table.string("status", 50);
        table.string("reference", 255).unique();
        table.string("narration", 255);
        table.text("err_msg");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("transaction_notifications");
};
