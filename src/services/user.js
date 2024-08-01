import { UsersCollection } from '../db/models/user.js';

export const updateUser = async (id, payload = {}, userId) => {
  const updateOptions = { new: true, includeResultMetadata: true };
  const rawResult = await UsersCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    updateOptions,
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    user: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upsert),
  };
};

export const getUserById = async (id, userId) => {
  return await UsersCollection.findOne({ _id: id, userId });
};
