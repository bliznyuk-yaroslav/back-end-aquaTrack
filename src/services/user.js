import { UsersCollection } from '../db/models/user.js';

export const updateUser = async (id, payload = {}) => {
  const updateOptions = { new: true, includeResultMetadata: true };
  const user = await UsersCollection.findByIdAndUpdate(
    id,
    payload,
    updateOptions,
  );

  if (!user || !user.value) return null;

  return {
    user: user.value,
    isNew: Boolean(user?.lastErrorObject?.upsert),
  };
};

export const getUserById = async (id) => {
  return await UsersCollection.findOne(id);
};
export const updateAvatar = async (id, payload = {}) => {
  const updateOptions = { new: true, includeResultMetadata: true };
  const rawResult = await UsersCollection.findOneAndUpdate(
    id,
    payload,
    updateOptions,
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    user: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upsert),
  };
};
