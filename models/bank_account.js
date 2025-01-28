const db = require("./db");
const findBankAccountByUser = async ({ user_id }) => {
  return await db("bank_accounts")
    .where({
      user_id,
    })
    .first();
};

const createBankAccount = async (newAccount) => {
  await db("bank_accounts").insert(newAccount);
};

const updateBankAccount = async (userId, updates) => {
  const query = db("bank_accounts").where({ user_id: userId }).update(updates);
  await query;
  const [updatedBankAccount] = await db("bank_accounts")
    .where({ user_id: userId })
    .select("*");
  return updatedBankAccount;
};
module.exports = {
  findBankAccountByUser,
  createBankAccount,
  updateBankAccount,
};
